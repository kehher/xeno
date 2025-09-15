'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Eye, Users, Send, AlertCircle } from 'lucide-react'
import { getCampaigns, Campaign } from '@/lib/api'
import { Loading } from '@/components/ui/loading'
import { formatDistanceToNow } from 'date-fns'

export function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getCampaigns()
        setCampaigns(data)
      } catch (err) {
        setError('Failed to fetch campaigns')
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  if (loading) return <Loading />

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No campaigns found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Audience Size</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead>Failed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign._id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {campaign.stats?.audienceSize?.toLocaleString() || '0'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    <Send className="h-3 w-3 mr-1" />
                    {campaign.stats?.sent || 0}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {campaign.stats?.failed || 0}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {(campaign.stats?.sent || 0) > 0 ? 'Completed' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}