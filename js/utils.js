// Utility Functions
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function highlightText(text, keyword) {
  if (!keyword || keyword.trim() === "") return escapeHtml(text);
  
  const escapedText = escapeHtml(text);
  const escapedKeyword = escapeHtml(keyword);
  const regex = new RegExp('(' + escapedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return escapedText.replace(regex, '<span class="highlight">$1</span>');
}

function showToast(msg, bgColor) {
  bgColor = bgColor || "#1e2a36";
  var toast = document.querySelector(".toast-notify");
  if (toast) toast.remove();
  var newToast = document.createElement("div");
  newToast.className = "toast-notify";
  newToast.innerHTML = '<i class="fas fa-bell"></i> ' + msg;
  newToast.style.backgroundColor = bgColor;
  document.body.appendChild(newToast);
  setTimeout(function() { 
    if(newToast && newToast.remove) newToast.remove(); 
  }, 3000);
}

function showFieldError(elementId, message) {
  const errDiv = document.getElementById(elementId);
  if (errDiv) errDiv.innerText = message;
}

function clearFormErrors() {
  var errorIds = ["titleError", "companyError", "locationError", "descError"];
  for (var i = 0; i < errorIds.length; i++) {
    var el = document.getElementById(errorIds[i]);
    if (el) el.innerText = "";
  }
  var msgDiv = document.getElementById("postMessage");
  if (msgDiv) msgDiv.innerHTML = "";
}

// Password validation function
function validatePasswordStrength(password) {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&]/.test(password)
  };
  
  return Object.values(requirements).every(Boolean);
}

function getPasswordStrength(password) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[@$!%*?&]/.test(password)
  ];
  return checks.filter(Boolean).length;
}

// Generate reset token (simulated email sending)
function sendResetEmail(email, token) {
  // In production, this would send an actual email
  // For demo, we'll simulate and show the reset link
  const resetLink = `${window.location.origin}/proavenir-project/pages/reset-password.html?token=${token}`;
  console.log('Reset link (simulated email):', resetLink);
  
  // Show the reset link in a modal or toast for demo purposes
  showToast(`Reset link sent! Check console or use: ${resetLink.substring(0, 50)}...`, "#27ae60");
  
  // For demo, open the reset link in a new tab
  setTimeout(() => {
    if (confirm(`Reset link generated!\n\nClick OK to open the reset page.\n\nNote: In production, this would be sent to ${email}`)) {
      window.open(resetLink, '_blank');
    }
  }, 500);
  
  return resetLink;
}

function updateActiveFilters() {
  const activeFiltersDiv = document.getElementById("activeFilters");
  if (!activeFiltersDiv) return;
  
  let filtersHtml = "";
  
  if (currentSearchKeyword) {
    filtersHtml += `<span class="filter-tag">
      <i class="fas fa-search"></i> Search: "${escapeHtml(currentSearchKeyword)}"
      <i class="fas fa-times-circle" onclick="clearSearch()"></i>
    </span>`;
  }
  
  if (currentRegionFilter && currentRegionFilter !== "all") {
    filtersHtml += `<span class="filter-tag">
      <i class="fas fa-map-marker-alt"></i> Region: ${escapeHtml(currentRegionFilter)}
      <i class="fas fa-times-circle" onclick="clearRegionFilter()"></i>
    </span>`;
  }
  
  if (filtersHtml) {
    activeFiltersDiv.innerHTML = filtersHtml;
    activeFiltersDiv.style.display = "flex";
  } else {
    activeFiltersDiv.innerHTML = "";
    activeFiltersDiv.style.display = "none";
  }
}

function clearSearch() {
  const searchInput = document.getElementById("searchKeyword");
  if (searchInput) {
    searchInput.value = "";
    currentSearchKeyword = "";
    const clearBtn = document.getElementById("clearSearchBtn");
    if (clearBtn) clearBtn.style.display = "none";
    updateActiveFilters();
    
    if (typeof renderStudentFeed === 'function') {
      renderStudentFeed(currentRegionFilter);
    }
  }
}

function clearRegionFilter() {
  const regionSelect = document.getElementById("regionFilterSelect");
  if (regionSelect) {
    regionSelect.value = "all";
    currentRegionFilter = "all";
    updateActiveFilters();
    
    if (typeof renderStudentFeed === 'function') {
      renderStudentFeed(currentRegionFilter);
    }
  }
}

// Make functions available globally
window.clearSearch = clearSearch;
window.clearRegionFilter = clearRegionFilter;
window.validatePasswordStrength = validatePasswordStrength;