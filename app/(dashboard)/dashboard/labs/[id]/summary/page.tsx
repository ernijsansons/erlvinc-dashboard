'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, TrendingUp, Users, Wrench, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function QuickSummaryPage() {
  const params = useParams()
  const router = useRouter()
  const opportunityId = params.id as string

  const [opportunity, setOpportunity] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    if (opportunityId) {
      fetchOpportunity()
    }
  }, [opportunityId])

  const fetchOpportunity = async () => {
    try {
      const { data, error } = await supabase
        .from('labs_opportunities')
        .select('*')
        .eq('id', opportunityId)
        .single()

      if (error) throw error

      if (!data) {
        setError('Opportunity not found')
        setIsLoading(false)
        return
      }

      // Check if quick summary exists
      if (!data.summary_report || data.research_tier === 'none') {
        setError('Quick summary not available. Run research first.')
        setIsLoading(false)
        return
      }

      setOpportunity(data)
      setIsLoading(false)
    } catch (err: any) {
      console.error('Error fetching opportunity:', err)
      setError(err.message)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#64748b]">Loading summary...</div>
      </div>
    )
  }

  if (error || !opportunity) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/labs')}
          className="text-[#64748b] hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Labs
        </Button>
        <Card className="bg-[#111827] border-[#1e293b]">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-[#64748b] text-lg">{error || 'Something went wrong'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const summary = opportunity.summary_report || {}
  const modules = summary.modules || {}
  const recommendation = opportunity.betty_recommendation || 'Pending'
  const confidence = opportunity.betty_confidence || 0
  const reasoning = opportunity.betty_reasoning?.split('\n') || []

  // Helper to get recommendation badge color
  const getRecommendationColor = () => {
    if (recommendation === 'GO') return 'bg-green-500'
    if (recommendation === 'NO-GO') return 'bg-red-500'
    return 'bg-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/labs')}
            className="text-[#64748b] hover:text-white mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Labs
          </Button>
          <h1 className="text-3xl font-bold text-white">{opportunity.title}</h1>
          <p className="text-[#64748b]">{opportunity.niche}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-white">
              Score: {opportunity.score}/100
            </Badge>
            <Badge variant="outline" className="text-white">
              Quick Summary
            </Badge>
          </div>
        </div>
        <Button
          className="bg-[#22d3ee] text-black hover:bg-[#22d3ee]/80"
          onClick={() => router.push(`/dashboard/labs/${opportunityId}/discuss`)}
        >
          💬 Discuss with Claude
        </Button>
      </div>

      {/* Recommendation Card */}
      <Card className="bg-[#111827] border-[#1e293b]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            {recommendation === 'GO' ? (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-red-500" />
            )}
            Recommendation: {recommendation}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-[#64748b] mb-1">Confidence Level</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      confidence >= 8 ? 'bg-green-500' : confidence >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${confidence * 10}%` }}
                  />
                </div>
                <span className="text-white font-bold">{confidence}/10</span>
              </div>
            </div>
          </div>

          {reasoning.length > 0 && (
            <div>
              <p className="text-sm font-medium text-[#64748b] mb-2">Key Reasoning</p>
              <ul className="space-y-2">
                {reasoning.slice(0, 5).map((reason: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#22d3ee] mt-1">•</span>
                    <span className="text-white">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Overview */}
      {modules.market_overview && (
        <Card className="bg-[#111827] border-[#1e293b]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#22d3ee]" />
              Market Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {modules.market_overview.tam_estimate && (
                <div className="bg-[#0f172a] p-4 rounded-lg">
                  <p className="text-sm text-[#64748b] mb-1">TAM Estimate</p>
                  <p className="text-xl font-bold text-white">{modules.market_overview.tam_estimate}</p>
                </div>
              )}
              {modules.market_overview.growth_trend && (
                <div className="bg-[#0f172a] p-4 rounded-lg">
                  <p className="text-sm text-[#64748b] mb-1">Growth Trend</p>
                  <p className="text-xl font-bold text-white">{modules.market_overview.growth_trend}</p>
                </div>
              )}
              {modules.market_overview.market_maturity && (
                <div className="bg-[#0f172a] p-4 rounded-lg">
                  <p className="text-sm text-[#64748b] mb-1">Market Maturity</p>
                  <p className="text-xl font-bold text-white">{modules.market_overview.market_maturity}</p>
                </div>
              )}
            </div>
            {modules.market_overview.summary && (
              <div className="prose prose-invert max-w-none">
                <p className="text-[#94a3b8] whitespace-pre-wrap">{modules.market_overview.summary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Competitors */}
      {modules.competitors && (
        <Card className="bg-[#111827] border-[#1e293b]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-[#22d3ee]" />
              Competitive Landscape
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {modules.competitors.competitor_count !== undefined && (
                <div className="bg-[#0f172a] p-4 rounded-lg">
                  <p className="text-sm text-[#64748b] mb-1">Competitors Found</p>
                  <p className="text-xl font-bold text-white">{modules.competitors.competitor_count}</p>
                </div>
              )}
              {modules.competitors.competitive_intensity && (
                <div className="bg-[#0f172a] p-4 rounded-lg">
                  <p className="text-sm text-[#64748b] mb-1">Competitive Intensity</p>
                  <p className="text-xl font-bold text-white">{modules.competitors.competitive_intensity}</p>
                </div>
              )}
            </div>
            {modules.competitors.summary && (
              <div className="prose prose-invert max-w-none">
                <p className="text-[#94a3b8] whitespace-pre-wrap">{modules.competitors.summary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Use Case */}
      {modules.use_case && (
        <Card className="bg-[#111827] border-[#1e293b]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#22d3ee]" />
              Primary Use Case
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {modules.use_case.primary_persona && (
              <div className="bg-[#0f172a] p-4 rounded-lg">
                <p className="text-sm text-[#64748b] mb-1">Target User</p>
                <p className="text-white">{modules.use_case.primary_persona}</p>
              </div>
            )}
            {modules.use_case.value_proposition && (
              <div className="bg-[#0f172a] p-4 rounded-lg">
                <p className="text-sm text-[#64748b] mb-1">Value Proposition</p>
                <p className="text-white">{modules.use_case.value_proposition}</p>
              </div>
            )}
            {modules.use_case.summary && (
              <div className="prose prose-invert max-w-none">
                <p className="text-[#94a3b8] whitespace-pre-wrap">{modules.use_case.summary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tech Assessment */}
      {modules.tech_assessment && (
        <Card className="bg-[#111827] border-[#1e293b]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wrench className="h-5 w-5 text-[#22d3ee]" />
              Technical Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {modules.tech_assessment.feasibility_score !== undefined && (
                <div className="bg-[#0f172a] p-4 rounded-lg">
                  <p className="text-sm text-[#64748b] mb-1">Feasibility Score</p>
                  <p className="text-xl font-bold text-white">{modules.tech_assessment.feasibility_score}/10</p>
                </div>
              )}
              {modules.tech_assessment.estimated_mvp_weeks && (
                <div className="bg-[#0f172a] p-4 rounded-lg">
                  <p className="text-sm text-[#64748b] mb-1">MVP Timeline</p>
                  <p className="text-xl font-bold text-white">{modules.tech_assessment.estimated_mvp_weeks} weeks</p>
                </div>
              )}
              {modules.tech_assessment.cost_estimate?.mvp && (
                <div className="bg-[#0f172a] p-4 rounded-lg">
                  <p className="text-sm text-[#64748b] mb-1">MVP Cost</p>
                  <p className="text-xl font-bold text-white">{modules.tech_assessment.cost_estimate.mvp}/month</p>
                </div>
              )}
            </div>
            {modules.tech_assessment.summary && (
              <div className="prose prose-invert max-w-none">
                <p className="text-[#94a3b8] whitespace-pre-wrap">{modules.tech_assessment.summary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          className="flex-1 bg-[#22d3ee] text-black hover:bg-[#22d3ee]/80"
          onClick={() => router.push(`/dashboard/labs/${opportunityId}/discuss`)}
        >
          💬 Discuss Strategy
        </Button>
        {/* If deep research exists, show View button. Otherwise, show trigger button */}
        {opportunity.research_tier === 'deep' && opportunity.market_validation ? (
          <Button
            className="flex-1 bg-purple-500 text-white hover:bg-purple-600"
            onClick={() => router.push(`/dashboard/labs/${opportunityId}/research`)}
          >
            📊 View Deep Research (25 Pages)
          </Button>
        ) : recommendation === 'GO' && (
          <Button
            className="flex-1 bg-green-500 text-white hover:bg-green-600"
            onClick={() => {
              // Trigger deep research via Telegram
              alert('To trigger deep research, run:\n\n/deep_research ' + opportunityId + '\n\nin Telegram.')
            }}
          >
            🔬 Trigger Deep Research
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/labs')}
          className="text-white border-[#1e293b]"
        >
          Back to Pipeline
        </Button>
      </div>
    </div>
  )
}
