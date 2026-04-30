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