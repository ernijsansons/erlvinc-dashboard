import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize NVIDIA client (OpenAI-compatible)
const nvidia = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
})

const primaryModel = process.env.PRIMARY_MODEL || 'moonshotai/kimi-k2.5'
const backupModel = process.env.BACKUP_MODEL || 'deepseek-ai/deepseek-v3.1'

export async function POST(request: NextRequest) {
  try {
    const { opportunityId, message, conversationHistory } = await request.json()

    // Get opportunity details from Supabase
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

    const { data: opportunity } = await supabase
      .from('labs_opportunities')
      .select('*')
      .eq('id', opportunityId)
      .single()

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      )
    }

    // Build system prompt with opportunity context
    const systemPrompt = `You are Claude, a strategic advisor helping evaluate a business opportunity for ERLV Inc.

OPPORTUNITY DETAILS:
- Title: ${opportunity.title}
- Target Niche: ${opportunity.niche || 'Not specified'}
- Capability Unlock: ${opportunity.capability_unlock || 'Not specified'}
- Value Proposition: ${opportunity.initial_value_prop || 'Not specified'}
- Betty's Recommendation: ${opportunity.betty_recommendation || 'Not yet evaluated'}
${opportunity.betty_reasoning ? `- Betty's Reasoning: ${opportunity.betty_reasoning}` : ''}
${opportunity.betty_confidence ? `- Confidence Level: ${opportunity.betty_confidence}/10` : ''}

Your role is to:
1. Provide strategic insights on this opportunity
2. Challenge assumptions and identify risks
3. Suggest validation approaches
4. Help make an informed GO/NO-GO decision
5. Consider market fit, technical feasibility, and competitive landscape

Be direct, insightful, and focused on helping make the best strategic decision. Ask clarifying questions when needed.`

    // Convert conversation history to OpenAI format
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ]

    try {
      console.log('Using NVIDIA API with model:', primaryModel)

      // Call NVIDIA API (Kimi 2.5)
      const response = await nvidia.chat.completions.create({
        model: primaryModel,
        messages: messages,
        max_tokens: 2048,
        temperature: 1.0,
        top_p: 0.95,
      })

      const assistantMessage = response.choices[0]?.message?.content || 'Unable to generate response'

      return NextResponse.json({
        response: assistantMessage,
      })
    } catch (error) {
      console.error('Kimi 2.5 failed, falling back to DeepSeek:', error)

      // Fallback to DeepSeek
      const response = await nvidia.chat.completions.create({
        model: backupModel,
        messages: messages,
        max_tokens: 2048,
      })

      const assistantMessage = response.choices[0]?.message?.content || 'Unable to generate response'

      return NextResponse.json({
        response: assistantMessage,
      })
    }
  } catch (error) {
    console.error('Error in discussion API:', error)
    return NextResponse.json(
      { error: 'Failed to generate response', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
