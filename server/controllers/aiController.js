/**
 * Civic-AI Engine:
 * Analyzes citizen reports for severity classification, SLA estimation,
 * suggested municipal department routing, and executive dispatch summaries.
 */

const CRITICAL_KEYWORDS = [
  'exposed wire', 'electric shock', 'sparking', 'live wire', 'electrocution',
  'sinkhole', 'cave in', 'collapse', 'deep pothole', 'open manhole', 'missing grate',
  'rupture', 'burst pipe', 'flooding', 'contaminated', 'sewage leak',
  'fire hazard', 'gas leak', 'blocked ambulance', 'school zone', 'hospital'
];

const HIGH_KEYWORDS = [
  'dark street', 'blackout', 'streetlight broken', 'traffic light down', 'signal broken',
  'overflowing garbage', 'stray animals', 'toxic', 'stench', 'drain blocked',
  'pedestrian risk', 'waterlogging', 'two-wheeler', 'accident prone'
];

const MEDIUM_KEYWORDS = [
  'broken bench', 'damaged swing', 'pavement crack', 'faded line', 'graffiti',
  'tree branch', 'low water pressure', 'litter', 'speed breaker unpainted'
];

const DEPARTMENTS = {
  'Roads & Infrastructure': 'Public Works Department (PWD)',
  'Streetlights & Electricity': 'City Electricity Supply Corp',
  'Water Supply & Drainage': 'Municipal Water & Sewerage Board',
  'Garbage & Sanitation': 'Solid Waste Management Dept',
  'Parks & Public Infrastructure': 'Horticulture & Parks Dept',
  'Public Safety': 'Traffic & Disaster Response Cell'
};

export const analyzeReport = (req, res) => {
  try {
    const { title = '', description = '', category = 'Roads & Infrastructure', locality = '' } = req.body;
    const combinedText = `${title} ${description}`.toLowerCase();

    let score = 30; // baseline
    let matchedKeywords = [];

    // Keyword scoring
    CRITICAL_KEYWORDS.forEach(kw => {
      if (combinedText.includes(kw)) {
        score += 35;
        matchedKeywords.push(kw);
      }
    });

    HIGH_KEYWORDS.forEach(kw => {
      if (combinedText.includes(kw)) {
        score += 20;
        matchedKeywords.push(kw);
      }
    });

    MEDIUM_KEYWORDS.forEach(kw => {
      if (combinedText.includes(kw)) {
        score += 10;
        matchedKeywords.push(kw);
      }
    });

    // Category baseline boosts
    if (category === 'Public Safety' || category === 'Water Supply & Drainage') score += 15;
    if (category === 'Roads & Infrastructure' && (combinedText.includes('pothole') || combinedText.includes('crater'))) score += 20;

    // Cap score at 98
    score = Math.min(98, Math.max(15, score));

    // Determine severity tier and SLA
    let severity = 'Medium';
    let priority = 'Medium';
    let slaHours = 72;

    if (score >= 80) {
      severity = 'Critical';
      priority = 'Urgent';
      slaHours = 6;
    } else if (score >= 65) {
      severity = 'High';
      priority = 'High';
      slaHours = 24;
    } else if (score < 40) {
      severity = 'Low';
      priority = 'Low';
      slaHours = 120;
    }

    // Suggested department
    const suggestedDepartment = DEPARTMENTS[category] || 'General Municipal Administration';

    // AI Summary Generation
    let cleanTitle = title.trim();
    if (cleanTitle.length > 50) cleanTitle = cleanTitle.substring(0, 47) + '...';
    
    const localitySnippet = locality ? ` in ${locality}` : '';
    const urgencyPhrase = severity === 'Critical' 
      ? 'Emergency action dispatched: ' 
      : severity === 'High' 
      ? 'High priority civic ticket: ' 
      : 'Civic maintenance request: ';

    const keyFocus = matchedKeywords.length > 0 
      ? `Identified risk factor: [${matchedKeywords.slice(0, 2).join(', ')}]. `
      : '';

    const aiSummary = `${urgencyPhrase}${title}${localitySnippet}. ${keyFocus}Assigned to ${suggestedDepartment} with ${slaHours}h target resolution turnaround.`;

    res.json({
      severity,
      severityScore: score,
      priority,
      slaHours,
      suggestedDepartment,
      aiSummary,
      matchedFactors: matchedKeywords.slice(0, 3),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ error: 'Failed to analyze report' });
  }
};
