// Company Approval Management
let currentCompanyView = { filter: 'pending', search: '' };

function loadCompanyApprovalPanel() {
  updateCompanyStats();
  renderCompaniesList();
  setupCompanyEventListeners();
}

function updateCompanyStats() {
  const companies = JSON.parse(localStorage.getItem('companies') || '[]');
  const pendingCompanies = companies.filter(c => c.status === 'pending').length;
  const approvedCompanies = companies.filter(c => c.status === 'approved').length;
  const totalCompanies = companies.length;
  
  const pendingEl = document.getElementById('pendingCompanies');
  const approvedEl = document.getElementById('approvedCompanies');
  const totalEl = document.getElementById('totalCompanies');
  
  if (pendingEl) pendingEl.textContent = pendingCompanies;
  if (approvedEl) approvedEl.textContent = approvedCompanies;
  if (totalEl) totalEl.textContent = totalCompanies;
}

function renderCompaniesList() {
  let companies = JSON.parse(localStorage.getItem('companies') || '[]');
  
  if (currentCompanyView.filter === 'pending') {
    companies = companies.filter(c => c.status === 'pending');
  } else if (currentCompanyView.filter === 'approved') {
    companies = companies.filter(c => c.status === 'approved');
  }
  
  if (currentCompanyView.search) {
    const searchLower = currentCompanyView.search.toLowerCase();
    companies = companies.filter(c => 
      c.companyName.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower) ||
      (c.taxId && c.taxId.toLowerCase().includes(searchLower))
    );
  }
  
  const container = document.getElementById('companiesListContainer');
  if (!container) return;
  
  if (companies.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-building"></i><p>No companies found.</p></div>';
    return;
  }
  
  container.innerHTML = companies.map(company => `
    <div class="company-card">
      <div class="company-name">
        <i class="fas fa-building"></i> ${escapeHtml(company.companyName)}
        <span class="company-status ${company.status}">${company.status === 'pending' ? 'Pending Approval' : 'Approved'}</span>
      </div>
      <div class="company-email">
        <i class="fas fa-envelope"></i> ${escapeHtml(company.email)}
      </div>
      <div class="company-details">
        <div><i class="fas fa-globe"></i> ${escapeHtml(company.website || 'N/A')}</div>
        <div><i class="fas fa-id-card"></i> Tax ID: ${escapeHtml(company.taxId || 'N/A')}</div>
        <div><i class="fas fa-map-marker-alt"></i> ${escapeHtml(company.address ? company.address.substring(0, 50) : 'N/A')}${company.address && company.address.length > 50 ? '...' : ''}</div>
      </div>
      <div class="company-actions">
        <button class="btn-view-company" onclick="viewCompanyDetails(${company.id})">
          <i class="fas fa-info-circle"></i> View Details
        </button>
        ${company.status === 'pending' ? `
          <button class="btn-approve-company" onclick="approveCompany(${company.id})">
            <i class="fas fa-check-circle"></i> Approve
          </button>
          <button class="btn-reject-company" onclick="rejectCompany(${company.id})">
            <i class="fas fa-times-circle"></i> Reject
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function setupCompanyEventListeners() {
  const searchInput = document.getElementById('companySearchInput');
  const statusFilter = document.getElementById('companyStatusFilter');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentCompanyView.search = e.target.value;
      renderCompaniesList();
    });
  }
  
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      currentCompanyView.filter = e.target.value;
      currentCompanyView.search = '';
      if (document.getElementById('companySearchInput')) {
        document.getElementById('companySearchInput').value = '';
      }
      renderCompaniesList();
    });
  }
}

function viewCompanyDetails(companyId) {
  const companies = JSON.parse(localStorage.getItem('companies') || '[]');
  const company = companies.find(c => c.id === companyId);
  
  if (!company) return;
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const submitter = users.find(u => u.id === company.submittedBy);
  
  const detailsHtml = `
    <div class="company-details-content">
      <div class="detail-row">
        <div class="detail-label">Company Name:</div>
        <div class="detail-value">${escapeHtml(company.companyName)}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Email:</div>
        <div class="detail-value">${escapeHtml(company.email)}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Website:</div>
        <div class="detail-value">${escapeHtml(company.website || 'N/A')}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Tax ID / RCCM:</div>
        <div class="detail-value">${escapeHtml(company.taxId || 'N/A')}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Registration Number:</div>
        <div class="detail-value">${escapeHtml(company.registrationNumber || 'N/A')}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Address:</div>
        <div class="detail-value">${escapeHtml(company.address || 'N/A')}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Phone:</div>
        <div class="detail-value">${escapeHtml(company.phone || 'N/A')}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Description:</div>
        <div class="detail-value">${escapeHtml(company.description || 'N/A')}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Submitted By:</div>
        <div class="detail-value">${submitter ? escapeHtml(submitter.email) : 'N/A'}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Submitted At:</div>
        <div class="detail-value">${new Date(company.submittedAt).toLocaleString()}</div>
      </div>
      ${company.status === 'approved' ? `
        <div class="detail-row">
          <div class="detail-label">Approved By:</div>
          <div class="detail-value">Admin</div>
        </div>
                <div class="detail-row">
          <div class="detail-label">Approved At:</div>
          <div class="detail-value">${new Date(company.approvedAt).toLocaleString()}</div>
        </div>
      ` : ''}
      ${company.rejectionReason ? `
        <div class="detail-row">
          <div class="detail-label">Rejection Reason:</div>
          <div class="detail-value" style="color: #e74c3c;">${escapeHtml(company.rejectionReason)}</div>
        </div>
      ` : ''}
    </div>
  `;
  
  const contentDiv = document.getElementById('companyDetailsContent');
  if (contentDiv) contentDiv.innerHTML = detailsHtml;
  
  const actionsDiv = document.getElementById('companyModalActions');
  if (actionsDiv) {
    if (company.status === 'pending') {
      actionsDiv.innerHTML = `
        <button class="btn-approve-company" onclick="approveCompany(${company.id}); closeCompanyModal();">
          <i class="fas fa-check-circle"></i> Approve Company
        </button>
        <button class="btn-reject-company" onclick="rejectCompanyWithReason(${company.id}); closeCompanyModal();">
          <i class="fas fa-times-circle"></i> Reject Company
        </button>
      `;
    } else {
      actionsDiv.innerHTML = `<button class="btn-secondary" onclick="closeCompanyModal()">Close</button>`;
    }
  }
  
  document.getElementById('companyDetailsModal').style.display = 'flex';
}

function closeCompanyModal() {
  document.getElementById('companyDetailsModal').style.display = 'none';
}

function sendApprovalEmail(companyEmail, companyName) {
  console.log('=== APPROVAL EMAIL SENT (SIMULATED) ===');
  console.log(`To: ${companyEmail}`);
  console.log(`Subject: Your Company "${companyName}" Has Been Approved on ProAvenir`);
  console.log(`Body: Congratulations! Your company "${companyName}" has been approved on the ProAvenir platform.`);
  console.log(`You can now:
  - Post job listings
  - Review student applications
  - Access all recruiter features
  
Thank you for joining ProAvenir!
=======================================`);
  
  showToast(`Approval email sent to ${companyEmail}`, "#27ae60");
}

function sendRejectionEmail(companyEmail, companyName, reason) {
  console.log('=== REJECTION EMAIL SENT (SIMULATED) ===');
  console.log(`To: ${companyEmail}`);
  console.log(`Subject: Update on Your Company "${companyName}" Registration on ProAvenir`);
  console.log(`Body: Thank you for your interest in ProAvenir.
  
After reviewing your company registration for "${companyName}", we regret to inform you that it has not been approved at this time.

Reason: ${reason}

Please update your registration information and resubmit for review.

Best regards,
ProAvenir Team
=======================================`);
  
  showToast(`Rejection notification sent to ${companyEmail}`, "#e74c3c");
}

function approveCompany(companyId) {
  const companies = JSON.parse(localStorage.getItem('companies') || '[]');
  const companyIndex = companies.findIndex(c => c.id === companyId);
  
  if (companyIndex === -1) {
    showToast("Company not found", "#e74c3c");
    return;
  }
  
  companies[companyIndex].status = "approved";
  companies[companyIndex].approvedAt = new Date().toISOString();
  companies[companyIndex].approvedBy = loggedInUser ? loggedInUser.id : 3;
  companies[companyIndex].rejectionReason = null;
  
  localStorage.setItem('companies', JSON.stringify(companies));
  
  // Update companiesDb for job listings
  window.companiesDb = companies.map(c => ({
    company_id: c.id,
    company_name: c.companyName,
    headquarters: c.address ? c.address.split(',')[0] : 'Yaoundé',
    website: c.website,
    status: c.status
  }));
  
  sendApprovalEmail(companies[companyIndex].email, companies[companyIndex].companyName);
  
  updateCompanyStats();
  renderCompaniesList();
  
  if (typeof updateAdminStats === 'function') {
    updateAdminStats();
  }
  
  showToast(`✅ Company "${companies[companyIndex].companyName}" has been approved!`, "#27ae60");
}

function rejectCompanyWithReason(companyId) {
  const reason = prompt("Please provide a reason for rejecting this company registration:");
  
  if (!reason || reason.trim().length < 5) {
    showToast("Please provide a valid reason (at least 5 characters) for rejection.", "#e74c3c");
    return;
  }
  
  const companies = JSON.parse(localStorage.getItem('companies') || '[]');
  const companyIndex = companies.findIndex(c => c.id === companyId);
  
  if (companyIndex === -1) {
    showToast("Company not found", "#e74c3c");
    return;
  }
  
  companies[companyIndex].status = "rejected";
  companies[companyIndex].rejectionReason = reason;
  companies[companyIndex].rejectedAt = new Date().toISOString();
  companies[companyIndex].rejectedBy = loggedInUser ? loggedInUser.id : 3;
  
  localStorage.setItem('companies', JSON.stringify(companies));
  
  sendRejectionEmail(companies[companyIndex].email, companies[companyIndex].companyName, reason);
  
  updateCompanyStats();
  renderCompaniesList();
  
  showToast(`❌ Company "${companies[companyIndex].companyName}" has been rejected.`, "#e74c3c");
}

function rejectCompany(companyId) {
  rejectCompanyWithReason(companyId);
}

window.viewCompanyDetails = viewCompanyDetails;
window.approveCompany = approveCompany;
window.rejectCompany = rejectCompany;
window.rejectCompanyWithReason = rejectCompanyWithReason;
window.closeCompanyModal = closeCompanyModal;