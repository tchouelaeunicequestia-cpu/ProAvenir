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
  
  // Case-insensitive regex for highlighting
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
    
    // Trigger re-render
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
    
    // Trigger re-render
    if (typeof renderStudentFeed === 'function') {
      renderStudentFeed(currentRegionFilter);
    }
  }
}

// Make functions available globally
window.clearSearch = clearSearch;
window.clearRegionFilter = clearRegionFilter;