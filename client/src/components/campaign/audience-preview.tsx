'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Loader2 } from 'lucide-react'
import { previewAudience, RuleGroup } from '@/lib/api'

interface AudiencePreviewProps {
  ruleGroups: RuleGroup[]
}

export function AudiencePreview({ ruleGroups }: AudiencePreviewProps) {
  const [audienceCount, setAudienceCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAudienceCount = async () => {
      if (ruleGroups.length === 0) {
        setAudienceCount(0)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const result = await previewAudience(ruleGroups)
        setAudienceCount(result.count)
      } catch (err) {
        setError('Failed to fetch audience count')
        setAudienceCount(null)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchAudienceCount, 500)
    return () => clearTimeout(debounceTimer)
  }, [ruleGroups])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Audience Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-muted-foreground">Calculating...</span>
            </>
          ) : error ? (
            <Badge variant="destructive">{error}</Badge>
          ) : (
            <>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {audienceCount?.toLocaleString() || '0'}
              </Badge>
              <span className="text-muted-foreground">
                {audienceCount === 1 ? 'customer' : 'customers'} match your criteria
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}