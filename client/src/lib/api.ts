import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE + '/api',
  withCredentials: true,
})

export interface Customer {
  _id: string
  name: string
  email: string
  totalSpend: number
  visits: number
  lastActive: string
}

export interface Rule {
  field: string
  operator: string
  value: string | number
}

export interface RuleGroup {
  rules: Rule[]
  connector: 'AND' | 'OR'
}

export interface Campaign {
  _id: string
  name: string
  rules: RuleGroup[]
  message: string
  createdAt: string
  stats?: {
    audienceSize: number
    sent: number
    failed: number
  }
}

export interface CommunicationLog {
  _id: string
  campaignId: string
  customerId: Customer
  message: string
  status: 'SENT' | 'DELIVERED' | 'FAILED'
  timestamp: string
}

// API functions
export const previewAudience = async (ruleGroups: RuleGroup[]): Promise<{ count: number }> => {
  const response = await api.post('/segments/preview', { ruleGroups })
  return response.data
}

export const createCampaign = async (data: {
  name: string
  ruleGroups: RuleGroup[]
  message: string
}): Promise<Campaign> => {
  const response = await api.post('/campaigns', data)
  return response.data.campaign
}

export const getCampaigns = async (): Promise<Campaign[]> => {
  const response = await api.get('/campaigns')
  return response.data
}

export const getCampaignLogs = async (campaignId: string): Promise<CommunicationLog[]> => {
  const response = await api.get(`/campaigns/${campaignId}/logs`)
  return response.data
}

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await api.get('/customers')
  return response.data
}

export const generateRulesFromText = async (prompt: string): Promise<{ ruleGroups: RuleGroup[] }> => {
  const response = await api.post('/ai/generate-rules', { prompt })
  return response.data
}

export default api