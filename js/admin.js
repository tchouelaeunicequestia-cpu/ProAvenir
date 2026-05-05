// Admin Panel Functions
let currentAdminView = { filter: 'all', search: '' };

function loadAdminPanel() {
  updateAdminStats();
  renderUsersList();
  setupAdminEventListeners();
  setupAdminTabs();
  
  if (typeof loadCompanyApprovalPanel === 'function') {
    loadCompanyApprovalPanel();
  }
}

function setupAdminTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      contents.forEach(content => content.classList.remove('active'));
      document.getElementById(`${tabId}Tab`).classList.add('active');
      
      if (tabId === 'companies' && typeof loadCompanyApprovalPanel === 'function') {
        loadCompanyApprovalPanel();
      }
    });
  });
}

function updateAdminStats() {
  const users = JSON.parse(localStorage.getItem('users'));
  const totalUsers = users.length;
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalRecruiters = users.filter(u => u.role === 'recruiter').length;
  const totalBanned = users.filter(u => u.isBanned === true).length;
  
  document.getElementById('totalUsers').textContent = totalUsers;
  document.getElementById('totalStudents').textContent = totalStudents;
  document.getElementById('totalRecruiters').textContent = totalRecruiters;
  document.getElementById('totalBanned').textContent = totalBanned;
}

function renderUsersList() {
  let users = JSON.parse(localStorage.getItem('users'));
  
  if (currentAdminView.filter === 'banned') {
    users = users.filter(u => u.isBanned === true);
  } else if (currentAdminView.filter !== 'all') {
    users = users.filter(u => u.role === currentAdminView.filter && u.isBanned !== true);
  } else {
    users = users.filter(u => u.isBanned !== true);
  }
  
  if (currentAdminView.search) {
    const searchLower = currentAdminView.search.toLowerCase();
    users = users.filter(u => 
      (u.name && u.name.toLowerCase().includes(searchLower)) || 
      u.email.toLowerCase().includes(searchLower)
    );
  }
  
  const container = document.getElementById('usersListContainer');
  
  if (users.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-users"></i><p>No users found.</p></div>';
    return;
  }
  
  container.innerHTML = users.map(user => `
    <div class="user-card ${user.isBanned ? 'banned' : ''}">
      <div class="user-info">
        <div class="user-name">
          <i class="fas ${user.role === 'student' ? 'fa-graduation-cap' : user.role === 'recruiter' ? 'fa-building' : 'fa-shield-alt'}"></i>
          ${escapeHtml(user.name || user.email.split('@')[0])}
          <span class="user-badge ${user.role}">${user.role}</span>
        </div>
        <div class="user-email">${escapeHtml(user.email)}</div>
        <div class="user-meta">Joined: ${new Date(user.createdAt).toLocaleDateString()}</div>
        ${user.isBanned ? `<div class="ban-info"><i class="fas fa-ban"></i> Banned: ${escapeHtml(user.banReason || 'No reason provided')}</div>` : ''}
      </div>
      <div class="user-actions">
        ${!user.isBanned && user.role !== 'admin' ? `
          <button class="btn-ban" onclick="openBanModal(${user.id}, '${escapeHtml(user.name || user.email)}')">
            <i class="fas fa-ban"></i> Ban User
          </button>
        ` : ''}
        ${user.isBanned ? `
          <button class="btn-unban" onclick="unbanUserAccount(${user.id})">
            <i class="fas fa-check-circle"></i> Unban
          </button>
        ` : ''}
        <button class="btn-view-details" onclick="viewUserDetails(${user.id})">
          <i class="fas fa-info-circle"></i> Details
        </button>
      </div>
    </div>
  `).join('');
}

function setupAdminEventListeners() {
  const searchInput = document.getElementById('userSearchInput');
  const roleFilter = document.getElementById('userRoleFilter');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentAdminView.search = e.target.value;
      renderUsersList();
    });
  }
  
  if (roleFilter) {
    roleFilter.addEventListener('change', (e) => {
      currentAdminView.filter = e.target.value;
      currentAdminView.search = '';
      if (document.getElementById('userSearchInput')) {
        document.getElementById('userSearchInput').value = '';
      }
      renderUsersList();
    });
  }
}

let userToBan = null;

function openBanModal(userId, userName) {
  userToBan = userId;
  document.getElementById('banUserName').textContent = userName;
  document.getElementById('banReason').value = '';
  document.getElementById('banReasonError').textContent = '';
  document.getElementById('banUserModal').style.display = 'flex';
}

function closeBanModal() {
  document.getElementById('banUserModal').style.display = 'none';
  userToBan = null;
}

function confirmBanUser() {
  const reason = document.getElementById('banReason').value.trim();
  
  if (!reason) {
    document.getElementById('banReasonError').textContent = 'Please provide a reason for banning this user.';
    return;
  }
  
  if (reason.length < 10) {
    document.getElementById('banReasonError').textContent = 'Please provide a more detailed reason (at least 10 characters).';
    return;
  }
  
  const result = banUser(userToBan, reason, loggedInUser.id);
  
  if (result.success) {
    showToast(result.message, '#27ae60');
    closeBanModal();
    updateAdminStats();
    renderUsersList();
    
    if (loggedInUser && loggedInUser.id === userToBan) {
      showToast('You have been banned. You will be logged out.', '#e74c3c');
      setTimeout(() => {
        document.getElementById('logoutBtn').click();
      }, 2000);
    }
  } else {
    showToast(result.message, '#e74c3c');
  }
}

function unbanUserAccount(userId) {
  if (confirm('Are you sure you want to unban this user?')) {
    const result = unbanUser(userId);
    if (result.success) {
      showToast(result.message, '#27ae60');
      updateAdminStats();
      renderUsersList();
    } else {
      showToast(result.message, '#e74c3c');
    }
  }
}

function viewUserDetails(userId) {
  const users = JSON.parse(localStorage.getItem('users'));
  const user = users.find(u => u.id === userId);
  
  if (!user) return;
  
  const banHistory = JSON.parse(localStorage.getItem('banHistory') || '[]');
  const userHistory = banHistory.filter(h => h.userId === userId);
  
  let historyText = '';
  if (userHistory.length > 0) {
    historyText = '\n\nAudit History:\n';
    userHistory.forEach(h => {
      if (h.action === 'ban') {
        historyText += `- Banned: ${new Date(h.bannedAt).toLocaleString()} - Reason: ${h.reason} - By: ${h.bannedBy}\n`;
      } else {
        historyText += `- Unbanned: ${new Date(h.unbannedAt).toLocaleString()}\n`;
      }
    });
  } else {
    historyText = '\n\nNo audit history available.';
  }
  
  alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.isBanned ? 'Banned' : 'Active'}\n${user.isBanned ? `\nBan Reason: ${user.banReason}\nBanned At: ${new Date(user.bannedAt).toLocaleString()}\nBanned By: ${user.bannedBy}` : ''}${historyText}`);
}

window.openBanModal = openBanModal;
window.closeBanModal = closeBanModal;
window.confirmBanUser = confirmBanUser;
window.unbanUserAccount = unbanUserAccount;
window.viewUserDetails = viewUserDetails;
window.loadAdminPanel = loadAdminPanel;