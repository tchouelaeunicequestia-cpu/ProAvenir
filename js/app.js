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
      loginRoleText.textContent = selectedRole === "student" ? "Student" : selectedRole === "recruiter" ? "Recruiter" : "Admin";
    });
  });
  
  // Forgot Password Modal
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  const forgotModal = document.getElementById("forgotPasswordModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", function(e) {
      e.preventDefault();
      forgotModal.style.display = "flex";
    });
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function() {
      forgotModal.style.display = "none";
      document.getElementById("resetEmail").value = "";
      document.getElementById("resetEmailError").textContent = "";
      const resetMessage = document.getElementById("resetMessage");
      resetMessage.innerHTML = "";
      resetMessage.className = "reset-message";
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener("click", function(e) {
    if (e.target === forgotModal) {
      forgotModal.style.display = "none";
      document.getElementById("resetEmail").value = "";
      document.getElementById("resetEmailError").textContent = "";
      const resetMessage = document.getElementById("resetMessage");
      resetMessage.innerHTML = "";
      resetMessage.className = "reset-message";
    }
    if (e.target === document.getElementById('banUserModal')) {
      closeBanModal();
    }
  });
  
  // Handle Forgot Password Form Submission
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const email = document.getElementById("resetEmail").value.trim();
      const emailError = document.getElementById("resetEmailError");
      const resetMessage = document.getElementById("resetMessage");
      
      if (!email) {
        emailError.textContent = "Please enter your email address";
        return;
      }
      
      emailError.textContent = "";
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.find(u => u.email === email);
      
      if (!userExists) {
        resetMessage.innerHTML = '<div class="reset-message error">❌ No account found with this email address.</div>';
        resetMessage.style.display = "block";
        setTimeout(() => {
          resetMessage.innerHTML = "";
          resetMessage.style.display = "none";
        }, 3000);
        return;
      }
      
      const token = generateResetToken(email);
      sendResetEmail(email, token);
      
      resetMessage.innerHTML = `<div class="reset-message success">
        <i class="fas fa-envelope"></i> ✅ Password reset link has been sent to ${email}<br>
        <small>The link will expire in 24 hours.</small>
      </div>`;
      resetMessage.style.display = "block";
      
      document.getElementById("resetEmail").value = "";
      
      setTimeout(() => {
        forgotModal.style.display = "none";
        resetMessage.innerHTML = "";
        resetMessage.style.display = "none";
      }, 4000);
    });
  }
  
  // Handle Login with ban check
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
      
      // Check if user is banned
      if (isUserBanned(email)) {
        const banReason = getBanReason(email);
        showToast(`Your account has been banned. Reason: ${banReason || 'Violation of terms'}`, "#e74c3c");
        return;
      }
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        showToast("Invalid email or password. Please try again.", "#e74c3c");
        return;
      }
      
      if (user.role !== selectedRole) {
        showToast(`This account is registered as a ${user.role}. Please select the correct role.`, "#e74c3c");
        return;
      }
      
      loggedInUser = user;
      currentUserRole = user.role;
      
      if (currentUserRole === "student") {
        setRole("student");
        if (!resumeManager) {
          resumeManager = new ResumeManager();
        }
        resumeManager.setStudentId(user.id);
      } else if (currentUserRole === "recruiter") {
        setRole("recruiter");
        refreshStudentsList();
      } else if (currentUserRole === "admin") {
        setRole("admin");
        loadAdminPanel();
      }
      
      document.getElementById("loginPage").style.display = "none";
      document.getElementById("mainApp").style.display = "block";
      showToast(`Welcome back, ${user.name || user.email.split('@')[0]}!`, "#27ae60");
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
      loggedInUser = null;
      currentSearchKeyword = "";
      currentRegionFilter = "all";
      showToast("Logged out successfully", "#1e2a36");
    });
  }
  
  // Search Input Event
  const searchInput = document.getElementById("searchKeyword");
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener("input", function(e) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        if (currentUserRole === "student") {
          renderStudentFeed(currentRegionFilter);
        }
      }, 300);
    });
  }
  
  // Clear Search Button
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", function() {
      if (searchInput) {
        searchInput.value = "";
        currentSearchKeyword = "";
        clearSearchBtn.style.display = "none";
        if (currentUserRole === "student") {
          renderStudentFeed(currentRegionFilter);
        }
        showToast("Search cleared", "#1e2a36");
      }
    });
  }
  
  // Region Filter
  const regionFilter = document.getElementById("regionFilterSelect");
  if (regionFilter) {
    regionFilter.addEventListener("change", function(e) {
      if (currentUserRole === "student") {
        currentRegionFilter = e.target.value;
        renderStudentFeed(currentRegionFilter);
      }
    });
  }
  
  // Job Post Form
  const jobPostForm = document.getElementById("jobPostForm");
  if (jobPostForm) {
    jobPostForm.addEventListener("submit", postNewJob);
  }
  
  // Ban Modal Buttons
  const cancelBanBtn = document.getElementById("cancelBanBtn");
  if (cancelBanBtn) {
    cancelBanBtn.addEventListener("click", closeBanModal);
  }
  
  const banUserForm = document.getElementById("banUserForm");
  if (banUserForm) {
    banUserForm.addEventListener("submit", function(e) {
      e.preventDefault();
      confirmBanUser();
    });
  }
  
  const closeBanModalBtn = document.getElementById("closeBanModalBtn");
  if (closeBanModalBtn) {
    closeBanModalBtn.addEventListener("click", closeBanModal);
  }
  
  // Initial render
  renderStudentFeed("all");
});

// Override setRole to include admin
const originalSetRole = setRole;
setRole = function(role) {
  var studentPanel = document.getElementById("studentPanel");
  var recruiterPanel = document.getElementById("recruiterPanel");
  var adminPanel = document.getElementById("adminPanel");
  var roleLabelSpan = document.getElementById("userRoleLabel");
  
  if (role === "student") {
    if (studentPanel) studentPanel.style.display = "block";
    if (recruiterPanel) recruiterPanel.style.display = "none";
    if (adminPanel) adminPanel.style.display = "none";
    if (roleLabelSpan) roleLabelSpan.innerHTML = "👩‍🎓 Student";
    renderStudentFeed(currentRegionFilter);
  } else if (role === "recruiter") {
    if (studentPanel) studentPanel.style.display = "none";
    if (recruiterPanel) recruiterPanel.style.display = "block";
    if (adminPanel) adminPanel.style.display = "none";
    if (roleLabelSpan) roleLabelSpan.innerHTML = "🏢 Recruiter";
    clearFormErrors();
  } else if (role === "admin") {
    if (studentPanel) studentPanel.style.display = "none";
    if (recruiterPanel) recruiterPanel.style.display = "none";
    if (adminPanel) adminPanel.style.display = "block";
    if (roleLabelSpan) roleLabelSpan.innerHTML = "👨‍💼 Admin";
  }
};