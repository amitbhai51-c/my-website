import { store } from '../data/store.js';

export const getAnalytics = (req, res) => {
  try {
    const issues = store.getAll();

    const totalIssues = issues.length;
    const reportedCount = issues.filter(i => i.status === 'Reported').length;
    const inProgressCount = issues.filter(i => i.status === 'In Progress').length;
    const resolvedCount = issues.filter(i => i.status === 'Resolved').length;

    const resolutionRate = totalIssues > 0 
      ? Math.round((resolvedCount / totalIssues) * 100) 
      : 0;

    // By Category
    const categoryMap = {};
    issues.forEach(i => {
      categoryMap[i.category] = (categoryMap[i.category] || 0) + 1;
    });

    const categories = Object.keys(categoryMap).map(name => ({
      name,
      count: categoryMap[name],
      percentage: Math.round((categoryMap[name] / totalIssues) * 100)
    }));

    // By Severity
    const severityMap = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    issues.forEach(i => {
      if (severityMap[i.severity] !== undefined) {
        severityMap[i.severity]++;
      } else {
        severityMap['Medium']++;
      }
    });

    // Hotspot Wards & Localities
    const wardMap = {};
    issues.forEach(i => {
      const key = `${i.ward} - ${i.locality}`;
      if (!wardMap[key]) {
        wardMap[key] = { ward: i.ward, locality: i.locality, total: 0, pending: 0, resolved: 0 };
      }
      wardMap[key].total++;
      if (i.status === 'Resolved') {
        wardMap[key].resolved++;
      } else {
        wardMap[key].pending++;
      }
    });

    const hotspots = Object.values(wardMap)
      .sort((a, b) => b.pending - a.pending)
      .slice(0, 5);

    // Total upvotes
    const totalUpvotes = issues.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);

    // Average resolution time calculation (in hours)
    let totalResolutionHours = 0;
    let resolvedWithTimelineCount = 0;

    issues.filter(i => i.status === 'Resolved').forEach(item => {
      const reportedEvent = item.timeline.find(t => t.status === 'Reported');
      const resolvedEvent = item.timeline.find(t => t.status === 'Resolved');
      if (reportedEvent && resolvedEvent) {
        const diffMs = new Date(resolvedEvent.timestamp) - new Date(reportedEvent.timestamp);
        const diffHours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
        totalResolutionHours += diffHours;
        resolvedWithTimelineCount++;
      }
    });

    const avgResolutionHours = resolvedWithTimelineCount > 0
      ? Math.round(totalResolutionHours / resolvedWithTimelineCount)
      : 28;

    res.json({
      summary: {
        totalIssues,
        reportedCount,
        inProgressCount,
        resolvedCount,
        resolutionRate,
        totalUpvotes,
        avgResolutionHours,
        criticalPending: issues.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length
      },
      categories,
      severities: severityMap,
      hotspots,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Analytics Error:', err);
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
};
