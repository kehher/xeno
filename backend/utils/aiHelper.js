export function parseNLToRulesFallback(nlText) {
  const rules = { conditions: [], glue: "AND" };
  const moneyMatch = nlText.match(/â‚¹?\s*([0-9][0-9,]*(?:\.\d+)?)/);
  if (moneyMatch) {
    const raw = moneyMatch[1].replace(/,/g,"");
    const val = Number(raw);
    if (!Number.isNaN(val)) rules.conditions.push({ field: "totalSpend", op: ">", value: val });
  }
  const monthsMatch = nlText.match(/(\d+)\s*(month|months)/i);
  if (monthsMatch) {
    const months = Number(monthsMatch[1]);
    if (months>0) rules.conditions.push({ field: "lastActive", op: "inactive_days", value: months*30 });
  }
  const visitsMatch = nlText.match(/visits?\s*(?:less than|under|<)\s*(\d+)/i);
  if (visitsMatch) rules.conditions.push({ field: "visits", op: "<", value: Number(visitsMatch[1]) });
  if (rules.conditions.length===0) rules.conditions.push({ field: "totalSpend", op: ">", value: 0 });
  return rules;
}
