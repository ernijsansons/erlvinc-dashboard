import { Card, CardContent } from '@/components/ui/card'

export default function WorkDomainPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-wide">Work Domain</h1>
        <p className="text-[#64748b] mt-2">Business and development projects</p>
      </div>

      <Card className="bg-[#111827] border-[#1e293b]">
        <CardContent className="p-8 text-center">
          <p className="text-[#64748b]">Work-related projects, tasks, and initiatives</p>
          <p className="text-[#64748b] text-sm mt-2">Filtered view - Domain filtering to be implemented in Task 014</p>
        </CardContent>
      </Card>
    </div>
  )
}
