import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { streamText, convertToCoreMessages } from 'ai'

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

    // Initialize NVIDIA provider
    const nvidia = createOpenAICompatible({
      name: 'nvidia',
      baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
      headers: {
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
      },
    })

    // Primary model: Kimi 2.5
    const primaryModel = nvidia(process.env.PRIMARY_MODEL || 'moonshotai/kimi-k2.5')
    const backupModel = nvidia(process.env.BACKUP_MODEL || 'deepseek-ai/deepseek-v3.1')

    try {
      console.log('Using NVIDIA API with model:', process.env.PRIMARY_MODEL || 'moonshotai/kimi-k2.5')
      const result = await streamText({
        // @ts-ignore - Model version compatibility issue
        model: primaryModel,
        system: systemPrompt,
        messages: convertToCoreMessages(messages),
        maxTokens: 2048,
        temperature: 1.0,  // Kimi Thinking mode
        topP: 0.95,
      })

      return result.toDataStreamResponse()
    } catch (error) {
      // Fallback to DeepSeek
      console.error('Kimi 2.5 failed, falling back to DeepSeek:', error)

      const result = await streamText({
        // @ts-ignore - Model version compatibility issue
        model: backupModel,
        system: systemPrompt,
        messages: convertToCoreMessages(messages),
        maxTokens: 2048,
      })

      return result.toDataStreamResponse()
    }
  } catch (error) {
    console.error('Error in chat API:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
