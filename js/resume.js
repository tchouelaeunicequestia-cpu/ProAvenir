// Resume Management System
class ResumeManager {
  constructor() {
    this.studentId = null;
    this.resumeData = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadSavedResume();
  }

  setStudentId(id) {
    this.studentId = id;
    this.loadSavedResume();
  }

  setupEventListeners() {
    const fileInput = document.getElementById('resumeFile');
    const viewBtn = document.getElementById('viewResumeBtn');
    const deleteBtn = document.getElementById('deleteResumeBtn');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
    }

    if (viewBtn) {
      viewBtn.addEventListener('click', () => this.viewResume());
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => this.deleteResume());
    }
  }

  loadSavedResume() {
    if (!this.studentId) return;

    const resumes = JSON.parse(localStorage.getItem('studentResumes') || '{}');
    const savedResume = resumes[this.studentId];

    if (savedResume && savedResume.data) {
      this.resumeData = savedResume;
      this.updateUI(savedResume.fileName, savedResume.fileSize);
      this.showMessage('Resume loaded successfully!', 'success');
    } else {
      this.updateUI(null);
    }
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.showMessage('❌ Only PDF files are allowed. Please select a PDF document.', 'error');
      event.target.value = '';
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showMessage(`❌ File size exceeds 5MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`, 'error');
      event.target.value = '';
      return;
    }

    this.showUploadProgress(true);

    setTimeout(() => {
      this.uploadResume(file);
    }, 1000);
  }

  uploadResume(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const base64Data = e.target.result;
      
      const resumes = JSON.parse(localStorage.getItem('studentResumes') || '{}');
      resumes[this.studentId] = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        data: base64Data,
        uploadDate: new Date().toISOString(),
        studentEmail: loggedInUser ? loggedInUser.email : ''
      };
      
      localStorage.setItem('studentResumes', JSON.stringify(resumes));
      
      this.resumeData = resumes[this.studentId];
      this.updateUI(file.name, file.size);
      this.showMessage('✅ Resume uploaded successfully! Recruiters can now view it.', 'success');
      this.showUploadProgress(false);
      
      document.getElementById('resumeFile').value = '';
      
      if (typeof refreshStudentsList === 'function') {
        refreshStudentsList();
      }
    };
    
    reader.onerror = () => {
      this.showMessage('❌ Error reading file. Please try again.', 'error');
      this.showUploadProgress(false);
    };
    
    reader.readAsDataURL(file);
  }

  viewResume() {
    if (!this.resumeData || !this.resumeData.data) {
      this.showMessage('No resume found to view.', 'error');
      return;
    }

    const blob = this.base64ToBlob(this.resumeData.data, 'application/pdf');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  deleteResume() {
    if (!this.resumeData) {
      this.showMessage('No resume to delete.', 'error');
      return;
    }

    if (confirm('Are you sure you want to delete your resume? This action cannot be undone.')) {
      const resumes = JSON.parse(localStorage.getItem('studentResumes') || '{}');
      delete resumes[this.studentId];
      localStorage.setItem('studentResumes', JSON.stringify(resumes));
      
      this.resumeData = null;
      this.updateUI(null);
      this.showMessage('✅ Resume deleted successfully. You can upload a new one.', 'success');
      
      if (typeof refreshStudentsList === 'function') {
        refreshStudentsList();
      }
    }
  }

  updateUI(fileName, fileSize) {
    const fileNameSpan = document.getElementById('resumeFileName');
    const viewBtn = document.getElementById('viewResumeBtn');
    const deleteBtn = document.getElementById('deleteResumeBtn');
    const statusIcon = document.querySelector('#resumeStatus i');
    
    if (fileName) {
      const sizeInMB = (fileSize / (1024 * 1024)).toFixed(2);
      fileNameSpan.innerHTML = `<i class="fas fa-file-pdf"></i> ${fileName} (${sizeInMB}MB)`;
      fileNameSpan.style.color = '#27ae60';
      if (statusIcon) {
        statusIcon.className = 'fas fa-check-circle';
        statusIcon.style.color = '#27ae60';
      }
      if (viewBtn) {
        viewBtn.style.display = 'inline-flex';
        viewBtn.disabled = false;
      }
      if (deleteBtn) {
        deleteBtn.style.display = 'inline-flex';
      }
    } else {
      fileNameSpan.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> No resume uploaded';
      fileNameSpan.style.color = '#6c8a9c';
      if (statusIcon) {
        statusIcon.className = 'fas fa-cloud-upload-alt';
        statusIcon.style.color = '#6c8a9c';
      }
      if (viewBtn) {
        viewBtn.style.display = 'none';
        viewBtn.disabled = true;
      }
      if (deleteBtn) {
        deleteBtn.style.display = 'none';
      }
    }
  }

  showMessage(message, type) {
    const messageDiv = document.getElementById('resumeMessage');
    if (messageDiv) {
      messageDiv.textContent = message;
      messageDiv.className = `resume-message ${type}`;
      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'resume-message';
      }, 5000);
    } else {
      showToast(message, type === 'error' ? '#e74c3c' : '#27ae60');
    }
  }

  showUploadProgress(show) {
    const progressDiv = document.getElementById('uploadProgress');
    if (progressDiv) {
      progressDiv.style.display = show ? 'flex' : 'none';
    }
  }

  base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  static getStudentResume(studentId) {
    const resumes = JSON.parse(localStorage.getItem('studentResumes') || '{}');
    return resumes[studentId] || null;
  }

  static getAllStudentsWithResumes() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const students = users.filter(u => u.role === 'student' && !u.isBanned);
    const resumes = JSON.parse(localStorage.getItem('studentResumes') || '{}');
    
    return students.map(student => ({
      ...student,
      hasResume: !!resumes[student.id],
      resume: resumes[student.id] || null
    }));
  }
}

let resumeManager = null;

function refreshStudentsList() {
  const container = document.getElementById('studentsListContainer');
  if (!container) return;
  
  const students = ResumeManager.getAllStudentsWithResumes();
  
  if (students.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-users"></i><p>No active students found.</p></div>';
    return;
  }
  
  container.innerHTML = students.map(student => `
    <div class="student-card">
      <div class="student-name">
        <i class="fas fa-user-graduate"></i> ${escapeHtml(student.name || student.email.split('@')[0])}
      </div>
      <div class="student-email">
        <i class="fas fa-envelope"></i> ${escapeHtml(student.email)}
      </div>
      <div class="resume-info">
        <div class="resume-status-badge ${student.hasResume ? 'has-resume' : 'no-resume'}">
          <i class="fas ${student.hasResume ? 'fa-file-pdf' : 'fa-times-circle'}"></i>
          ${student.hasResume ? 'Resume Available' : 'No Resume'}
        </div>
        ${student.hasResume ? `
          <button class="btn-download-resume" onclick="downloadStudentResume(${student.id})">
            <i class="fas fa-download"></i> Download PDF
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function downloadStudentResume(studentId) {
  const resume = ResumeManager.getStudentResume(studentId);
  
  if (!resume || !resume.data) {
    showToast('No resume found for this student.', '#e74c3c');
    return;
  }
  
  const byteCharacters = atob(resume.data.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = resume.fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast(`Downloading ${resume.fileName}`, '#27ae60');
}

window.downloadStudentResume = downloadStudentResume;
window.refreshStudentsList = refreshStudentsList;