'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Loader2 } from 'lucide-react'
import { generateRulesFromText, RuleGroup } from '@/lib/api'
import { toast } from 'sonner'

interface AIRuleGeneratorProps {
  onRulesGenerated: (ruleGroups: RuleGroup[]) => void
}

export function AIRuleGenerator({ onRulesGenerated }: AIRuleGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerateRules = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description of your target audience')
      return
    }

    setLoading(true)

    try {
      const result = await generateRulesFromText(prompt)
      onRulesGenerated(result.ruleGroups)
      toast.success('Rules generated successfully! You can now fine-tune them below.')
      setPrompt('') // Clear the prompt after successful generation
    } catch (error) {
      console.error('Failed to generate rules:', error)
      toast.error('Failed to generate rules. Please try again or create rules manually.')
    } finally {
      setLoading(false)
    }
  }

  const examplePrompts = [
    "High-value customers who spent more than $5000",
    "Inactive customers who haven't visited in 60 days",
    "Frequent visitors with more than 10 visits but low spending",
    "New customers who spent less than $100 and visited only once"
  ]

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Rule Generator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Describe your target audience in plain English, and AI will generate the rules for you
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="ai-prompt">Describe your target audience</Label>
          <Textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., customers who spent more than $1000 and visited less than 5 times"
            rows={3}
            className="mt-2"
          />
        </div>

        <Button 
          onClick={handleGenerateRules} 
          disabled={loading || !prompt.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Rules...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Rules with AI
            </>
          )}
        </Button>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Example prompts:</Label>
          <div className="grid grid-cols-1 gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="text-left text-sm text-muted-foreground hover:text-foreground p-2 rounded border border-border hover:border-primary/50 transition-colors"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}