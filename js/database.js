// Mock Database - Users (with password storage)
let users = [
  { 
    id: 1, 
    email: "student@example.com", 
    password: "Student@123", 
    role: "student",
    name: "Student User"
  },
  { 
    id: 2, 
    email: "recruiter@example.com", 
    password: "Recruiter@123", 
    role: "recruiter",
    name: "Recruiter User"
  }
];

// Load users from localStorage or initialize
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(users));
} else {
  users = JSON.parse(localStorage.getItem('users'));
}

// Password reset tokens storage (in localStorage for demo)
// In production, this would be in a database with expiry
let resetTokens = {};

// Load existing tokens
if (localStorage.getItem('resetTokens')) {
  resetTokens = JSON.parse(localStorage.getItem('resetTokens'));
}

// Function to generate a unique token
function generateResetToken(email) {
  const token = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  
  resetTokens[token] = {
    email: email,
    expiresAt: expiresAt,
    createdAt: Date.now()
  };
  
  localStorage.setItem('resetTokens', JSON.stringify(resetTokens));
  return token;
}

// Function to validate token
function validateResetToken(token) {
  const tokenData = resetTokens[token];
  if (!tokenData) return null;
  if (Date.now() > tokenData.expiresAt) return null;
  return tokenData;
}

// Function to reset password
function resetPassword(token, newPassword) {
  const tokenData = validateResetToken(token);
  if (!tokenData) return false;
  
  const userIndex = users.findIndex(u => u.email === tokenData.email);
  if (userIndex !== -1) {
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    delete resetTokens[token];
    localStorage.setItem('resetTokens', JSON.stringify(resetTokens));
    return true;
  }
  return false;
}

// Companies Database
const companiesDb = [
  { company_id: 1, company_name: "TechCorp Africa", headquarters: "Yaoundé", website: "https://techcorp.cm" },
  { company_id: 2, company_name: "FinServe Ltd", headquarters: "Douala", website: "https://finserve.cm" },
  { company_id: 3, company_name: "GlobalSoft", headquarters: "Paris", website: "https://globalsoft.io" }
];

// Job Listings
let jobListings = [
  { job_id: 101, company_id: 1, companyName: "TechCorp Africa", title: "Software Engineer Intern", description: "Build web apps with React & Java, mentorship provided.", location: "Yaoundé", job_type: "Internship", posted_at: "2025-02-10", is_active: true },
  { job_id: 102, company_id: 1, companyName: "TechCorp Africa", title: "Data Analyst Intern", description: "Analyze business data, create dashboards. SQL knowledge a plus.", location: "Douala", job_type: "Internship", posted_at: "2025-02-15", is_active: true },
  { job_id: 103, company_id: 2, companyName: "FinServe Ltd", title: "Junior Financial Analyst", description: "Support financial planning, strong Excel skills required.", location: "Douala", job_type: "Full-Time", posted_at: "2025-02-01", is_active: true }
];

let nextJobId = 200;
let currentUserRole = null;
let currentSearchKeyword = "";
let currentRegionFilter = "all";
let loggedInUser = null;