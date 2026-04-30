// UI Rendering Functions
function renderStudentFeed(regionFilter) {
  const container = document.getElementById("jobCardsContainer");
  if (!container) return;
  
  let filteredJobs = jobListings.filter(function(job) { return job.is_active === true; });
  
  if (regionFilter !== "all") {
    filteredJobs = filteredJobs.filter(function(job) {
      return job.location.toLowerCase().includes(regionFilter.toLowerCase());
    });
  }
  
  if (filteredJobs.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>No opportunities found in ' + (regionFilter === "all" ? "your region" : regionFilter) + '.</p></div>';
    return;
  }
  
  container.innerHTML = filteredJobs.map(function(job) {
    return '<div class="job-card">' +
      '<div class="job-title">' + escapeHtml(job.title) + '</div>' +
      '<div class="company-name"><i class="fas fa-building"></i> ' + escapeHtml(job.companyName) + '</div>' +
      '<div class="job-location"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(job.location) + '</div>' +
      '<div class="job-desc">' + (job.description.length > 120 ? escapeHtml(job.description.substring(0, 120)) + "..." : escapeHtml(job.description)) + '</div>' +
      '<div><span class="badge">' + job.job_type + '</span></div>' +
      '<div class="apply-status"><i class="fas fa-check-circle" style="color:#2ecc71;"></i> Status: Open • Apply Now</div>' +
      '<hr /><div style="font-size:0.75rem; color:#3b7a95;"><i class="far fa-calendar-alt"></i> Posted: ' + new Date(job.posted_at).toLocaleDateString() + '</div>' +
      '</div>';
  }).join("");
}

function postNewJob(event) {
  event.preventDefault();
  clearFormErrors();
  
  var titleInput = document.getElementById("jobTitle");
  var companyInput = document.getElementById("companyName");
  var locationInput = document.getElementById("jobLocation");
  var descInput = document.getElementById("jobDesc");
  var jobTypeInput = document.getElementById("jobType");
  
  var isValid = true;
  var title = titleInput.value.trim();
  var company = companyInput.value.trim();
  var locationVal = locationInput.value.trim();
  var desc = descInput.value.trim();
  var jobType = jobTypeInput.value.trim() || "Internship";
  
  if (!title) { showFieldError("titleError", "❌ Job title is required"); isValid = false; }
  if (!company) { showFieldError("companyError", "❌ Company name is required"); isValid = false; }
  if (!locationVal) { showFieldError("locationError", "❌ Location is required"); isValid = false; }
  if (!desc) { showFieldError("descError", "❌ Description/requirements are required"); isValid = false; }
  
  if (!isValid) {
    showToast("Please fill in all required fields (*)", "#e74c3c");
    return;
  }
  
  var existingCompany = null;
  for (var i = 0; i < companiesDb.length; i++) {
    if (companiesDb[i].company_name.toLowerCase() === company.toLowerCase()) {
      existingCompany = companiesDb[i];
      break;
    }
  }
  
  var companyId;
  if (existingCompany) {
    companyId = existingCompany.company_id;
  } else {
    var newId = companiesDb.length + 10;
    companiesDb.push({ company_id: newId, company_name: company, headquarters: locationVal, website: "" });
    companyId = newId;
  }
  
  var newJob = {
    job_id: nextJobId++,
    company_id: companyId,
    companyName: company,
    title: title,
    description: desc,
    location: locationVal,
    job_type: jobType,
    posted_at: new Date().toISOString().split('T')[0],
    is_active: true
  };
  
  jobListings.unshift(newJob);
  
  titleInput.value = "";
  companyInput.value = "";
  locationInput.value = "";
  descInput.value = "";
  jobTypeInput.value = "";
  
  var msgDiv = document.getElementById("postMessage");
  if (msgDiv) msgDiv.innerHTML = '<span style="color:#27ae60;"><i class="fas fa-check-circle"></i> ✅ Job posted successfully! It now appears in the student feed.</span>';
  showToast("🎉 Job listing published! Students can now see it.", "#27ae60");
  
  var regionSelect = document.getElementById("regionFilterSelect");
  if (regionSelect && currentUserRole === "student") {
    renderStudentFeed(regionSelect.value);
  }
}

function setRole(role) {
  var studentPanel = document.getElementById("studentPanel");
  var recruiterPanel = document.getElementById("recruiterPanel");
  var roleLabelSpan = document.getElementById("userRoleLabel");
  
  if (role === "student") {
    studentPanel.style.display = "block";
    recruiterPanel.style.display = "none";
    if (roleLabelSpan) roleLabelSpan.innerHTML = "👩‍🎓 Student";
    var filterSelect = document.getElementById("regionFilterSelect");
    if (filterSelect) renderStudentFeed(filterSelect.value);
  } else {
    studentPanel.style.display = "none";
    recruiterPanel.style.display = "block";
    if (roleLabelSpan) roleLabelSpan.innerHTML = "🏢 Recruiter";
    clearFormErrors();
  }
}