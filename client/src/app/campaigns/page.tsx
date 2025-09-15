'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { CampaignList } from '@/components/campaign/campaign-list'

export default function CampaignsPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign History</h1>
          <p className="text-muted-foreground">
            View and manage all your marketing campaigns
          </p>
        </div>
        <CampaignList />
      </div>
    </ProtectedRoute>
  )
}