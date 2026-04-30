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
  
  // Initial render
  renderStudentFeed("all");
});