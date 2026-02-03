import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ClaireData {
  signals: any[]
  trades: any[]
  config: any
}

export function useRealtimeClaire() {
  const [data, setData] = useState<ClaireData>({
    signals: [],
    trades: [],
    config: null,
  })
  const supabase = createClient()

  useEffect(() => {
    // Initial fetch
    Promise.all([
      supabase
        .from('claire_signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('claire_trades')
        .select('*')
        .eq('status', 'open'),
      supabase
        .from('claire_config')
        .select('*')
        .eq('id', 'default')
        .single(),
    ]).then(([signals, trades, config]) => {
      setData({
        signals: signals.data || [],
        trades: trades.data || [],
        config: config.data,
      })
    })

    // Subscribe to signals
    const signalsChannel = supabase
      .channel('claire-signals')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'claire_signals' },
        (payload) => {
          const newRecord = payload.new as any
          setData(prev => ({
            ...prev,
            signals: payload.eventType === 'INSERT'
              ? [newRecord, ...prev.signals]
              : prev.signals.map(s =>
                  s.id === newRecord.id ? newRecord : s
                ),
          }))
        }
      )
      .subscribe()

    // Subscribe to trades
    const tradesChannel = supabase
      .channel('claire-trades')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'claire_trades' },
        (payload) => {
          const newTrade = payload.new as any
          setData(prev => ({
            ...prev,
            trades: payload.eventType === 'INSERT'
              ? [newTrade, ...prev.trades]
              : prev.trades.map(t =>
                  t.id === newTrade.id ? newTrade : t
                ),
          }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(signalsChannel)
      supabase.removeChannel(tradesChannel)
    }
  }, [])

  return data
}
