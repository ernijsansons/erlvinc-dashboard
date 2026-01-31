import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ClaireSettingsPage() {
  const supabase = await createClient()

  const { data: config } = await supabase
    .from('claire_config')
    .select('*')
    .single() as any

  const { data: strategies } = await supabase
    .from('claire_strategy_modes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-wide">Claire Settings</h1>
        <p className="text-[#64748b] mt-2">Configure trading modes and parameters</p>
      </div>

      {/* Global Config */}
      <Card className="bg-[#111827] border-[#1e293b]">
        <CardHeader>
          <CardTitle className="text-white">Global Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#64748b] text-sm mb-2">Operating Mode</label>
              <select className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1e293b] text-white rounded-lg">
                <option value="solo">Solo</option>
                <option value="betty_collab">Betty Collaboration</option>
              </select>
            </div>
            <div>
              <label className="block text-[#64748b] text-sm mb-2">Trading Status</label>
              <select className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1e293b] text-white rounded-lg">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-[#64748b] text-sm mb-2">Max Position Size</label>
              <input
                type="number"
                value={config?.max_position_size || 500}
                className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1e293b] text-white rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[#64748b] text-sm mb-2">Daily Loss Limit</label>
              <input
                type="number"
                value={config?.daily_loss_limit || 100}
                className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1e293b] text-white rounded-lg"
              />
            </div>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="shadow_mode" defaultChecked={config?.shadow_mode} className="mr-2" />
            <label htmlFor="shadow_mode" className="text-white">Shadow Mode (Paper Trading)</label>
          </div>
          <button className="px-6 py-2 bg-[#22d3ee] text-black font-semibold rounded-lg hover:bg-[#22d3ee]/80">
            Save Changes
          </button>
        </CardContent>
      </Card>

      {/* Strategy Configuration */}
      <Card className="bg-[#111827] border-[#1e293b]">
        <CardHeader>
          <CardTitle className="text-white">Strategy Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(strategies || []).map((strategy: any) => (
              <div key={strategy.id} className="p-4 bg-[#0a0f1a] rounded-lg border border-[#1e293b]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold capitalize">{strategy.strategy}</h4>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={strategy.is_enabled} className="mr-2" />
                    <span className="text-[#64748b] text-sm">Enabled</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#64748b] text-sm mb-2">Mode</label>
                    <select className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] text-white rounded-lg text-sm">
                      <option value="solo">Solo</option>
                      <option value="betty_collab">Betty Collab</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#64748b] text-sm mb-2">Capital Allocation</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={strategy.capital_allocation}
                      className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] text-white rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
