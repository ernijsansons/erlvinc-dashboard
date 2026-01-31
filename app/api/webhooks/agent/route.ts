import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const secret = request.headers.get('x-webhook-secret')
    if (secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Initialize Supabase with service role key
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }>) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Insert event into agent_events table
    const { error } = await supabase
      .from('agent_events')
      .insert({
        agent: body.agent,
        event_type: body.event_type,
        task_id: body.task_id,
        payload: body.payload,
      })

    if (error) {
      console.error('Failed to insert event:', error)
      return NextResponse.json(
        { error: 'Failed to process event' },
        { status: 500 }
      )
    }

    // Handle specific event types
    if (body.event_type === 'task_completed' && body.task_id) {
      // Update task status to done
      await supabase
        .from('tasks')
        .update({ status: 'done', updated_at: new Date().toISOString() })
        .eq('id', body.task_id)
    } else if (body.event_type === 'task_started' && body.task_id) {
      // Update task status to in_progress
      await supabase
        .from('tasks')
        .update({ status: 'in_progress', updated_at: new Date().toISOString() })
        .eq('id', body.task_id)
    }

    return NextResponse.json(
      { success: true, message: 'Event processed' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
