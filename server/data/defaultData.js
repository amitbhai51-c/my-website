export const initialIssues = [
  {
    id: "ISS-1001",
    title: "Deep Hazardous Pothole near Central Metro Station",
    description: "A wide, roughly 2-foot deep pothole has formed right in the middle of the bus transit lane near Metro Pillar 114. Two-wheelers are swerving abruptly during morning peak traffic, creating severe accident risks.",
    category: "Roads & Infrastructure",
    severity: "Critical",
    severityScore: 92,
    status: "In Progress",
    priority: "Urgent",
    slaHours: 6,
    locality: "Koramangala 4th Block",
    ward: "Ward 151",
    address: "Opposite Gate 2, Metro Station, 80 Feet Road",
    latitude: 12.9352,
    longitude: 77.6245,
    reportedBy: "Rahul Sharma (Student, St. Joseph College)",
    isAnonymous: false,
    upvotes: 48,
    upvotedBy: ["usr-1", "usr-2", "usr-3"],
    reportedAt: "2026-09-04T08:30:00.000Z",
    updatedAt: "2026-09-05T14:15:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    aiSummary: "Hazardous 2ft crater obstructing metropolitan transit corridor; asphalt resurfacing and barricading deployed by PWD.",
    suggestedDepartment: "Public Works Department (PWD)",
    timeline: [
      {
        status: "Reported",
        timestamp: "2026-09-04T08:30:00.000Z",
        author: "Rahul Sharma",
        note: "Issue submitted with live GPS coordinates and photo evidence."
      },
      {
        status: "In Progress",
        timestamp: "2026-09-05T10:00:00.000Z",
        author: "Asst. Engineer Verma (PWD Ward 151)",
        note: "Inspection verified severity. Emergency cold-mix asphalt crew dispatched; warning cones placed."
      }
    ]
  },
  {
    id: "ISS-1002",
    title: "High-Pressure Water Main Rupture Flooding Walkway",
    description: "Underground drinking water main cracked open early this morning. Potable water is shooting 3 feet high and flooding both lanes of the pedestrian pathway outside the public library.",
    category: "Water Supply & Drainage",
    severity: "Critical",
    severityScore: 95,
    status: "In Progress",
    priority: "Urgent",
    slaHours: 6,
    locality: "Indiranagar 100ft Road",
    ward: "Ward 112",
    address: "Next to City Central Library, 12th Main Corner",
    latitude: 12.9719,
    longitude: 77.6412,
    reportedBy: "Anonymous Citizen",
    isAnonymous: true,
    upvotes: 67,
    upvotedBy: ["usr-4", "usr-5"],
    reportedAt: "2026-09-05T06:15:00.000Z",
    updatedAt: "2026-09-05T09:45:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
    aiSummary: "Major potable water pipeline rupture causing urban pedestrian flooding; valve isolation and emergency clamp required.",
    suggestedDepartment: "Municipal Water & Sewerage Board",
    timeline: [
      {
        status: "Reported",
        timestamp: "2026-09-05T06:15:00.000Z",
        author: "Anonymous Citizen",
        note: "Reported anonymously with high urgency tag."
      },
      {
        status: "In Progress",
        timestamp: "2026-09-05T07:45:00.000Z",
        author: "Duty Engineer Nair (Water Board)",
        note: "Upstream isolation valve shut down to prevent wastage. Replacement pipeline sleeve underway."
      }
    ]
  },
  {
    id: "ISS-1003",
    title: "Cluster of 5 Non-Functional Streetlights on Girls Hostel Lane",
    description: "Five consecutive sodium streetlights along the 300m stretch connecting College Gate to the women's hostel have been completely dark for 4 days. Poor visibility raises serious nighttime safety concerns for returning students.",
    category: "Streetlights & Electricity",
    severity: "High",
    severityScore: 84,
    status: "Reported",
    priority: "High",
    slaHours: 24,
    locality: "Jayanagar 4th Block",
    ward: "Ward 168",
    address: "Lane 7, Near University Women's Hall of Residence",
    latitude: 12.9299,
    longitude: 77.5824,
    reportedBy: "Pooja Hegde (Student Union Rep)",
    isAnonymous: false,
    upvotes: 93,
    upvotedBy: ["usr-6", "usr-7", "usr-8"],
    reportedAt: "2026-09-03T19:40:00.000Z",
    updatedAt: "2026-09-03T19:40:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    aiSummary: "Safety hazard: Multiple blackout poles along student corridor. High priority transformer/circuit check recommended.",
    suggestedDepartment: "City Electricity Supply Corp",
    timeline: [
      {
        status: "Reported",
        timestamp: "2026-09-03T19:40:00.000Z",
        author: "Pooja Hegde",
        note: "Endorsed by 90+ hostel residents requesting immediate re-lamping."
      }
    ]
  },
  {
    id: "ISS-1004",
    title: "Illegal Garbage Dumping & Overflowing Municipal Bin",
    description: "Commercial food waste and plastic debris dumped across the vacant plot near the government primary school. Stray dogs and foul stench are impacting children attending morning classes.",
    category: "Garbage & Sanitation",
    severity: "High",
    severityScore: 78,
    status: "Resolved",
    priority: "High",
    slaHours: 24,
    locality: "HSR Layout Sector 2",
    ward: "Ward 174",
    address: "Plot 89, 14th Main Road, Near Govt Primary School",
    latitude: 12.9116,
    longitude: 77.6389,
    reportedBy: "Venkatesh Rao (Resident)",
    isAnonymous: false,
    upvotes: 35,
    upvotedBy: ["usr-9"],
    reportedAt: "2026-09-01T11:20:00.000Z",
    updatedAt: "2026-09-02T16:00:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80",
    aiSummary: "Sanitation hazard near elementary school; municipal waste truck cleared 2 tons of debris and installed CCTV warning board.",
    suggestedDepartment: "Solid Waste Management Dept",
    timeline: [
      {
        status: "Reported",
        timestamp: "2026-09-01T11:20:00.000Z",
        author: "Venkatesh Rao",
        note: "Report logged with photos of school boundary."
      },
      {
        status: "In Progress",
        timestamp: "2026-09-02T08:00:00.000Z",
        author: "Health Inspector Khan",
        note: "Compactor truck and sanitization crew assigned."
      },
      {
        status: "Resolved",
        timestamp: "2026-09-02T16:00:00.000Z",
        author: "Health Inspector Khan",
        note: "Debris completely cleared. Disinfectant spray applied and 'No Dumping - Fine ₹5000' sign installed."
      }
    ]
  },
  {
    id: "ISS-1005",
    title: "Broken Children's Swing Chain & Exposed Rust in Community Park",
    description: "The main swing set chain snapped on one side, leaving sharp rusted metal links dangling at eye level for toddlers. Ground safety matting is also dislodged.",
    category: "Parks & Public Infrastructure",
    severity: "Medium",
    severityScore: 58,
    status: "Reported",
    priority: "Medium",
    slaHours: 72,
    locality: "Malleshwaram 15th Cross",
    ward: "Ward 65",
    address: "Gandhi Children's Park, Play Zone Area",
    latitude: 12.9984,
    longitude: 77.5714,
    reportedBy: "Deepa Narayan (Parent)",
    isAnonymous: false,
    upvotes: 22,
    upvotedBy: [],
    reportedAt: "2026-09-04T15:10:00.000Z",
    updatedAt: "2026-09-04T15:10:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&w=800&q=80",
    aiSummary: "Park playground equipment structural defect; temporary safety tie-off and stainless link replacement required.",
    suggestedDepartment: "Horticulture & Parks Dept",
    timeline: [
      {
        status: "Reported",
        timestamp: "2026-09-04T15:10:00.000Z",
        author: "Deepa Narayan",
        note: "Reported after toddler playground incident."
      }
    ]
  },
  {
    id: "ISS-1006",
    title: "Open Stormwater Drain Grating Missing after Road Widening",
    description: "Cast iron storm drain grate is completely missing leaving an unguarded 5-foot drop on the pedestrian footpath. Leaves and branches have been placed by locals as an improvised warning.",
    category: "Public Safety",
    severity: "Critical",
    severityScore: 94,
    status: "In Progress",
    priority: "Urgent",
    slaHours: 6,
    locality: "Whitefield Inner Circle",
    ward: "Ward 84",
    address: "Opposite ITPL Main Entrance, footpath curb",
    latitude: 12.9866,
    longitude: 77.7281,
    reportedBy: "Karthik Sundaram (Tech Worker)",
    isAnonymous: false,
    upvotes: 81,
    upvotedBy: ["usr-10", "usr-11"],
    reportedAt: "2026-09-05T07:20:00.000Z",
    updatedAt: "2026-09-05T11:00:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80",
    aiSummary: "High-risk pedestrian fall hazard: Open stormwater chasm without cover. Reinforced concrete grating installation required.",
    suggestedDepartment: "Public Works Department (PWD)",
    timeline: [
      {
        status: "Reported",
        timestamp: "2026-09-05T07:20:00.000Z",
        author: "Karthik Sundaram",
        note: "Submitted with photo showing deep drain drop."
      },
      {
        status: "In Progress",
        timestamp: "2026-09-05T11:00:00.000Z",
        author: "Zonal Officer D'Souza",
        note: "Temporary reflective barrier installed. Heavy-duty cast iron slab scheduled for installation this evening."
      }
    ]
  },
  {
    id: "ISS-1007",
    title: "Faded Zebra Crossing & Damaged Pedestrian Signal near School",
    description: "Pedestrian road markings have almost completely eroded, and the push-button crossing light stays red permanently, leaving elementary school students stranded during rush hours.",
    category: "Roads & Infrastructure",
    severity: "Medium",
    severityScore: 52,
    status: "Resolved",
    priority: "Medium",
    slaHours: 72,
    locality: "Sadashivanagar",
    ward: "Ward 35",
    address: "Junction of 8th Main and Sankey Tank Road",
    latitude: 13.0067,
    longitude: 77.5813,
    reportedBy: "Anonymous Student",
    isAnonymous: true,
    upvotes: 29,
    upvotedBy: [],
    reportedAt: "2026-08-28T09:00:00.000Z",
    updatedAt: "2026-08-30T17:30:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1520690214124-2405c5217036?auto=format&fit=crop&w=800&q=80",
    aiSummary: "School crossing infrastructure deficiency; thermo-plastic paint repainting completed and button sensor recalibrated.",
    suggestedDepartment: "Traffic Engineering Cell",
    timeline: [
      {
        status: "Reported",
        timestamp: "2026-08-28T09:00:00.000Z",
        author: "Anonymous Student",
        note: "Report submitted."
      },
      {
        status: "In Progress",
        timestamp: "2026-08-29T14:00:00.000Z",
        author: "Traffic Dept Officer",
        note: "Signal crew scheduled repainting for overnight shift."
      },
      {
        status: "Resolved",
        timestamp: "2026-08-30T17:30:00.000Z",
        author: "Traffic Dept Officer",
        note: "Thermoplastic reflective zebra crossing painted and pedestrian signal push sensor restored."
      }
    ]
  }
];
