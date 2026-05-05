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
} else {
  // Fix existing admin password if needed
  let users = JSON.parse(localStorage.getItem('users'));
  const adminIndex = users.findIndex(u => u.email === "admin@example.com");
  if (adminIndex !== -1 && users[adminIndex].password !== "Admin@123") {
    users[adminIndex].password = "Admin@123";
    localStorage.setItem('users', JSON.stringify(users));
    console.log("Admin password fixed to: Admin@123");
  }
}

// Initialize Companies in localStorage
if (!localStorage.getItem('companies')) {
  const defaultCompanies = [
    {
      id: 1,
      companyName: "TechCorp Africa",
      email: "contact@techcorp.cm",
      website: "https://techcorp.cm",
      taxId: "TC-2024-001",
      registrationNumber: "RC/BTA/2024/1234",
      address: "123 Main Street, Yaoundé, Cameroon",
      phone: "+237 612345678",
      status: "approved",
      submittedBy: 2,
      submittedAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      approvedBy: 3,
      rejectionReason: null,
      description: "Leading technology company providing software solutions across Africa."
    },
    {
      id: 2,
      companyName: "FinServe Ltd",
      email: "info@finserve.cm",
      website: "https://finserve.cm",
      taxId: "FS-2024-002",
      registrationNumber: "RC/BTA/2024/5678",
      address: "45 Finance Street, Douala, Cameroon",
      phone: "+237 698765432",
      status: "approved",
      submittedBy: 2,
      submittedAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      approvedBy: 3,
      rejectionReason: null,
      description: "Financial services and banking solutions provider."
    },
    {
      id: 3,
      companyName: "GlobalSoft International",
      email: "hello@globalsoft.io",
      website: "https://globalsoft.io",
      taxId: "GS-2024-003",
      registrationNumber: "RC/BTA/2024/9012",
      address: "789 Tech Park, Paris, France",
      phone: "+33123456789",
      status: "pending",
      submittedBy: 2,
      submittedAt: new Date().toISOString(),
      approvedAt: null,
      approvedBy: null,
      rejectionReason: null,
      description: "International software development company with global reach."
    },
    {
      id: 4,
      companyName: "Cameroon Digital Hub",
      email: "info@cdh.cm",
      website: "https://cdh.cm",
      taxId: "CDH-2024-004",
      registrationNumber: "RC/BTA/2024/3456",
      address: "Digital City, Yaoundé, Cameroon",
      phone: "+237 655443322",
      status: "pending",
      submittedBy: 2,
      submittedAt: new Date().toISOString(),
      approvedAt: null,
      approvedBy: null,
      rejectionReason: null,
      description: "Digital innovation hub supporting local tech startups."
    },
    {
      id: 5,
      companyName: "Green Energy Solutions",
      email: "contact@greenenergy.cm",
      website: "https://greenenergy.cm",
      taxId: "GE-2024-005",
      registrationNumber: "RC/BTA/2024/7890",
      address: "Energy Boulevard, Douala, Cameroon",
      phone: "+237 677889900",
      status: "pending",
      submittedBy: 2,
      submittedAt: new Date().toISOString(),
      approvedAt: null,
      approvedBy: null,
      rejectionReason: null,
      description: "Renewable energy solutions for businesses and homes."
    }
  ];
  localStorage.setItem('companies', JSON.stringify(defaultCompanies));
}

// Initialize ban history
if (!localStorage.getItem('banHistory')) {
  localStorage.setItem('banHistory', JSON.stringify([]));
}

// Initialize reset tokens storage
if (!localStorage.getItem('resetTokens')) {
  localStorage.setItem('resetTokens', JSON.stringify({}));
}

// Initialize student resumes storage
if (!localStorage.getItem('studentResumes')) {
  localStorage.setItem('studentResumes', JSON.stringify({}));
}

// Get users from localStorage
let users = JSON.parse(localStorage.getItem('users'));

// Companies Database (for job listings compatibility)
let companiesDb = JSON.parse(localStorage.getItem('companies')).map(c => ({
  company_id: c.id,
  company_name: c.companyName,
  headquarters: c.address ? c.address.split(',')[0] : 'Yaoundé',
  website: c.website,
  status: c.status
}));

// Job Listings
let jobListings = [
  { job_id: 101, company_id: 1, companyName: "TechCorp Africa", title: "Software Engineer Intern", description: "Build web apps with React & Java, mentorship provided. Great opportunity for fresh graduates!", location: "Yaoundé", job_type: "Internship", posted_at: "2025-02-10", is_active: true },
  { job_id: 102, company_id: 2, companyName: "FinServe Ltd", title: "Junior Financial Analyst", description: "Support financial planning, strong Excel skills required. Great career growth.", location: "Douala", job_type: "Full-Time", posted_at: "2025-02-01", is_active: true },
  { job_id: 103, company_id: 3, companyName: "GlobalSoft International", title: "UX Designer (Contract)", description: "Design user interfaces for global products. Remote work available.", location: "Remote", job_type: "Contract", posted_at: "2025-02-05", is_active: true },
  { job_id: 104, company_id: 4, companyName: "Cameroon Digital Hub", title: "Frontend Developer Intern", description: "Work on real projects: HTML/CSS/JS, great learning environment with mentors.", location: "Yaoundé", job_type: "Internship", posted_at: "2025-02-18", is_active: true },
  { job_id: 105, company_id: 5, companyName: "Green Energy Solutions", title: "Marketing Intern", description: "Help promote renewable energy solutions. Great for marketing students.", location: "Douala", job_type: "Internship", posted_at: "2025-02-12", is_active: true }
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
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000);
  
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