// Main Application Logic
document.addEventListener("DOMContentLoaded", function() {
  
  // Login Role Selection
  let selectedRole = "student";
  const loginRoleText = document.getElementById("loginRoleText");
  
  const roleOptions = document.querySelectorAll(".role-option");
  roleOptions.forEach(option => {
    option.addEventListener("click", function() {
      roleOptions.forEach(opt => opt.classList.remove("selected"));
      this.classList.add("selected");
      selectedRole = this.getAttribute("data-role");
      loginRoleText.textContent = selectedRole === "student" ? "Student" : "Recruiter";
    });
  });
  
  // Handle Login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
      
      if (!email || !password) {
        showToast("Please enter email and password", "#e74c3c");
        return;
      }
      
      if (selectedRole === "student") {
        currentUserRole = "student";
        setRole("student");
      } else {
        currentUserRole = "recruiter";
        setRole("recruiter");
      }
      
      document.getElementById("loginPage").style.display = "none";
      document.getElementById("mainApp").style.display = "block";
      showToast(`Welcome ${selectedRole === "student" ? "Student" : "Recruiter"}!`, "#27ae60");
    });
  }
  
  // Handle Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
      document.getElementById("loginPage").style.display = "flex";
      document.getElementById("mainApp").style.display = "none";
      document.getElementById("loginEmail").value = "";
      document.getElementById("loginPassword").value = "";
      currentUserRole = null;
      showToast("Logged out successfully", "#1e2a36");
    });
  }
  
  // Region Filter
  const regionFilter = document.getElementById("regionFilterSelect");
  if (regionFilter) {
    regionFilter.addEventListener("change", function(e) {
      if (currentUserRole === "student") {
        renderStudentFeed(e.target.value);
      }
    });
  }
  
  // Job Post Form
  const jobPostForm = document.getElementById("jobPostForm");
  if (jobPostForm) {
    jobPostForm.addEventListener("submit", postNewJob);
  }
  
  // Apply button click handler
  document.addEventListener("click", function(e) {
    if (e.target.closest(".apply-btn") && !e.target.closest(".apply-btn").disabled) {
      const button = e.target.closest(".apply-btn");
      const jobId = parseInt(button.getAttribute("data-job-id"), 10);
      if (!isNaN(jobId)) {
        applyForJob(jobId, button);
      }
    }
  });

  document.addEventListener("change", function(e) {
    if (e.target.matches(".status-select")) {
      const select = e.target;
      const applicationId = parseInt(select.getAttribute("data-application-id"), 10);
      const newStatus = select.value;
      if (!isNaN(applicationId) && newStatus) {
        updateApplicationStatus(applicationId, newStatus);
      }
    }
  });
  
  // Initial render
  renderStudentFeed("all");
  renderApplicationHistory();
});

function updateApplicationStatus(applicationId, newStatus) {
  const application = applications.find(function(app) {
    return app.application_id === applicationId;
  });
  if (!application) {
    showToast("Unable to update application status.", "#e74c3c");
    return;
  }

  showToast("Saving applicant status...", "#3498db");
  setTimeout(function() {
    application.status = newStatus;
    showToast("Status updated to " + newStatus + ".", "#27ae60");
    if (currentUserRole === "recruiter") {
      renderRecruiterApplicants();
    }
    if (currentUserRole === "student") {
      renderApplicationHistory();
    }
  }, 500);
}
