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
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener("click", function(e) {
    if (e.target === forgotModal) {
      forgotModal.style.display = "none";
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
      
      // Check if email exists in users database
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.find(u => u.email === email);
      
      if (!userExists) {
        resetMessage.innerHTML = '<div class="reset-message error">No account found with this email address.</div>';
        resetMessage.style.display = "block";
        setTimeout(() => {
          resetMessage.style.display = "none";
        }, 3000);
        return;
      }
      
      // Generate unique time-sensitive token
      const token = generateResetToken(email);
      
      // Simulate sending email with reset link
      const resetLink = sendResetEmail(email, token);
      
      resetMessage.innerHTML = `<div class="reset-message success">
        <i class="fas fa-envelope"></i> Password reset link has been sent to ${email}<br>
        <small>The link will expire in 24 hours.</small>
      </div>`;
      resetMessage.style.display = "block";
      
      // Clear form
      document.getElementById("resetEmail").value = "";
      
      // Close modal after 3 seconds
      setTimeout(() => {
        forgotModal.style.display = "none";
        resetMessage.style.display = "none";
      }, 4000);
    });
  }
  
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
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find user by email and password
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        showToast("Invalid email or password. Please try again.", "#e74c3c");
        return;
      }
      
      // Check if selected role matches user role
      if (user.role !== selectedRole) {
        showToast(`This account is registered as a ${user.role}. Please select the correct role.`, "#e74c3c");
        return;
      }
      
      loggedInUser = user;
      currentUserRole = user.role;
      
      if (currentUserRole === "student") {
        setRole("student");
      } else {
        setRole("recruiter");
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
  
  // Search Input Event (live search with debounce)
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
  
  // Initial render
  renderStudentFeed("all");
});

// Helper functions for password reset
function generateResetToken(email) {
  const token = Math.random().toString(36).substring(2, 15) + 
                Date.now().toString(36);
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
  // Simulate sending email
  const resetLink = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, '')}pages/reset-password.html?token=${token}`;
  
  console.log('=== PASSWORD RESET EMAIL (SIMULATED) ===');
  console.log(`To: ${email}`);
  console.log(`Subject: Reset Your ProAvenir Password`);
  console.log(`Body: Click the following link to reset your password (valid for 24 hours):\n${resetLink}`);
  console.log('=======================================');
  
  // For demo, show the link in a dialog
  setTimeout(() => {
    const userConfirmed = confirm(`A password reset link has been generated for ${email}.\n\nClick OK to open the reset page.\n\nNote: In production, this would be sent to your email inbox.`);
    if (userConfirmed) {
      window.open(resetLink, '_blank');
    }
  }, 500);
  
  return resetLink;
}