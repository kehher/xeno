'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { Rule } from './rule'
import { RuleGroup as RuleGroupType, Rule as RuleType } from '@/lib/api'

interface RuleGroupProps {
  ruleGroup: RuleGroupType
  onUpdate: (ruleGroup: RuleGroupType) => void
  onDelete: () => void
  canDelete: boolean
}

export function RuleGroup({ ruleGroup, onUpdate, onDelete, canDelete }: RuleGroupProps) {
  const addRule = () => {
    const newRule: RuleType = {
      field: 'totalSpend',
      operator: '>',
      value: 0,
    }
    onUpdate({
      ...ruleGroup,
      rules: [...ruleGroup.rules, newRule],
    })
  }

  const updateRule = (index: number, rule: RuleType) => {
    const updatedRules = [...ruleGroup.rules]
    updatedRules[index] = rule
    onUpdate({
      ...ruleGroup,
      rules: updatedRules,
    })
  }

  const deleteRule = (index: number) => {
    if (ruleGroup.rules.length > 1) {
      const updatedRules = ruleGroup.rules.filter((_, i) => i !== index)
      onUpdate({
        ...ruleGroup,
        rules: updatedRules,
      })
    }
  }

  const updateConnector = (connector: 'AND' | 'OR') => {
    onUpdate({
      ...ruleGroup,
      connector,
    })
  }

  return (
    <div className="space-y-4 p-6 border-2 border-dashed rounded-lg bg-muted/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Label>Group Connector:</Label>
          <Select value={ruleGroup.connector} onValueChange={updateConnector}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">AND</SelectItem>
              <SelectItem value="OR">OR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {canDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Group
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {ruleGroup.rules.map((rule, index) => (
          <div key={index}>
            <Rule
              rule={rule}
              onUpdate={(updatedRule) => updateRule(index, updatedRule)}
              onDelete={() => deleteRule(index)}
              canDelete={ruleGroup.rules.length > 1}
            />
            {index < ruleGroup.rules.length - 1 && (
              <div className="flex justify-center py-2">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                  {ruleGroup.connector}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button onClick={addRule} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Rule
      </Button>
    </div>
  )
}