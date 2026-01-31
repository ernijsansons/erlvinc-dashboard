import { Card, CardContent } from '@/components/ui/card'

export default function PersonalDomainPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-wide">Personal Domain</h1>
        <p className="text-[#64748b] mt-2">Personal goals and projects</p>
      </div>

      <Card className="bg-[#111827] border-[#1e293b]">
        <CardContent className="p-8 text-center">
          <p className="text-[#64748b]">Personal development and initiatives</p>
          <p className="text-[#64748b] text-sm mt-2">Filtered view - Domain filtering to be implemented in Task 014</p>
        </CardContent>
      </Card>
    </div>
  )
}
