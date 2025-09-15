'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { CampaignBuilder } from '@/components/campaign/campaign-builder'

export default function NewCampaignPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Campaign</h1>
          <p className="text-muted-foreground">
            Build targeted campaigns with dynamic audience segmentation
          </p>
        </div>
        <CampaignBuilder />
      </div>
    </ProtectedRoute>
  )
}