import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateRules = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      // Fallback to rule-based parsing if no OpenAI key
      const fallbackRules = parseNLToRulesFallback(prompt);
      return res.json({ ruleGroups: [fallbackRules] });
    }

    const systemPrompt = `You are an AI assistant that converts natural language descriptions into structured audience segmentation rules for a CRM system.

Available fields:
- totalSpend: Customer's total spending amount (number)
- visits: Number of visits/orders (number)  
- lastActive: Days since last activity (number, where higher = more inactive)

Available operators: >, <, >=, <=, =, !=

Convert the user's natural language into a JSON structure with this format:
{
  "ruleGroups": [
    {
      "rules": [
        {
          "field": "totalSpend",
          "operator": ">",
          "value": 1000
        }
      ],
      "connector": "AND"
    }
  ]
}

Rules within a group are connected by the connector (AND/OR).
Multiple groups are connected by OR.

Examples:
- "customers who spent more than $1000" → totalSpend > 1000
- "visited less than 3 times" → visits < 3
- "inactive for more than 30 days" → lastActive > 30
- "high spenders with few visits" → totalSpend > 5000 AND visits < 5

Return only valid JSON, no explanations.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse the AI response
    let parsedRules;
    try {
      parsedRules = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      // Fallback to rule-based parsing
      const fallbackRules = parseNLToRulesFallback(prompt);
      return res.json({ ruleGroups: [fallbackRules] });
    }

    // Validate the structure
    if (!parsedRules.ruleGroups || !Array.isArray(parsedRules.ruleGroups)) {
      throw new Error('Invalid rule structure from AI');
    }

    res.json(parsedRules);
  } catch (error) {
    console.error('AI generation error:', error);
    
    // Fallback to rule-based parsing
    try {
      const fallbackRules = parseNLToRulesFallback(req.body.prompt);
      res.json({ ruleGroups: [fallbackRules] });
    } catch (fallbackError) {
      res.status(500).json({ error: 'Failed to generate rules' });
    }
  }
};

// Fallback rule-based parsing for when AI is not available
function parseNLToRulesFallback(nlText) {
  const rules = [];
  const text = nlText.toLowerCase();

  // Extract spending amounts
  const spendMatches = text.match(/(?:spent?|spending?|spend)\s*(?:more than|over|above|>)\s*(?:\$|₹)?\s*([0-9,]+)/i);
  if (spendMatches) {
    const amount = parseInt(spendMatches[1].replace(/,/g, ''));
    rules.push({ field: 'totalSpend', operator: '>', value: amount });
  }

  const spendLessMatches = text.match(/(?:spent?|spending?|spend)\s*(?:less than|under|below|<)\s*(?:\$|₹)?\s*([0-9,]+)/i);
  if (spendLessMatches) {
    const amount = parseInt(spendLessMatches[1].replace(/,/g, ''));
    rules.push({ field: 'totalSpend', operator: '<', value: amount });
  }

  // Extract visit counts
  const visitMatches = text.match(/(?:visit|visits|visited)\s*(?:more than|over|above|>)\s*([0-9]+)/i);
  if (visitMatches) {
    const count = parseInt(visitMatches[1]);
    rules.push({ field: 'visits', operator: '>', value: count });
  }

  const visitLessMatches = text.match(/(?:visit|visits|visited)\s*(?:less than|under|below|<)\s*([0-9]+)/i);
  if (visitLessMatches) {
    const count = parseInt(visitLessMatches[1]);
    rules.push({ field: 'visits', operator: '<', value: count });
  }

  // Extract inactivity periods
  const inactiveMatches = text.match(/(?:inactive|not active)\s*(?:for\s*)?(?:more than|over|above|>)?\s*([0-9]+)\s*days?/i);
  if (inactiveMatches) {
    const days = parseInt(inactiveMatches[1]);
    rules.push({ field: 'lastActive', operator: '>', value: days });
  }

  // Default rule if nothing found
  if (rules.length === 0) {
    rules.push({ field: 'totalSpend', operator: '>', value: 0 });
  }

  return {
    rules,
    connector: 'AND'
  };
}