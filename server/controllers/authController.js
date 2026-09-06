// In-memory user store with pre-seeded Admin and Citizen
let users = [
  {
    id: "usr_admin_1",
    name: "Vikram Malhotra",
    email: "admin@fixlocal.gov",
    password: "admin123",
    role: "admin",
    department: "Municipal Corporation",
    ward: "Central Zone",
    joinedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "usr_citizen_1",
    name: "Ananya Deshmukh",
    email: "citizen@fixlocal.org",
    password: "citizen123",
    role: "citizen",
    ward: "Ward 151 (Koramangala)",
    joinedAt: "2026-08-15T00:00:00.000Z"
  }
];

export const register = (req, res) => {
  try {
    const { name, email, password, ward = "Ward 101" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password, // in demo environment
      role: 'citizen',
      ward: ward || 'General Ward',

      joinedAt: new Date().toISOString()
    };

    users.push(newUser);

    // Return safe user object (omit password) and auth token
    const token = `fl_token_${newUser.id}_${Date.now()}`;
    const { password: _, ...safeUser } = newUser;

    res.status(201).json({
      user: safeUser,
      token,
      message: "Registration successful!"
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Failed to register user." });
  }
};

export const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = `fl_token_${user.id}_${Date.now()}`;
    const { password: _, ...safeUser } = user;

    res.json({
      user: safeUser,
      token,
      message: "Login successful!"
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to login." });
  }
};

export const getCurrentUser = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No authentication token provided" });
  }

  // Token format: Bearer fl_token_<userId>_<timestamp>
  const token = authHeader.replace("Bearer ", "").trim();
  const parts = token.split("_");
  const userId = parts.slice(2, -1).join("_"); // extract userId

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User session expired or not found" });
  }

  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
};

export const getAllUsers = (req, res) => {
  const safeUsers = users.map(({ password, ...rest }) => rest);
  res.json(safeUsers);
};
