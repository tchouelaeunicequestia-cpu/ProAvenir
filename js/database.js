// Initialize users in localStorage if not exists
if (!localStorage.getItem('users')) {
  const defaultUsers = [
    { 
      id: 1, 
      email: "student@example.com", 
      password: "Student@123", 
      role: "student",
      name: "John Doe",
      createdAt: new Date().toISOString(),
      isBanned: false,
      banReason: null,
      bannedAt: null,
      bannedBy: null
    },
    { 
      id: 2, 
      email: "recruiter@example.com", 
      password: "Recruiter@123", 
      role: "recruiter",
      name: "Jane Smith",
      createdAt: new Date().toISOString(),
      isBanned: false,
      banReason: null,
      bannedAt: null,
      bannedBy: null
    },
    { 
      id: 3, 
      email: "admin@example.com", 
      password: "Admin@123", 
      role: "admin",
      name: "Admin User",
      createdAt: new Date().toISOString(),
      isBanned: false,
      banReason: null,
      bannedAt: null,
      bannedBy: null
    }
  ];
  localStorage.setItem('users', JSON.stringify(defaultUsers));
}

// Initialize ban history
if (!localStorage.getItem('banHistory')) {
  localStorage.setItem('banHistory', JSON.stringify([]));
}

// Initialize reset tokens storage
if (!localStorage.getItem('resetTokens')) {
  localStorage.setItem('resetTokens', JSON.stringify({}));
}

// Get users from localStorage
let users = JSON.parse(localStorage.getItem('users'));

// Companies Database
const companiesDb = [
  { company_id: 1, company_name: "TechCorp Africa", headquarters: "Yaoundé", website: "https://techcorp.cm" },
  { company_id: 2, company_name: "FinServe Ltd", headquarters: "Douala", website: "https://finserve.cm" },
  { company_id: 3, company_name: "GlobalSoft", headquarters: "Paris", website: "https://globalsoft.io" },
  { company_id: 4, company_name: "Cameroon Digital Hub", headquarters: "Yaoundé", website: "https://cdh.cm" },
  { company_id: 5, company_name: "Entrepreneurs Without Borders", headquarters: "Douala", website: "#" }
];

// Job Listings
let jobListings = [
  { job_id: 101, company_id: 1, companyName: "TechCorp Africa", title: "Software Engineer Intern", description: "Build web apps with React & Java, mentorship provided. Great opportunity for fresh graduates!", location: "Yaoundé", job_type: "Internship", posted_at: "2025-02-10", is_active: true },
  { job_id: 102, company_id: 1, companyName: "TechCorp Africa", title: "Data Analyst Intern", description: "Analyze business data, create dashboards. SQL knowledge a plus. Training provided.", location: "Douala", job_type: "Internship", posted_at: "2025-02-15", is_active: true },
  { job_id: 103, company_id: 2, companyName: "FinServe Ltd", title: "Junior Financial Analyst", description: "Support financial planning, strong Excel skills required. Great career growth.", location: "Douala", job_type: "Full-Time", posted_at: "2025-02-01", is_active: true },
  { job_id: 104, company_id: 3, companyName: "GlobalSoft", title: "UX Designer (Contract)", description: "Design user interfaces for global products. Remote work available.", location: "Remote", job_type: "Contract", posted_at: "2025-02-05", is_active: true },
  { job_id: 105, company_id: 4, companyName: "Cameroon Digital Hub", title: "Frontend Developer Intern", description: "Work on real projects: HTML/CSS/JS, great learning environment with mentors.", location: "Yaoundé", job_type: "Internship", posted_at: "2025-02-18", is_active: true },
  { job_id: 106, company_id: 5, companyName: "Entrepreneurs Without Borders", title: "Marketing & Communication Intern", description: "Assist social media & community events. Great for communication graduates.", location: "Douala", job_type: "Internship", posted_at: "2025-02-12", is_active: true },
  { job_id: 107, company_id: 2, companyName: "FinServe Ltd", title: "Risk Management Trainee", description: "Learn risk assessment and compliance. Full training provided.", location: "Central Africa", job_type: "Internship", posted_at: "2025-02-14", is_active: true },
  { job_id: 108, company_id: 3, companyName: "GlobalSoft", title: "Cloud Support Engineer", description: "AWS & Azure support, remote-friendly position. Experience with cloud platforms preferred.", location: "Remote", job_type: "Full-Time", posted_at: "2025-02-09", is_active: true }
];

let nextJobId = 200;
let currentUserRole = null;
let currentSearchKeyword = "";
let currentRegionFilter = "all";
let loggedInUser = null;

// Helper functions for password reset
function generateResetToken(email) {
  const token = Math.random().toString(36).substring(2, 15) + 
                Date.now().toString(36) +
                Math.random().toString(36).substring(2, 8);
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  
  let resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
  resetTokens[token] = {
    email: email,
    expiresAt: expiresAt,
    createdAt: Date.now()
  };
  
  localStorage.setItem('resetTokens', JSON.stringify(resetTokens));
  return token;
}

function sendResetEmail(email, token) {
  const resetLink = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, '')}pages/reset-password.html?token=${token}`;
  
  console.log('=== PASSWORD RESET EMAIL (SIMULATED) ===');
  console.log(`To: ${email}`);
  console.log(`Subject: Reset Your ProAvenir Password`);
  console.log(`Body: Click the following link to reset your password (valid for 24 hours):\n${resetLink}`);
  console.log('=======================================');
  
  setTimeout(() => {
    const userConfirmed = confirm(`A password reset link has been generated for ${email}.\n\nClick OK to open the reset page.\n\nNote: In production, this would be sent to your email inbox.`);
    if (userConfirmed) {
      window.open(resetLink, '_blank');
    }
  }, 500);
  
  return resetLink;
}

// Ban user function
function banUser(userId, reason, adminId) {
  const users = JSON.parse(localStorage.getItem('users'));
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return { success: false, message: "User not found" };
  if (users[userIndex].role === 'admin') return { success: false, message: "Cannot ban an admin user" };
  
  const admin = users.find(u => u.id === adminId);
  
  users[userIndex].isBanned = true;
  users[userIndex].banReason = reason;
  users[userIndex].bannedAt = new Date().toISOString();
  users[userIndex].bannedBy = admin ? admin.email : 'Unknown';
  
  localStorage.setItem('users', JSON.stringify(users));
  
  // Store ban history for auditing
  const banHistory = JSON.parse(localStorage.getItem('banHistory') || '[]');
  banHistory.push({
    userId: userId,
    userEmail: users[userIndex].email,
    userName: users[userIndex].name,
    reason: reason,
    bannedBy: admin ? admin.email : 'Unknown',
    bannedAt: new Date().toISOString(),
    action: 'ban'
  });
  localStorage.setItem('banHistory', JSON.stringify(banHistory));
  
  return { success: true, message: "User banned successfully" };
}

// Unban user function
function unbanUser(userId) {
  const users = JSON.parse(localStorage.getItem('users'));
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return { success: false, message: "User not found" };
  
  users[userIndex].isBanned = false;
  users[userIndex].banReason = null;
  users[userIndex].bannedAt = null;
  users[userIndex].bannedBy = null;
  
  localStorage.setItem('users', JSON.stringify(users));
  
  // Store unban history
  const banHistory = JSON.parse(localStorage.getItem('banHistory') || '[]');
  banHistory.push({
    userId: userId,
    userEmail: users[userIndex].email,
    userName: users[userIndex].name,
    unbannedAt: new Date().toISOString(),
    action: 'unban'
  });
  localStorage.setItem('banHistory', JSON.stringify(banHistory));
  
  return { success: true, message: "User unbanned successfully" };
}

// Check if user is banned
function isUserBanned(email) {
  const users = JSON.parse(localStorage.getItem('users'));
  const user = users.find(u => u.email === email);
  return user ? user.isBanned || false : false;
}

// Get ban reason
function getBanReason(email) {
  const users = JSON.parse(localStorage.getItem('users'));
  const user = users.find(u => u.email === email);
  return user ? user.banReason : null;
}