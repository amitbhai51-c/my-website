import { store } from '../data/store.js';

export const getIssues = (req, res) => {
  try {
    let { status, category, severity, search, sort = 'trending' } = req.query;
    let list = [...store.getAll()];

    if (status && status !== 'all') {
      list = list.filter(item => item.status.toLowerCase() === status.toLowerCase());
    }

    if (category && category !== 'all') {
      list = list.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (severity && severity !== 'all') {
      list = list.filter(item => item.severity.toLowerCase() === severity.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.locality.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }

    if (sort === 'trending' || sort === 'upvotes') {
      list.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sort === 'recent') {
      list.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
    } else if (sort === 'severity') {
      list.sort((a, b) => (b.severityScore || 50) - (a.severityScore || 50));
    }

    res.json(list);
  } catch (err) {
    console.error('Error fetching issues:', err);
    res.status(500).json({ error: 'Failed to retrieve issues' });
  }
};

export const getIssueById = (req, res) => {
  const issue = store.getById(req.params.id);
  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }
  res.json(issue);
};

export const createIssue = (req, res) => {
  try {
    const {
      title,
      description,
      category,
      locality,
      ward = 'Ward 101',
      address,
      latitude = 12.9716,
      longitude = 77.5946,
      reportedBy = 'Concerned Citizen',
      userId,
      isAnonymous = false,
      imageUrl,
      severity,
      severityScore,
      priority,
      slaHours,
      suggestedDepartment,
      aiSummary
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required.' });
    }

    const currentIssues = store.getAll();
    const newId = `ISS-${1000 + currentIssues.length + 1}`;
    const now = new Date().toISOString();

    const newIssue = {
      id: newId,
      title,
      description,
      category,
      severity: severity || 'Medium',
      severityScore: severityScore || 60,
      status: 'Reported',
      priority: priority || 'Medium',
      slaHours: slaHours || 48,
      locality: locality || 'City Center',
      ward: ward || 'Ward 101',
      address: address || 'Reported Location',
      latitude: Number(latitude),
      longitude: Number(longitude),
      reportedBy: isAnonymous ? 'Anonymous Citizen' : (reportedBy || 'Citizen'),
      userId: isAnonymous ? null : userId,
      isAnonymous: Boolean(isAnonymous),
      upvotes: 1,
      upvotedBy: ['creator'],
      reportedAt: now,
      updatedAt: now,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      aiSummary: aiSummary || `Reported ${category.toLowerCase()} in ${locality}. Dispatch logged.`,
      suggestedDepartment: suggestedDepartment || 'Municipal Operations',
      timeline: [
        {
          status: 'Reported',
          timestamp: now,
          author: isAnonymous ? 'Anonymous Citizen' : (reportedBy || 'Citizen'),
          note: 'Civic issue registered with photographic evidence and geolocation pin.'
        }
      ]
    };

    store.add(newIssue);
    res.status(201).json(newIssue);
  } catch (err) {
    console.error('Error creating issue:', err);
    res.status(500).json({ error: 'Failed to create issue' });
  }
};

export const upvoteIssue = (req, res) => {
  const { id } = req.params;
  const { userId = 'guest-user' } = req.body;
  const issue = store.getById(id);

  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  if (!issue.upvotedBy) issue.upvotedBy = [];

  const alreadyUpvoted = issue.upvotedBy.includes(userId);
  if (alreadyUpvoted) {
    issue.upvotedBy = issue.upvotedBy.filter(uid => uid !== userId);
    issue.upvotes = Math.max(0, issue.upvotes - 1);
  } else {
    issue.upvotedBy.push(userId);
    issue.upvotes += 1;
  }

  issue.updatedAt = new Date().toISOString();

  res.json({
    id: issue.id,
    upvotes: issue.upvotes,
    hasUpvoted: !alreadyUpvoted
  });
};

export const updateStatus = (req, res) => {
  const { id } = req.params;
  const { status, note, authorityName = 'Municipal Officer', department, priority } = req.body;
  const validStatuses = ['Reported', 'In Progress', 'Resolved'];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const issue = store.getById(id);
  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  const now = new Date().toISOString();
  if (status) issue.status = status;
  issue.updatedAt = now;
  if (department) issue.suggestedDepartment = department;
  if (priority) issue.priority = priority;

  issue.timeline.push({
    status: issue.status,
    timestamp: now,
    author: authorityName,
    note: note || `Administrative action logged by ${authorityName}.`
  });

  res.json(issue);
};

export const deleteIssue = (req, res) => {
  const { id } = req.params;
  const deleted = store.delete(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Issue not found' });
  }
  res.json({ message: `Issue ${id} dismissed and deleted successfully.`, id });
};

export const resetData = (req, res) => {
  const resetList = store.reset();
  res.json({ message: 'Sample dataset reset to initial state successfully', count: resetList.length });
};
