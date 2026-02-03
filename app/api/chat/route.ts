import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export const runtime = 'edge'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: any[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Fetch context from database
    const { data: projects } = await supabase
      .from('projects')
      .select('id, name, status, primary_agent')
      .limit(5)

    const { data: tasks } = await supabase
      .from('tasks')
      .select('id, title, status, assigned_agent')
      .eq('status', 'in_progress')
      .limit(10)

    // LABS opportunities (optional - table may not exist yet)
    let opportunities = null
    try {
      const { data } = await supabase
        .from('labs_opportunities')
        .select('id, title, status, betty_recommendation')
        .limit(5)
      opportunities = data
    } catch (error) {
      console.log('LABS table not yet created, skipping opportunities context')
    }

    const systemPrompt = `You are Claude, the strategic advisor and COO of ERLV Inc. You help manage:

**AI AGENTS:**
- Janis (Senior Developer) - Codes features, fixes bugs, manages infrastructure on Oracle VM
- Betty (Research Analyst) - Deep market research, validates opportunities on GCP VM
- Claire (Trading Strategist) - Generates trading signals for Polymarket, can work solo or with Betty
- Jon (Trade Executor) - Executes trades on Polymarket based on Claire's signals

**CURRENT CONTEXT:**
Active Projects: ${projects?.length || 0}
${projects?.map(p => `- ${p.name} (${p.status}) - Agent: ${p.primary_agent}`).join('\n') || 'No active projects'}

In-Progress Tasks: ${tasks?.length || 0}
${tasks?.map(t => `- ${t.title} (${t.assigned_agent || 'unassigned'})`).join('\n') || 'No tasks in progress'}

LABS Opportunities: ${opportunities?.length || 0}
${opportunities?.map(o => `- ${o.title} (${o.status}) - Betty: ${o.betty_recommendation || 'pending'}`).join('\n') || 'No opportunities'}

**YOUR ROLE:**
- Provide strategic guidance on operations, projects, and opportunities
- Help assign tasks to the appropriate AI agents
- Evaluate LABS opportunities and provide decision support
- Monitor agent performance and suggest optimizations
- Be concise, insightful, and action-oriented

Answer user questions about ERLV Inc operations, provide strategic advice, and help make decisions.`

    console.log('[Chat API] Making direct NVIDIA API call')
    console.log('[Chat API] Raw NVIDIA_BASE_URL env:', JSON.stringify(process.env.NVIDIA_BASE_URL))
    console.log('[Chat API] Raw PRIMARY_MODEL env:', JSON.stringify(process.env.PRIMARY_MODEL))
    console.log('[Chat API] NVIDIA_API_KEY present:', !!process.env.NVIDIA_API_KEY)
    console.log('[Chat API] NVIDIA_API_KEY length:', process.env.NVIDIA_API_KEY?.length)

    // Clean and construct endpoint URL
    let baseURL = (process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1').trim()

    // Remove trailing slash if present
    if (baseURL.endsWith('/')) {
      baseURL = baseURL.slice(0, -1)
    }

    // Always construct full path (baseURL should already include /v1)
    const endpoint = `${baseURL}/chat/completions`
    // Kimi K2.5 for thinking mode
    const model = process.env.PRIMARY_MODEL || 'moonshotai/kimi-k2.5'

    console.log('[Chat API] Final endpoint:', endpoint)
    console.log('[Chat API] Final model:', model)
    console.log('[Chat API] Base URL value:', baseURL)

    // Direct fetch to NVIDIA API - bypassing AI SDK
    const nvidiaResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
          temperature: 1.0,
          top_p: 0.95,
          max_tokens: 8192,  // Increased for Kimi K2.5 thinking mode
          stream: true,
        }),
      }
    )

    console.log('[Chat API] NVIDIA response status:', nvidiaResponse.status)

    if (!nvidiaResponse.ok) {
      const errorText = await nvidiaResponse.text()
      console.error('[Chat API] NVIDIA error:', errorText)
      console.error('[Chat API] Failed endpoint was:', endpoint)
      console.error('[Chat API] Base URL env var:', process.env.NVIDIA_BASE_URL)
      throw new Error(`NVIDIA API error: ${nvidiaResponse.status} - ${errorText} | Endpoint: ${endpoint}`)
    }

    console.log('[Chat API] Creating streaming response')

    // Return the raw stream from NVIDIA
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log('[Chat API] Starting to process NVIDIA stream')
          const reader = nvidiaResponse.body?.getReader()
          if (!reader) {
            throw new Error('No response body from NVIDIA')
          }

          let chunkCount = 0
          let done = false

          while (!done) {
            const { value, done: readerDone } = await reader.read()
            done = readerDone

            if (value) {
              chunkCount++
              const chunkText = decoder.decode(value, { stream: true })
              console.log('[Chat API] Chunk', chunkCount, 'length:', chunkText.length)

              // Parse SSE format (data: {...})
              const lines = chunkText.split('\n').filter(line => line.trim())
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const jsonStr = line.substring(6)
                  if (jsonStr === '[DONE]') {
                    console.log('[Chat API] Received [DONE] signal')
                    continue
                  }

                  try {
                    const data = JSON.parse(jsonStr)
                    const content = data.choices?.[0]?.delta?.content
                    if (content) {
                      console.log('[Chat API] Sending content:', content.substring(0, 50))
                      controller.enqueue(encoder.encode(content))
                    }
                  } catch (e) {
                    console.error('[Chat API] Failed to parse SSE chunk:', e)
                  }
                }
              }
            }
          }

          console.log('[Chat API] Stream complete. Total chunks:', chunkCount)
          controller.close()
        } catch (error) {
          console.error('[Chat API] Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[Chat API] Error:', error)

    // Return detailed error for debugging
    return new Response(
      JSON.stringify({
        error: 'Failed to generate response',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
