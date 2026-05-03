// UI Rendering Functions
function filterJobsBySearch(jobs, keyword) {
  if (!keyword || keyword.trim() === "") return jobs;
  
  const lowerKeyword = keyword.toLowerCase().trim();
  
  return jobs.filter(function(job) {
    // Search in job title, company name, and description (case-insensitive)
    return job.title.toLowerCase().includes(lowerKeyword) ||
           job.companyName.toLowerCase().includes(lowerKeyword) ||
           job.description.toLowerCase().includes(lowerKeyword);
  });
}

function renderStudentFeed(regionFilter) {
  const container = document.getElementById("jobCardsContainer");
  if (!container) return;
  
  currentRegionFilter = regionFilter;
  updateActiveFilters();
  
  let filteredJobs = jobListings.filter(function(job) { return job.is_active === true; });
  
  // Apply region filter
  if (regionFilter !== "all") {
    filteredJobs = filteredJobs.filter(function(job) {
      return job.location.toLowerCase().includes(regionFilter.toLowerCase());
    });
  }
  
  // Apply search keyword filter
  const searchInput = document.getElementById("searchKeyword");
  if (searchInput) {
    currentSearchKeyword = searchInput.value;
    filteredJobs = filterJobsBySearch(filteredJobs, currentSearchKeyword);
  }
  
  // Show/hide clear search button
  const clearBtn = document.getElementById("clearSearchBtn");
  if (clearBtn) {
    clearBtn.style.display = currentSearchKeyword ? "block" : "none";
  }
  
  // Check if no results found
  if (filteredJobs.length === 0) {
    let message = '<div class="empty-state"><i class="fas fa-search"></i>';
    
    if (currentSearchKeyword && regionFilter !== "all") {
      message += '<p>No jobs found matching "<strong>' + escapeHtml(currentSearchKeyword) + '</strong>" in <strong>' + regionFilter + '</strong>.</p>';
      message += '<small>Try a different keyword or region filter.</small>';
    } else if (currentSearchKeyword) {
      message += '<p>No jobs found matching "<strong>' + escapeHtml(currentSearchKeyword) + '</strong>".</p>';
      message += '<small>Try using different keywords (e.g., "Developer", "Java", "Marketing").</small>';
    } else if (regionFilter !== "all") {
      message += '<p>No opportunities found in ' + regionFilter + '.</p>';
      message += '<small>Try adjusting your region filter.</small>';
    } else {
      message += '<p>No opportunities available at the moment.</p>';
      message += '<small>Check back later for new listings!</small>';
    }
    
    message += '</div>';
    container.innerHTML = message;
    return;
  }
  
  // Render jobs with highlighted search terms
  container.innerHTML = filteredJobs.map(function(job) {
    const highlightedTitle = currentSearchKeyword ? highlightText(job.title, currentSearchKeyword) : escapeHtml(job.title);
    const highlightedCompany = currentSearchKeyword ? highlightText(job.companyName, currentSearchKeyword) : escapeHtml(job.companyName);
    const highlightedDesc = currentSearchKeyword ? highlightText(job.description, currentSearchKeyword) : escapeHtml(job.description);
    
    return '<div class="job-card">' +
      '<div class="job-title">' + highlightedTitle + '</div>' +
      '<div class="company-name"><i class="fas fa-building"></i> ' + highlightedCompany + '</div>' +
      '<div class="job-location"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(job.location) + '</div>' +
      '<div class="job-desc">' + (highlightedDesc.length > 150 ? highlightedDesc.substring(0, 150) + "..." : highlightedDesc) + '</div>' +
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
  
  // Refresh the student feed with current filters
  if (currentUserRole === "student") {
    renderStudentFeed(currentRegionFilter);
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
    renderStudentFeed(currentRegionFilter);
  } else {
    studentPanel.style.display = "none";
    recruiterPanel.style.display = "block";
    if (roleLabelSpan) roleLabelSpan.innerHTML = "🏢 Recruiter";
    clearFormErrors();
  }
}