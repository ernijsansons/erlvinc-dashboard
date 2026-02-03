import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret')

  // Verify webhook secret
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const payload = await request.json()

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    // Handle different event types
    switch (payload.event) {
      case 'task_started':
        await handleTaskStarted(supabase, payload)
        break

      case 'task_progress':
        await handleTaskProgress(supabase, payload)
        break

      case 'task_completed':
        await handleTaskCompleted(supabase, payload)
        break

      case 'escalation':
        await handleEscalation(supabase, payload)
        break

      case 'approval_request':
        await handleApprovalRequest(supabase, payload)
        break

      default:
        console.log('Unknown event type:', payload.event)
    }

    // Log the event
    await supabase.from('agent_events').insert({
      agent: payload.agent,
      event_type: payload.event,
      task_id: payload.task_id || null,
      payload: payload,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleTaskStarted(
  supabase: any,
  payload: { agent: string; task_id: string }
) {
  await supabase
    .from('tasks')
    .update({
      status: 'in_progress',
      assigned_agent: payload.agent,
      progress: 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', payload.task_id)
}

async function handleTaskProgress(
  supabase: any,
  payload: { task_id: string; progress: number }
) {
  await supabase
    .from('tasks')
    .update({
      progress: payload.progress,
      updated_at: new Date().toISOString(),
    })
    .eq('id', payload.task_id)
}

async function handleTaskCompleted(
  supabase: any,
  payload: {
    agent: string
    task_id: string
    result?: string
    github_pr_url?: string
  }
) {
  await supabase
    .from('tasks')
    .update({
      status: 'review',
      progress: 100,
      github_pr_url: payload.github_pr_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', payload.task_id)
}

async function handleEscalation(
  supabase: any,
  payload: {
    agent: string
    task_id?: string
    question: string
    options?: string[]
    context?: string
  }
) {
  await supabase.from('escalations').insert({
    agent: payload.agent,
    task_id: payload.task_id || null,
    question: payload.question,
    options: payload.options || null,
    context: payload.context || null,
    status: 'pending',
  })
}

async function handleApprovalRequest(
  supabase: any,
  payload: {
    agent: string
    type: string
    project_id?: string
    task_id?: string
    description: string
    details?: any
  }
) {
  await supabase.from('approvals').insert({
    type: payload.type,
    requested_by: payload.agent,
    project_id: payload.project_id || null,
    task_id: payload.task_id || null,
    description: payload.description,
    details: payload.details || null,
    status: 'pending',
  })
}
