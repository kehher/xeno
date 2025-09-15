'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2 } from 'lucide-react'
import { Rule as RuleType } from '@/lib/api'

interface RuleProps {
  rule: RuleType
  onUpdate: (rule: RuleType) => void
  onDelete: () => void
  canDelete: boolean
}

const FIELDS = [
  { value: 'totalSpend', label: 'Total Spend' },
  { value: 'visits', label: 'Visit Count' },
  { value: 'lastActive', label: 'Last Active' },
]

const OPERATORS = [
  { value: '>', label: 'Greater than' },
  { value: '<', label: 'Less than' },
  { value: '>=', label: 'Greater than or equal' },
  { value: '<=', label: 'Less than or equal' },
  { value: '=', label: 'Equal to' },
  { value: '!=', label: 'Not equal to' },
]

export function Rule({ rule, onUpdate, onDelete, canDelete }: RuleProps) {
  const handleFieldChange = (field: string) => {
    onUpdate({ ...rule, field })
  }

  const handleOperatorChange = (operator: string) => {
    onUpdate({ ...rule, operator })
  }

  const handleValueChange = (value: string) => {
    // Convert to number for numeric fields
    const numericValue = ['totalSpend', 'visits'].includes(rule.field) 
      ? parseFloat(value) || 0 
      : value
    onUpdate({ ...rule, value: numericValue })
  }

  return (
    <div className="flex items-end gap-4 p-4 border rounded-lg bg-card">
      <div className="flex-1">
        <Label htmlFor="field">Field</Label>
        <Select value={rule.field} onValueChange={handleFieldChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {FIELDS.map((field) => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Label htmlFor="operator">Operator</Label>
        <Select value={rule.operator} onValueChange={handleOperatorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            {OPERATORS.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Label htmlFor="value">Value</Label>
        <Input
          type={['totalSpend', 'visits'].includes(rule.field) ? 'number' : 'text'}
          value={rule.value}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder="Enter value"
        />
      </div>

      {canDelete && (
        <Button
          variant="outline"
          size="icon"
          onClick={onDelete}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}