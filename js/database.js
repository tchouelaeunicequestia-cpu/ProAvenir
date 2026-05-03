// Mock Database - Companies
const companiesDb = [
  { company_id: 1, company_name: "TechCorp Africa", headquarters: "Yaoundé", website: "https://techcorp.cm" },
  { company_id: 2, company_name: "FinServe Ltd", headquarters: "Douala", website: "https://finserve.cm" },
  { company_id: 3, company_name: "GlobalSoft", headquarters: "Paris", website: "https://globalsoft.io" },
  { company_id: 4, company_name: "Cameroon Digital Hub", headquarters: "Yaoundé", website: "https://cdh.cm" },
  { company_id: 5, company_name: "Entrepreneurs Without Borders", headquarters: "Douala", website: "#" },
  { company_id: 6, company_name: "Java Solutions Inc", headquarters: "Yaoundé", website: "#" },
  { company_id: 7, company_name: "Marketing Pro", headquarters: "Douala", website: "#" }
];

// Mock Database - Job Listings (expanded for better search results)
let jobListings = [
  { job_id: 101, company_id: 1, companyName: "TechCorp Africa", title: "Software Engineer Intern", description: "Build web apps with React & Java, mentorship provided. Looking for passionate developers.", location: "Yaoundé", job_type: "Internship", posted_at: "2025-02-10", is_active: true },
  { job_id: 102, company_id: 1, companyName: "TechCorp Africa", title: "Data Analyst Intern", description: "Analyze business data, create dashboards. SQL knowledge a plus. Python skills beneficial.", location: "Douala", job_type: "Internship", posted_at: "2025-02-15", is_active: true },
  { job_id: 103, company_id: 2, companyName: "FinServe Ltd", title: "Junior Financial Analyst", description: "Support financial planning, strong Excel skills required. Great career growth in banking.", location: "Douala", job_type: "Full-Time", posted_at: "2025-02-01", is_active: true },
  { job_id: 104, company_id: 3, companyName: "GlobalSoft", title: "UX Designer (Contract)", description: "Design user interfaces for global products. Figma and Adobe XD experience needed.", location: "Remote", job_type: "Contract", posted_at: "2025-02-05", is_active: true },
  { job_id: 105, company_id: 4, companyName: "Cameroon Digital Hub", title: "Frontend Developer Intern", description: "Work on real projects: HTML/CSS/JS, great learning environment with mentors. React experience a plus.", location: "Yaoundé", job_type: "Internship", posted_at: "2025-02-18", is_active: true },
  { job_id: 106, company_id: 5, companyName: "Entrepreneurs Without Borders", title: "Marketing & Communication Intern", description: "Assist social media & community events. Great for communication graduates. Content creation skills.", location: "Douala", job_type: "Internship", posted_at: "2025-02-12", is_active: true },
  { job_id: 107, company_id: 2, companyName: "FinServe Ltd", title: "Risk Management Trainee", description: "Learn risk assessment and compliance. Full training provided. Finance background preferred.", location: "Central Africa", job_type: "Internship", posted_at: "2025-02-14", is_active: true },
  { job_id: 108, company_id: 3, companyName: "GlobalSoft", title: "Cloud Support Engineer", description: "AWS & Azure support, remote-friendly position. Experience with cloud platforms preferred. Linux knowledge.", location: "Remote", job_type: "Full-Time", posted_at: "2025-02-09", is_active: true },
  { job_id: 109, company_id: 6, companyName: "Java Solutions Inc", title: "Java Backend Developer", description: "Spring Boot, microservices, database design. Strong Java skills required.", location: "Yaoundé", job_type: "Full-Time", posted_at: "2025-02-20", is_active: true },
  { job_id: 110, company_id: 7, companyName: "Marketing Pro", title: "Digital Marketing Specialist", description: "SEO, social media, content strategy. Creative and analytical skills needed.", location: "Douala", job_type: "Full-Time", posted_at: "2025-02-19", is_active: true }
];

let nextJobId = 200;
let currentUserRole = null;
let currentSearchKeyword = "";
let currentRegionFilter = "all";