'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  TrendingUp,
  Users,
  User,
  Wrench,
  Target,
  DollarSign,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Download
} from 'lucide-react'

export default function DeepResearchPage() {
  const params = useParams()
  const router = useRouter()
  const opportunityId = params.id as string

  const [opportunity, setOpportunity] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string>('overview')

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

      // Check if deep research exists
      if (!data.market_validation || data.research_tier !== 'deep') {
        setError('Deep research not available. Run research first.')
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
        <div className="text-[#64748b]">Loading deep research...</div>
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

  const recommendation = opportunity.betty_recommendation || 'Pending'
  const confidence = opportunity.betty_confidence || 0
  const reasoning = opportunity.betty_reasoning?.split('\n').filter((r: string) => r.trim()) || []

  // Extract all research modules
  const market = opportunity.market_validation || {}
  const competitors = opportunity.competitor_analysis || {}
  const personas = opportunity.customer_personas || {}
  const tech = opportunity.tech_stack_recommendation || {}
  const gtm = opportunity.gtm_strategy || {}
  const financial = opportunity.financial_projections || {}
  const risk = opportunity.risk_analysis || {}
  const brand = opportunity.brand_identity || {}

  // Navigation sections
  const sections = [
    { id: 'overview', label: 'Overview', icon: CheckCircle2 },
    { id: 'market', label: 'Market Validation', icon: TrendingUp },
    { id: 'competitors', label: 'Competitive Landscape', icon: Users },
    { id: 'personas', label: 'Customer Personas', icon: User },
    { id: 'tech', label: 'Tech Stack', icon: Wrench },
    { id: 'gtm', label: 'GTM Strategy', icon: Target },
    { id: 'financial', label: 'Financial Projections', icon: DollarSign },
    { id: 'risk', label: 'Risk Analysis', icon: AlertTriangle },
    { id: 'brand', label: 'Brand Identity', icon: Sparkles }
  ]

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(`section-${sectionId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="flex gap-6">
      {/* Sticky Navigation Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-6 space-y-2">
          <h3 className="text-sm font-medium text-[#64748b] mb-4">SECTIONS</h3>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === section.id
                  ? 'bg-[#22d3ee]/10 text-[#22d3ee]'
                  : 'text-[#64748b] hover:bg-[#1e293b] hover:text-white'
              }`}
            >
              <section.icon className="h-4 w-4" />
              <span>{section.label}</span>
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-[#1e293b]">
            <Button
              size="sm"
              variant="outline"
              className="w-full text-white border-[#1e293b]"
              onClick={() => window.print()}
            >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/labs')}
            className="text-[#64748b] hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Labs
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{opportunity.title}</h1>
            <p className="text-lg text-[#64748b]">{opportunity.niche}</p>
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="outline" className="text-white">
                Score: {opportunity.score}/100
              </Badge>
              <Badge variant="outline" className="text-white">
                Deep Research (25 Pages)
              </Badge>
              <Badge
                variant="outline"
                className={`${
                  recommendation === 'GO'
                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                    : recommendation === 'NO-GO'
                    ? 'bg-red-500/10 text-red-500 border-red-500/20'
                    : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                }`}
              >
                {recommendation}
              </Badge>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div id="section-overview">
          <Card className="bg-[#111827] border-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                {recommendation === 'GO' ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recommendation */}
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <p className="text-sm text-[#64748b] mb-2">Final Recommendation</p>
                  <p className="text-3xl font-bold text-white">{recommendation}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#64748b] mb-2">Confidence Level</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-[#1e293b] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          confidence >= 8
                            ? 'bg-green-500'
                            : confidence >= 6
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${confidence * 10}%` }}
                      />
                    </div>
                    <span className="text-2xl font-bold text-white">{confidence}/10</span>
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-4 gap-4">
                {market.tam && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-xs text-[#64748b] mb-1">TAM</p>
                    <p className="text-lg font-bold text-white">{market.tam}</p>
                  </div>
                )}
                {competitors.competitor_count !== undefined && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-xs text-[#64748b] mb-1">Competitors</p>
                    <p className="text-lg font-bold text-white">{competitors.competitor_count}</p>
                  </div>
                )}
                {tech.mvp_cost && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-xs text-[#64748b] mb-1">MVP Cost</p>
                    <p className="text-lg font-bold text-white">{tech.mvp_cost}</p>
                  </div>
                )}
                {financial.year1_revenue && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-xs text-[#64748b] mb-1">Year 1 Revenue</p>
                    <p className="text-lg font-bold text-white">{financial.year1_revenue}</p>
                  </div>
                )}
              </div>

              {/* Key Reasoning */}
              {reasoning.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-[#64748b] mb-3">Key Reasoning</p>
                  <div className="space-y-2">
                    {reasoning.slice(0, 10).map((reason: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 bg-[#0f172a] p-3 rounded-lg">
                        <span className="text-[#22d3ee] mt-0.5">•</span>
                        <span className="text-white text-sm">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Module 1: Market Validation */}
        <div id="section-market">
          <Card className="bg-[#111827] border-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#22d3ee]" />
                Market Validation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Market Size Metrics */}
              <div className="grid grid-cols-3 gap-4">
                {market.tam && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">TAM</p>
                    <p className="text-2xl font-bold text-white">{market.tam}</p>
                    <p className="text-xs text-[#64748b] mt-1">Total Addressable Market</p>
                  </div>
                )}
                {market.sam && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">SAM</p>
                    <p className="text-2xl font-bold text-white">{market.sam}</p>
                    <p className="text-xs text-[#64748b] mt-1">Serviceable Available Market</p>
                  </div>
                )}
                {market.som && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">SOM</p>
                    <p className="text-2xl font-bold text-white">{market.som}</p>
                    <p className="text-xs text-[#64748b] mt-1">Serviceable Obtainable Market</p>
                  </div>
                )}
              </div>

              {/* Growth & Maturity */}
              <div className="grid grid-cols-2 gap-4">
                {market.growth_rate && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">Growth Rate</p>
                    <p className="text-xl font-bold text-green-500">{market.growth_rate}</p>
                  </div>
                )}
                {market.market_stage && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">Market Stage</p>
                    <p className="text-xl font-bold text-white">{market.market_stage}</p>
                  </div>
                )}
              </div>

              {/* Full Analysis */}
              {market.full_analysis && (
                <div className="prose prose-invert max-w-none">
                  <div className="bg-[#0f172a] p-6 rounded-lg">
                    <pre className="text-[#94a3b8] whitespace-pre-wrap text-sm font-sans leading-relaxed">
                      {market.full_analysis}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Module 2: Competitive Landscape */}
        <div id="section-competitors">
          <Card className="bg-[#111827] border-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-[#22d3ee]" />
                Competitive Landscape
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Competitive Metrics */}
              <div className="grid grid-cols-3 gap-4">
                {competitors.competitor_count !== undefined && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">Total Competitors</p>
                    <p className="text-3xl font-bold text-white">{competitors.competitor_count}</p>
                  </div>
                )}
                {competitors.market_leader && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">Market Leader</p>
                    <p className="text-xl font-bold text-white">{competitors.market_leader}</p>
                  </div>
                )}
                {competitors.pricing_range && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">Pricing Range</p>
                    <p className="text-xl font-bold text-white">{competitors.pricing_range}</p>
                  </div>
                )}
              </div>

              {/* Competitive Gaps */}
              {competitors.key_gaps && (
                <div className="bg-[#0f172a] p-4 rounded-lg">
                  <p className="text-sm font-medium text-[#64748b] mb-3">Key Competitive Gaps</p>
                  <p className="text-white">{competitors.key_gaps}</p>
                </div>
              )}

              {/* Full Analysis */}
              {competitors.full_analysis && (
                <div className="prose prose-invert max-w-none">
                  <div className="bg-[#0f172a] p-6 rounded-lg">
                    <pre className="text-[#94a3b8] whitespace-pre-wrap text-sm font-sans leading-relaxed">
                      {competitors.full_analysis}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Module 3: Customer Personas */}
        <div id="section-personas">
          <Card className="bg-[#111827] border-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-[#22d3ee]" />
                Customer Personas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Persona Highlight */}
              {personas.primary_persona && (
                <div className="bg-gradient-to-r from-[#22d3ee]/10 to-transparent p-6 rounded-lg border border-[#22d3ee]/20">
                  <p className="text-sm text-[#64748b] mb-2">Primary Target Persona</p>
                  <p className="text-2xl font-bold text-white mb-4">{personas.primary_persona}</p>
                  {personas.persona_details && (
                    <p className="text-[#94a3b8]">{personas.persona_details}</p>
                  )}
                </div>
              )}

              {/* Full Analysis */}
              {personas.full_analysis && (
                <div className="prose prose-invert max-w-none">
                  <div className="bg-[#0f172a] p-6 rounded-lg">
                    <pre className="text-[#94a3b8] whitespace-pre-wrap text-sm font-sans leading-relaxed">
                      {personas.full_analysis}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Module 4: Tech Stack */}
        <div id="section-tech">
          <Card className="bg-[#111827] border-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wrench className="h-5 w-5 text-[#22d3ee]" />
                Tech Stack Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cost & Timeline */}
              <div className="grid grid-cols-3 gap-4">
                {tech.mvp_cost && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">MVP Cost</p>
                    <p className="text-2xl font-bold text-white">{tech.mvp_cost}</p>
                  </div>
                )}
                {tech.build_weeks && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">Build Timeline</p>
                    <p className="text-2xl font-bold text-white">{tech.build_weeks}</p>
                  </div>
                )}
                {tech.recommended_stack && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">Recommended Stack</p>
                    <p className="text-lg font-bold text-white">{tech.recommended_stack}</p>
                  </div>
                )}
              </div>

              {/* Full Analysis */}
              {tech.full_analysis && (
                <div className="prose prose-invert max-w-none">
                  <div className="bg-[#0f172a] p-6 rounded-lg">
                    <pre className="text-[#94a3b8] whitespace-pre-wrap text-sm font-sans leading-relaxed">
                      {tech.full_analysis}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Module 5: GTM Strategy */}
        <div id="section-gtm">
          <Card className="bg-[#111827] border-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-[#22d3ee]" />
                Go-to-Market Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key GTM Metrics */}
              <div className="grid grid-cols-2 gap-4">
                {gtm.estimated_cac && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">Estimated CAC</p>
                    <p className="text-2xl font-bold text-white">{gtm.estimated_cac}</p>
                  </div>
                )}
                {gtm.top_channels && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">Top Channels</p>
                    <p className="text-lg font-bold text-white">{gtm.top_channels}</p>
                  </div>
                )}
              </div>

              {/* Pricing Tiers */}
              {gtm.pricing_tiers && (
                <div className="bg-[#0f172a] p-4 rounded-lg">
                  <p className="text-sm font-medium text-[#64748b] mb-3">Pricing Tiers</p>
                  <p className="text-white whitespace-pre-wrap">{gtm.pricing_tiers}</p>
                </div>
              )}

              {/* Full Analysis */}
              {gtm.full_analysis && (
                <div className="prose prose-invert max-w-none">
                  <div className="bg-[#0f172a] p-6 rounded-lg">
                    <pre className="text-[#94a3b8] whitespace-pre-wrap text-sm font-sans leading-relaxed">
                      {gtm.full_analysis}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Module 6: Financial Projections */}
        <div id="section-financial">
          <Card className="bg-[#111827] border-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#22d3ee]" />
                Financial Projections
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Financial Metrics */}
              <div className="grid grid-cols-4 gap-4">
                {financial.year1_revenue && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">Year 1 Revenue</p>
                    <p className="text-xl font-bold text-green-500">{financial.year1_revenue}</p>
                  </div>
                )}
                {financial.breakeven_month && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">Breakeven</p>
                    <p className="text-xl font-bold text-white">{financial.breakeven_month}</p>
                  </div>
                )}
                {financial.ltv_cac_ratio && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">LTV:CAC Ratio</p>
                    <p className="text-xl font-bold text-white">{financial.ltv_cac_ratio}</p>
                  </div>
                )}
                {financial.funding_needed && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <p className="text-sm text-[#64748b] mb-1">Funding Needed</p>
                    <p className="text-xl font-bold text-white">{financial.funding_needed}</p>
                  </div>
                )}
              </div>

              {/* Full Analysis */}
              {financial.full_analysis && (
                <div className="prose prose-invert max-w-none">
                  <div className="bg-[#0f172a] p-6 rounded-lg">
                    <pre className="text-[#94a3b8] whitespace-pre-wrap text-sm font-sans leading-relaxed">
                      {financial.full_analysis}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Module 7: Risk Analysis */}
        <div id="section-risk">
          <Card className="bg-[#111827] border-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#22d3ee]" />
                Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risk Level */}
              {risk.risk_level && (
                <div className="bg-[#0f172a] p-4 rounded-lg">
                  <p className="text-sm text-[#64748b] mb-1">Overall Risk Level</p>
                  <p className="text-2xl font-bold text-yellow-500">{risk.risk_level}</p>
                </div>
              )}

              {/* Full Analysis */}
              {risk.full_analysis && (
                <div className="prose prose-invert max-w-none">
                  <div className="bg-[#0f172a] p-6 rounded-lg">
                    <pre className="text-[#94a3b8] whitespace-pre-wrap text-sm font-sans leading-relaxed">
                      {risk.full_analysis}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Module 8: Brand Identity */}
        <div id="section-brand">
          <Card className="bg-[#111827] border-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#22d3ee]" />
                Brand Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Top Name Suggestion */}
              {brand.top_name && (
                <div className="bg-gradient-to-r from-purple-500/10 to-transparent p-6 rounded-lg border border-purple-500/20">
                  <p className="text-sm text-[#64748b] mb-2">Top Name Suggestion</p>
                  <p className="text-3xl font-bold text-white">{brand.top_name}</p>
                </div>
              )}

              {/* Full Analysis */}
              {brand.full_analysis && (
                <div className="prose prose-invert max-w-none">
                  <div className="bg-[#0f172a] p-6 rounded-lg">
                    <pre className="text-[#94a3b8] whitespace-pre-wrap text-sm font-sans leading-relaxed">
                      {brand.full_analysis}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pb-8">
          <Button
            className="flex-1 bg-[#22d3ee] text-black hover:bg-[#22d3ee]/80"
            onClick={() => router.push(`/dashboard/labs/${opportunityId}/discuss`)}
          >
            💬 Discuss with Claude
          </Button>
          <Button
            variant="outline"
            className="text-white border-[#1e293b]"
            onClick={() => window.print()}
          >
            <Download className="mr-2 h-4 w-4" />
            Export to PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/labs')}
            className="text-white border-[#1e293b]"
          >
            Back to Pipeline
          </Button>
        </div>
      </div>
    </div>
  )
}
