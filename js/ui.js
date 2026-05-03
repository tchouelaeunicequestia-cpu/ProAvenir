// UI Rendering Functions
function filterJobsBySearch(jobs, keyword) {
  if (!keyword || keyword.trim() === "") return jobs;
  
  const lowerKeyword = keyword.toLowerCase().trim();
  
  return jobs.filter(function(job) {
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
  
  if (regionFilter !== "all") {
    filteredJobs = filteredJobs.filter(function(job) {
      return job.location.toLowerCase().includes(regionFilter.toLowerCase());
    });
  }
  
  const searchInput = document.getElementById("searchKeyword");
  if (searchInput) {
    currentSearchKeyword = searchInput.value;
    filteredJobs = filterJobsBySearch(filteredJobs, currentSearchKeyword);
  }
  
  const clearBtn = document.getElementById("clearSearchBtn");
  if (clearBtn) {
    clearBtn.style.display = currentSearchKeyword ? "block" : "none";
  }
  
  if (filteredJobs.length === 0) {
    let message = '<div class="empty-state" aria-live="polite"><i class="fas fa-search" aria-hidden="true"></i>';
    
    if (currentSearchKeyword && regionFilter !== "all") {
      message += '<p>No jobs found matching "<strong>' + escapeHtml(currentSearchKeyword) + '</strong>" in <strong>' + regionFilter + '</strong>.</p>';
    } else if (currentSearchKeyword) {
      message += '<p>No jobs found matching "<strong>' + escapeHtml(currentSearchKeyword) + '</strong>".</p>';
    } else if (regionFilter !== "all") {
      message += '<p>No opportunities found in ' + regionFilter + '.</p>';
    } else {
      message += '<p>No opportunities available at the moment.</p>';
    }
    
    message += '</div>';
    container.innerHTML = message;
    return;
  }
  
  container.innerHTML = filteredJobs.map(function(job) {
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
>>>>>>> Stashed changes
    var hasApplied = applications.some(function(app) {
      return app.job_id === job.job_id && app.student_email === "student@example.com";
    });

    var applyButton = hasApplied
      ? '<button class="apply-btn applied" disabled><i class="fas fa-check"></i> Applied</button>'
      : '<button class="apply-btn" data-job-id="' + job.job_id + '"><i class="fas fa-paper-plane"></i> Apply</button>';

    return '<div class="job-card">' +
      '<div class="job-title">' + escapeHtml(job.title) + '</div>' +
      '<div class="company-name"><i class="fas fa-building"></i> ' + escapeHtml(job.companyName) + '</div>' +
      '<div class="job-location"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(job.location) + '</div>' +
      '<div class="job-desc">' + (job.description.length > 120 ? escapeHtml(job.description.substring(0, 120)) + "..." : escapeHtml(job.description)) + '</div>' +
      '<div><span class="badge">' + job.job_type + '</span></div>' +
      '<div class="apply-section">' + applyButton + '</div>' +
      '<hr /><div style="font-size:0.75rem; color:#3b7a95;"><i class="far fa-calendar-alt"></i> Posted: ' + new Date(job.posted_at).toLocaleDateString() + '</div>' +
=======
    const highlightedTitle = currentSearchKeyword ? highlightText(job.title, currentSearchKeyword) : escapeHtml(job.title);
    const highlightedCompany = currentSearchKeyword ? highlightText(job.companyName, currentSearchKeyword) : escapeHtml(job.companyName);
    const highlightedDesc = currentSearchKeyword ? highlightText(job.description, currentSearchKeyword) : escapeHtml(job.description);
    
    return '<div class="job-card" role="article">' +
      '<div class="job-title">' + highlightedTitle + '</div>' +
      '<div class="company-name"><i class="fas fa-building" aria-hidden="true"></i> ' + highlightedCompany + '</div>' +
      '<div class="job-location"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ' + escapeHtml(job.location) + '</div>' +
      '<div class="job-desc">' + (highlightedDesc.length > 150 ? highlightedDesc.substring(0, 150) + "..." : highlightedDesc) + '</div>' +
      '<div><span class="badge">' + job.job_type + '</span></div>' +
      '<div class="apply-status"><i class="fas fa-check-circle" style="color:#2ecc71;" aria-hidden="true"></i> Status: Open • Apply Now</div>' +
      '<hr /><div style="font-size:0.75rem; color:#3b7a95;"><i class="far fa-calendar-alt" aria-hidden="true"></i> Posted: ' + new Date(job.posted_at).toLocaleDateString() + '</div>' +
>>>>>>> 1e33388549da540ee325cc9186ee4b7bd2a869ab
      '</div>';
  }).join("");
}

function renderApplicationHistory() {
  const container = document.getElementById("applicationDashboardContainer");
  if (!container) return;

  const studentApplications = applications.filter(function(app) {
    return app.student_email === "student@example.com";
  });

  if (studentApplications.length === 0) {
    container.innerHTML = '<div class="application-history-card"><div class="empty-state"><i class="fas fa-file-alt"></i><p>You have not applied to any jobs yet. Your application history will appear here.</p></div></div>';
    return;
  }

  studentApplications.sort(function(a, b) {
    return new Date(b.applied_at) - new Date(a.applied_at);
  });

  const rows = studentApplications.map(function(app) {
    const job = jobListings.find(function(j) { return j.job_id === app.job_id; });
    if (!job) return "";
    return '<tr>' +
      '<td>' + escapeHtml(job.companyName) + '</td>' +
      '<td>' + escapeHtml(job.title) + '</td>' +
      '<td>' + escapeHtml(job.location) + '</td>' +
      '<td>' + new Date(app.applied_at).toLocaleDateString() + '</td>' +
      '<td><span class="status-badge ' + getStatusClass(app.status) + '">' + getStatusIcon(app.status) + ' ' + app.status + '</span></td>' +
      '</tr>';
  }).join("");

  container.innerHTML = '<div class="application-history-card">' +
    '<div class="history-header"><h3><i class="fas fa-chart-line"></i> My Application History</h3><p>Track the status of your submitted applications.</p></div>' +
    '<div class="history-table-wrapper"><table class="history-table"><thead><tr><th>Company</th><th>Role</th><th>Location</th><th>Applied</th><th>Status</th></tr></thead><tbody>' +
    rows +
    '</tbody></table></div>' +
    '</div>';
}

function renderRecruiterApplicants() {
  const container = document.getElementById("recruiterApplicantsContainer");
  if (!container) return;

  const activeJobsWithApps = jobListings.filter(function(job) {
    return job.is_active && applications.some(function(app) { return app.job_id === job.job_id; });
  });

  if (activeJobsWithApps.length === 0) {
    container.innerHTML = '<div class="recruiter-empty-state"><i class="fas fa-user-friends"></i><p>No applicants have applied yet. Once students submit applications, they will appear here grouped by job.</p></div>';
    return;
  }

  var groupsHtml = activeJobsWithApps.map(function(job) {
    var jobApplications = applications.filter(function(app) {
      return app.job_id === job.job_id;
    });

    var applicantRows = jobApplications.map(function(app) {
      var student = studentProfiles.find(function(profile) {
        return profile.email === app.student_email;
      }) || { email: app.student_email, name: "Unknown Student", university: "N/A", location: "N/A", skills: [], summary: "No profile available." };

      var skillBadges = student.skills.map(function(skill) {
        return '<span class="skill-pill">' + escapeHtml(skill) + '</span>';
      }).join('');

      return '<tr>' +
        '<td>' +
          '<div class="name-with-status">' +
            '<div class="applicant-name">' + escapeHtml(student.name) + '</div>' +
            '<select class="status-select" data-application-id="' + app.application_id + '">' +
              '<option value="Applied"' + (app.status === "Applied" ? ' selected' : '') + '>Applied</option>' +
              '<option value="Interview"' + (app.status === "Interview" ? ' selected' : '') + '>Interview</option>' +
              '<option value="Shortlisted"' + (app.status === "Shortlisted" ? ' selected' : '') + '>Shortlisted</option>' +
              '<option value="Rejected"' + (app.status === "Rejected" ? ' selected' : '') + '>Rejected</option>' +
            '</select>' +
          '</div>' +
        '</td>' +
        '<td>' + escapeHtml(student.university) + '</td>' +
        '<td>' + escapeHtml(student.location) + '</td>' +
        '<td>' + skillBadges + '</td>' +
        '<td><span class="status-badge ' + getStatusClass(app.status) + '">' + getStatusIcon(app.status) + ' ' + app.status + '</span></td>' +
        '</tr>';
    }).join('');

    return '<div class="recruiter-job-group">' +
      '<div class="job-group-header"><div><h3>' + escapeHtml(job.title) + '</h3><p>' + escapeHtml(job.companyName) + ' · ' + escapeHtml(job.location) + '</p></div><span class="badge">' + escapeHtml(job.job_type) + '</span></div>' +
      '<div class="history-table-wrapper recruiter-table-wrapper"><table class="history-table"><thead><tr><th>Student</th><th>School</th><th>Location</th><th>Skills</th><th>Status</th></tr></thead><tbody>' +
      applicantRows +
      '</tbody></table></div>' +
      '</div>';
  }).join('');

  container.innerHTML = '<div class="recruiter-applicants-card">' +
    '<div class="history-header"><h3><i class="fas fa-users"></i> Applicants by Job</h3><p>Review student profiles and skills grouped by the role they applied for.</p></div>' +
    groupsHtml +
    '</div>';
}

function getStatusClass(status) {
  if (!status) return "status-unknown";
  switch (status.toLowerCase()) {
    case "applied": return "status-applied";
    case "interview": return "status-interview";
    case "shortlisted": return "status-shortlisted";
    case "rejected": return "status-rejected";
    default: return "status-unknown";
  }
}

function getStatusIcon(status) {
  if (!status) return "";
  switch (status.toLowerCase()) {
    case "applied": return '<i class="fas fa-paper-plane"></i>';
    case "interview": return '<i class="fas fa-comments"></i>';
    case "shortlisted": return '<i class="fas fa-star"></i>';
    case "rejected": return '<i class="fas fa-times-circle"></i>';
    default: return '<i class="fas fa-info-circle"></i>';
  }
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
  if (msgDiv) msgDiv.innerHTML = '<span style="color:#27ae60;"><i class="fas fa-check-circle"></i> ✅ Job posted successfully!</span>';
  showToast("🎉 Job listing published!", "#27ae60");
  
  if (currentUserRole === "student") {
    renderStudentFeed(currentRegionFilter);
  }
}

function applyForJob(jobId, button) {
  var alreadyApplied = applications.some(function(app) {
    return app.job_id === jobId && app.student_email === "student@example.com";
  });

  if (alreadyApplied) {
    button.disabled = true;
    button.classList.add("applied");
    button.innerHTML = '<i class="fas fa-check"></i> Applied';
    return;
  }

  applications.push({
    application_id: nextApplicationId++,
    job_id: jobId,
    student_email: "student@example.com",
    applied_at: new Date().toISOString().split('T')[0],
    status: "Applied"
  });

  button.disabled = true;
  button.classList.add("applied");
  button.innerHTML = '<i class="fas fa-check"></i> Applied';
  showToast("✅ Application submitted. Recruiter has been notified.", "#27ae60");
  renderApplicationHistory();
}

function setRole(role) {
  var studentPanel = document.getElementById("studentPanel");
  var recruiterPanel = document.getElementById("recruiterPanel");
  var roleLabelSpan = document.getElementById("userRoleLabel");
  
  if (role === "student") {
    studentPanel.style.display = "block";
    recruiterPanel.style.display = "none";
    if (roleLabelSpan) roleLabelSpan.innerHTML = "👩‍🎓 Student";
<<<<<<< HEAD
    var filterSelect = document.getElementById("regionFilterSelect");
    if (filterSelect) renderStudentFeed(filterSelect.value);
    renderApplicationHistory();
<<<<<<< Updated upstream
=======
=======
    renderStudentFeed(currentRegionFilter);
>>>>>>> 1e33388549da540ee325cc9186ee4b7bd2a869ab
>>>>>>> Stashed changes
  } else {
    studentPanel.style.display = "none";
    recruiterPanel.style.display = "block";
    if (roleLabelSpan) roleLabelSpan.innerHTML = "🏢 Recruiter";
    clearFormErrors();
    renderRecruiterApplicants();
  }
}