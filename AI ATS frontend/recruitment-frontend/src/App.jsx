
import { useEffect, useState } from 'react';
import './App.css';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'jobs', label: 'Jobs', icon: '▤' },
  { id: 'candidates', label: 'Candidates', icon: '♙' },
  { id: 'screening', label: 'AI Screening', icon: '✧' },
];

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">F</div>
        <div>
          <h2>FacultyHire</h2>
          <span>RECRUITMENT PORTAL</span>
        </div>
      </div>

      <p className="nav-heading">WORKSPACE</p>

      <nav className="navigation">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-avatar">HR</div>
        <div>
          <strong>Recruitment Team</strong>
          <span>Administrator</span>
        </div>
      </div>
    </aside>
  );
}

function StatCard({ label, value, icon, note }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <h2>{value}</h2>
      <p>{note}</p>
    </div>
  );
}

function Dashboard({ onNavigate }) {
  return (
    <div className="page-content">
      <div className="welcome-section">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Recruitment Dashboard</h1>
          <p className="muted">
            Manage faculty openings, candidates, and AI-assisted screening.
          </p>
        </div>
        <button className="primary-button" onClick={() => onNavigate('jobs')}>
          + View Jobs
        </button>
      </div>

      <div className="notice">
        <span>ⓘ</span>
        Preview mode — dashboard figures are sample data, not live database records.
      </div>

      <div className="stats-grid">
        <StatCard label="Open Positions" value="04" icon="▤" note="Sample dashboard figure" />
        <StatCard label="Total Candidates" value="128" icon="♙" note="Sample dashboard figure" />
        <StatCard label="Resumes Uploaded" value="96" icon="▧" note="Sample dashboard figure" />
        <StatCard label="AI Screenings" value="72" icon="✧" note="Sample dashboard figure" />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Recruitment Workflow</h3>
              <p>How candidates move through the system</p>
            </div>
          </div>

          <div className="workflow-list">
            <div className="workflow-item">
              <span className="workflow-number">01</span>
              <div>
                <strong>Create a job opening</strong>
                <p>Define the faculty position and requirements.</p>
              </div>
            </div>
            <div className="workflow-item">
              <span className="workflow-number">02</span>
              <div>
                <strong>Register candidates</strong>
                <p>Add applicant details and upload resumes.</p>
              </div>
            </div>
            <div className="workflow-item">
              <span className="workflow-number">03</span>
              <div>
                <strong>Run AI-assisted screening</strong>
                <p>Review skill matches, evidence, and explanations.</p>
              </div>
            </div>
            <div className="workflow-item">
              <span className="workflow-number">04</span>
              <div>
                <strong>Recruiter review</strong>
                <p>Make the final decision with human oversight.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel quick-actions">
          <div className="panel-heading">
            <div>
              <h3>Quick Actions</h3>
              <p>Continue building your recruitment pipeline</p>
            </div>
          </div>

          <button className="action-row" onClick={() => onNavigate('jobs')}>
            <span className="action-icon">＋</span>
            <span>
              <strong>View job openings</strong>
              <small>Load positions from the database</small>
            </span>
            <span className="action-arrow">›</span>
          </button>

          <button className="action-row" onClick={() => onNavigate('candidates')}>
            <span className="action-icon">♙</span>
            <span>
              <strong>Manage candidates</strong>
              <small>Review registered applicants</small>
            </span>
            <span className="action-arrow">›</span>
          </button>

          <button className="action-row" onClick={() => onNavigate('screening')}>
            <span className="action-icon">✧</span>
            <span>
              <strong>Review AI screening</strong>
              <small>Explore screening results</small>
            </span>
            <span className="action-arrow">›</span>
          </button>
        </section>
      </div>
    </div>
  );
}


function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    title: '',
    department: '',
    description: '',
  });

  async function fetchJobs() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/jobs');

      if (!response.ok) {
        throw new Error(`Failed to load jobs (${response.status}).`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('The server did not return a list of jobs.');
      }

      setJobs(data);
    } catch (err) {
      setError(err.message || 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || `Could not create job (${response.status}).`
        );
      }

      setForm({
        title: '',
        department: '',
        description: '',
      });

      setShowForm(false);
      setSuccess('Job created successfully!');
      await fetchJobs();
    } catch (err) {
      setError(err.message || 'Could not create the job.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-content">
      <div className="welcome-section">
        <div>
          <p className="eyebrow">RECRUITMENT MANAGEMENT</p>
          <h1>Job Openings</h1>
          <p className="muted">
            Create and manage faculty positions.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            setShowForm((previous) => !previous);
            setError('');
            setSuccess('');
          }}
        >
          {showForm ? 'Cancel' : '+ Create Job'}
        </button>
      </div>

      {success && (
        <div className="notice">
          <span>✓</span>
          {success}
        </div>
      )}

      {error && (
        <div className="error-message">
          <strong>Something went wrong</strong>
          <p>{error}</p>
        </div>
      )}

      {showForm && (
        <section className="panel job-form-panel">
          <div className="panel-heading">
            <div>
              <h3>Create a Faculty Position</h3>
              <p>Enter the details of the new job opening.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="job-form">
            <div className="form-field">
              <label htmlFor="title">Job Title *</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Assistant Professor"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="department">Department *</label>
              <input
                id="department"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the position and its responsibilities..."
                rows={5}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Job'}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="panel jobs-panel">
        <div className="panel-heading">
          <div>
            <h3>All Job Openings</h3>
            <p>Positions retrieved from your database.</p>
          </div>

          <button
            className="secondary-button"
            onClick={fetchJobs}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <p className="state-message">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">▤</div>
            <h3>No jobs found</h3>
            <p>Create your first faculty position to get started.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>JOB ID</th>
                  <th>JOB TITLE</th>
                  <th>DEPARTMENT</th>
                  <th>DESCRIPTION</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>#{job.id}</td>
                    <td>
                      <strong>{job.title ?? 'Untitled position'}</strong>
                    </td>
                    <td>{job.department ?? '—'}</td>
                    <td className="description-cell">
                      {job.description ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}


function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    jobId: '',
  });

  async function fetchCandidates() {
    const response = await fetch('/api/candidates');

    if (!response.ok) {
      throw new Error(`Could not load candidates (${response.status}).`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('The candidates API did not return a list.');
    }

    setCandidates(data);
  }

  async function fetchPageData() {
    try {
      setLoading(true);
      setError('');

      const [candidateResponse, jobResponse] = await Promise.all([
        fetch('/api/candidates'),
        fetch('/api/jobs'),
      ]);

      if (!candidateResponse.ok) {
        throw new Error(
          `Could not load candidates (${candidateResponse.status}).`
        );
      }

      if (!jobResponse.ok) {
        throw new Error(`Could not load jobs (${jobResponse.status}).`);
      }

      const candidateData = await candidateResponse.json();
      const jobData = await jobResponse.json();

      if (!Array.isArray(candidateData) || !Array.isArray(jobData)) {
        throw new Error('The server returned data in an unexpected format.');
      }

      setCandidates(candidateData);
      setJobs(jobData);
    } catch (err) {
      setError(err.message || 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPageData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.jobId) {
      setError('Please select a job opening for this candidate.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/candidates/jobs/${form.jobId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
          }),
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || `Could not register candidate (${response.status}).`
        );
      }

      setForm({
        fullName: '',
        email: '',
        phone: '',
        jobId: '',
      });

      setShowForm(false);
      setSuccess('Candidate registered successfully.');

      await fetchCandidates();
    } catch (err) {
      setError(err.message || 'Could not register candidate.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-content">
      <div className="welcome-section">
        <div>
          <p className="eyebrow">RECRUITMENT MANAGEMENT</p>
          <h1>Candidates</h1>
          <p className="muted">
            View applicants and register candidates for faculty positions.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            setShowForm((previous) => !previous);
            setError('');
            setSuccess('');
          }}
        >
          {showForm ? 'Cancel' : '+ Add Candidate'}
        </button>
      </div>

      {success && (
        <div className="notice">
          <span>✓</span>
          {success}
        </div>
      )}

      {error && (
        <div className="error-message">
          <strong>Something went wrong</strong>
          <p>{error}</p>
        </div>
      )}

      {showForm && (
        <section className="panel job-form-panel">
          <div className="panel-heading">
            <div>
              <h3>Register a Candidate</h3>
              <p>Enter the applicant's details and select a job opening.</p>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="empty-state">
              <h3>No job openings available</h3>
              <p>Create a job before registering a candidate.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="job-form">
              <div className="form-field">
                <label htmlFor="candidate-name">Full Name *</label>
                <input
                  id="candidate-name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter candidate's full name"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="candidate-email">Email *</label>
                <input
                  id="candidate-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="candidate@example.com"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="candidate-phone">Phone *</label>
                <input
                  id="candidate-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="candidate-job">Job Opening *</label>
                <select
                  id="candidate-job"
                  name="jobId"
                  value={form.jobId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a job opening</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} — {job.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Register Candidate'}
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      <section className="panel jobs-panel">
        <div className="panel-heading">
          <div>
            <h3>Registered Candidates</h3>
            <p>Applicant records retrieved from your database.</p>
          </div>

          <button
            className="secondary-button"
            onClick={fetchPageData}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <p className="state-message">Loading candidates...</p>
        ) : candidates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">♙</div>
            <h3>No candidates found</h3>
            <p>Register a candidate to get started.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>FULL NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>JOB OPENING</th>
                </tr>
              </thead>

              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>#{candidate.id}</td>
                    <td>
                      <strong>{candidate.fullName ?? '—'}</strong>
                    </td>
                    <td>{candidate.email ?? '—'}</td>
                    <td>{candidate.phone ?? '—'}</td>
                    <td>
                      {candidate.job?.title ??
                        (candidate.job?.id
                          ? `Job #${candidate.job.id}`
                          : '—')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}


function ScreeningPage() {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [form, setForm] = useState({
    jobId: '1',
    jobTitle: '',
    jobDescription: '',
    requiredSkills: 'Python, Machine Learning, Ph.D., Teaching',
  });

  // Mode: 'single' or 'batch'
  const [uploadMode, setUploadMode] = useState('single');

  // Single resume state
  const [resumeFile, setResumeFile] = useState(null);
  const [screening, setScreening] = useState(false);
  const [singleResult, setSingleResult] = useState(null);

  // Batch ZIP state
  const [zipFile, setZipFile] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [candidatesQueue, setCandidatesQueue] = useState([]);
  const [activeBatchIndex, setActiveBatchIndex] = useState(null);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [registeringDb, setRegisteringDb] = useState(false);
  const [dbSuccessMsg, setDbSuccessMsg] = useState('');

  // Selected candidate result for detail view
  const [viewingResult, setViewingResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoadingJobs(true);
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setJobs(data);
        }
      } catch (e) {
        // Fallback silently if Java backend is down
      } finally {
        setLoadingJobs(false);
      }
    }
    loadJobs();
  }, []);

  function handleJobSelect(e) {
    const val = e.target.value;
    setSelectedJobId(val);
    if (!val || val === 'custom') return;
    const found = jobs.find((j) => String(j.id) === val);
    if (found) {
      setForm((prev) => ({
        ...prev,
        jobId: String(found.id),
        jobTitle: found.title || '',
        jobDescription: found.description || '',
      }));
    }
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // --- Single Upload Handler ---
  async function handleSingleScreenSubmit(e) {
    e.preventDefault();
    setError('');
    setSingleResult(null);

    if (!resumeFile) {
      setError('Please select a resume file (.pdf or .docx).');
      return;
    }
    if (!form.jobTitle.trim() || !form.jobDescription.trim()) {
      setError('Please provide both Job Title and Job Description.');
      return;
    }

    setScreening(true);
    try {
      const skillsArray = form.requiredSkills
        ? form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const formData = new FormData();
      formData.append('file', resumeFile);
      formData.append('job_id', form.jobId.trim() || '1');
      formData.append('job_title', form.jobTitle.trim());
      formData.append('job_description', form.jobDescription.trim());
      if (skillsArray.length > 0) {
        formData.append('required_skills', JSON.stringify(skillsArray));
      }

      const res = await fetch('/api/v1/screen-resume', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.detail || `Screening service error (HTTP ${res.status}).`);
      }

      const data = await res.json();
      setSingleResult(data);
      setViewingResult(data);
    } catch (err) {
      setError(err.message || 'Failed to screen resume.');
    } finally {
      setScreening(false);
    }
  }

  // --- Batch ZIP Extraction Handler ---
  async function handleZipUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setZipFile(file);
    setError('');
    setDbSuccessMsg('');
    setBatchLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/v1/screen-resume/upload-zip', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.detail || `Failed to extract ZIP (HTTP ${res.status}).`);
      }

      const data = await res.json();
      const loaded = (data.resumes || []).map((r) => ({
        ...r,
        screeningStatus: 'PENDING',
        result: null,
      }));
      setCandidatesQueue(loaded);
    } catch (err) {
      setError(err.message || 'Failed to process ZIP file.');
      setCandidatesQueue([]);
    } finally {
      setBatchLoading(false);
    }
  }

  // --- Screen Single Candidate from Queue ---
  async function screenCandidateInQueue(index) {
    const cand = candidatesQueue[index];
    if (!cand || !cand.text) return;

    if (!form.jobTitle.trim() || !form.jobDescription.trim()) {
      setError('Please provide Job Title and Description before screening.');
      return;
    }

    setCandidatesQueue((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], screeningStatus: 'PROCESSING' };
      return copy;
    });

    try {
      const skillsArray = form.requiredSkills
        ? form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const res = await fetch('/api/v1/screen-resume/screen-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: form.jobId.trim() || '1',
          job_title: form.jobTitle.trim(),
          job_description: form.jobDescription.trim(),
          required_skills: skillsArray,
          resume_text: cand.text,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.detail || 'Screening failed');
      }

      const screeningData = await res.json();
      setCandidatesQueue((prev) => {
        const copy = [...prev];
        copy[index] = {
          ...copy[index],
          screeningStatus: 'COMPLETED',
          candidateName: screeningData.profile?.name || copy[index].candidateName,
          result: screeningData,
        };
        return copy;
      });
    } catch (err) {
      setCandidatesQueue((prev) => {
        const copy = [...prev];
        copy[index] = {
          ...copy[index],
          screeningStatus: 'FAILED',
          errorMsg: err.message,
        };
        return copy;
      });
    }
  }

  // --- Run All Screenings in Batch ---
  async function runAllBatchScreenings() {
    if (candidatesQueue.length === 0) return;
    if (!form.jobTitle.trim() || !form.jobDescription.trim()) {
      setError('Please provide Job Title and Job Description before screening.');
      return;
    }

    setError('');
    setBatchProgress({ current: 0, total: candidatesQueue.length });

    for (let i = 0; i < candidatesQueue.length; i++) {
      if (candidatesQueue[i].screeningStatus === 'COMPLETED') continue;
      setActiveBatchIndex(i);
      setBatchProgress({ current: i + 1, total: candidatesQueue.length });
      await screenCandidateInQueue(i);
    }
    setActiveBatchIndex(null);
  }

  // --- Register Batch Candidates to Java Backend Database ---
  async function registerBatchCandidatesToDb() {
    if (candidatesQueue.length === 0) return;
    setRegisteringDb(true);
    setDbSuccessMsg('');
    setError('');

    let registeredCount = 0;
    try {
      for (const cand of candidatesQueue) {
        const candidateName = cand.candidateName || cand.fileName;
        const email = cand.result?.profile?.email || `${candidateName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@candidate.org`;

        // Register candidate in Java backend for this job
        const res = await fetch(`/api/candidates/jobs/${form.jobId || '1'}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: candidateName,
            email: email,
            phone: 'N/A',
          }),
        });

        if (res.ok) registeredCount++;
      }
      setDbSuccessMsg(`Successfully registered ${registeredCount} candidates to Job #${form.jobId || '1'} in the database!`);
    } catch (err) {
      setError('Could not connect to Java backend to persist candidates.');
    } finally {
      setRegisteringDb(false);
    }
  }

  return (
    <div className="page-content">
      <div className="welcome-section">
        <div>
          <p className="eyebrow">INTELLIGENT RECRUITMENT</p>
          <h1>AI Resume Screening</h1>
          <p className="muted">
            Evaluate individual resumes or process batch archives (.zip) against faculty job qualifications using autonomous AI agents.
          </p>
        </div>

        {/* Upload Mode Switcher */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={uploadMode === 'single' ? 'primary-button' : 'secondary-button'}
            onClick={() => setUploadMode('single')}
          >
            📄 Single Resume
          </button>
          <button
            type="button"
            className={uploadMode === 'batch' ? 'primary-button' : 'secondary-button'}
            onClick={() => setUploadMode('batch')}
          >
            📦 Batch Archive (.zip)
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Notice:</strong>
          <p>{error}</p>
        </div>
      )}

      {dbSuccessMsg && (
        <div style={{ padding: '14px 18px', background: '#e6f6ee', color: '#176f45', border: '1px solid #b7e8d0', borderRadius: '8px', marginBottom: '18px' }}>
          <strong>✓ {dbSuccessMsg}</strong>
        </div>
      )}

      {/* Shared Job Configuration Panel */}
      <section className="panel job-form-panel">
        <div style={{ marginBottom: '18px', borderBottom: '1px solid #edf0f5', paddingBottom: '12px' }}>
          <h3 style={{ margin: 0, color: '#182b49', fontSize: '15px' }}>1. Target Job Opening</h3>
          <p style={{ margin: '4px 0 0', color: '#74839a', fontSize: '12px' }}>Specify the faculty vacancy criteria for screening.</p>
        </div>

        <div className="form-field" style={{ marginBottom: '16px' }}>
          <label>Select Registered Job Opening (Optional)</label>
          <select value={selectedJobId} onChange={handleJobSelect} disabled={loadingJobs}>
            <option value="">— Select from registered jobs or enter manually below —</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                #{j.id}: {j.title} ({j.department || 'General'})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', marginBottom: '16px' }}>
          <div className="form-field">
            <label>Job ID *</label>
            <input
              type="text"
              name="jobId"
              placeholder="e.g. 1"
              value={form.jobId}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              placeholder="e.g. Assistant Professor of Computer Science"
              value={form.jobTitle}
              onChange={handleFormChange}
              required
            />
          </div>
        </div>

        <div className="form-field" style={{ marginBottom: '16px' }}>
          <label>Job Description & Minimum Qualifications *</label>
          <textarea
            name="jobDescription"
            placeholder="Paste role requirements, minimum degree criteria, research expectations, teaching requirements..."
            value={form.jobDescription}
            onChange={handleFormChange}
            rows={3}
            required
          />
        </div>

        <div className="form-field">
          <label>Required Skills & Credentials (Comma-separated)</label>
          <input
            type="text"
            name="requiredSkills"
            placeholder="e.g. Python, Machine Learning, Ph.D., Teaching"
            value={form.requiredSkills}
            onChange={handleFormChange}
          />
        </div>
      </section>

      {/* Mode A: Single Resume Upload Form */}
      {uploadMode === 'single' && (
        <section className="panel job-form-panel">
          <div style={{ marginBottom: '16px', borderBottom: '1px solid #edf0f5', paddingBottom: '12px' }}>
            <h3 style={{ margin: 0, color: '#182b49', fontSize: '15px' }}>2. Upload Candidate Resume</h3>
            <p style={{ margin: '4px 0 0', color: '#74839a', fontSize: '12px' }}>Select an individual PDF or DOCX file to screen.</p>
          </div>

          <form onSubmit={handleSingleScreenSubmit} className="job-form">
            <div className="form-field">
              <label>Resume File (.pdf or .docx) *</label>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setResumeFile(e.target.files && e.target.files[0])}
                required
              />
              {resumeFile && (
                <small style={{ color: '#2a4f82', marginTop: '4px' }}>
                  Selected: <strong>{resumeFile.name}</strong> ({(resumeFile.size / 1024).toFixed(1)} KB)
                </small>
              )}
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={screening}
                style={{ minWidth: '180px' }}
              >
                {screening ? 'Evaluating with AI Agents...' : '✧ Run AI Screening'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Mode B: Batch Archive (.zip) Upload & Queue */}
      {uploadMode === 'batch' && (
        <section className="panel job-form-panel">
          <div style={{ marginBottom: '16px', borderBottom: '1px solid #edf0f5', paddingBottom: '12px' }}>
            <h3 style={{ margin: 0, color: '#182b49', fontSize: '15px' }}>2. Upload Resume Archive (.zip)</h3>
            <p style={{ margin: '4px 0 0', color: '#74839a', fontSize: '12px' }}>
              Upload a single .zip file containing multiple faculty resumes. All resumes will be extracted into the candidate queue.
            </p>
          </div>

          <div className="form-field" style={{ marginBottom: '20px' }}>
            <label>Select ZIP Archive *</label>
            <input
              type="file"
              accept=".zip"
              onChange={handleZipUpload}
              disabled={batchLoading || activeBatchIndex !== null}
            />
            {batchLoading && <p style={{ color: '#2a4f82', margin: '6px 0 0', fontSize: '12px' }}>Unpacking and extracting resumes from archive...</p>}
          </div>

          {/* Candidates Queue Table */}
          {candidatesQueue.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#182b49' }}>
                    Extracted Candidate Queue ({candidatesQueue.length} Resumes)
                  </h4>
                  {activeBatchIndex !== null && (
                    <small style={{ color: '#2a4f82', fontWeight: 600 }}>
                      Processing {batchProgress.current} of {batchProgress.total}: {candidatesQueue[activeBatchIndex]?.candidateName}...
                    </small>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={registerBatchCandidatesToDb}
                    disabled={registeringDb || activeBatchIndex !== null}
                  >
                    {registeringDb ? 'Registering...' : '💾 Add All to Candidates List'}
                  </button>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={runAllBatchScreenings}
                    disabled={activeBatchIndex !== null}
                  >
                    {activeBatchIndex !== null ? 'Processing Batch...' : '▶ Run All Screenings'}
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>CANDIDATE NAME</th>
                      <th>FILE NAME</th>
                      <th>MATCH SCORE</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidatesQueue.map((item, idx) => (
                      <tr key={item.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <strong>{item.candidateName}</strong>
                        </td>
                        <td style={{ color: '#68778d' }}>{item.fileName}</td>
                        <td>
                          {item.result?.matchScore != null ? (
                            <span
                              className="skill-tag"
                              style={{
                                background: item.result.matchScore >= 80 ? '#e6f6ee' : item.result.matchScore >= 60 ? '#f0f5fc' : '#fff5f5',
                                color: item.result.matchScore >= 80 ? '#176f45' : item.result.matchScore >= 60 ? '#204a7a' : '#a82727',
                                fontWeight: 700,
                              }}
                            >
                              {Math.round(item.result.matchScore)}%
                            </span>
                          ) : (
                            <span style={{ color: '#a0aec0' }}>—</span>
                          )}
                        </td>
                        <td>
                          {item.screeningStatus === 'COMPLETED' ? (
                            <span style={{ color: '#176f45', fontWeight: 600 }}>✓ Evaluated</span>
                          ) : item.screeningStatus === 'PROCESSING' ? (
                            <span style={{ color: '#2b5a94', fontWeight: 600 }}>⏳ Analyzing...</span>
                          ) : item.screeningStatus === 'FAILED' ? (
                            <span style={{ color: '#a82727', fontWeight: 600 }}>✗ Failed</span>
                          ) : (
                            <span style={{ color: '#718096' }}>Pending</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() => screenCandidateInQueue(idx)}
                              disabled={item.screeningStatus === 'PROCESSING' || activeBatchIndex !== null}
                              style={{ padding: '6px 10px', fontSize: '11px' }}
                            >
                              {item.screeningStatus === 'COMPLETED' ? 'Re-Screen' : 'Screen'}
                            </button>

                            {item.result && (
                              <button
                                type="button"
                                className="primary-button"
                                onClick={() => setViewingResult(item.result)}
                                style={{ padding: '6px 10px', fontSize: '11px' }}
                              >
                                View Details
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Detailed Screening Result View */}
      {viewingResult && (
        <section className="screening-results-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#1e3a63' }}>Assessment Breakdown</h3>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setViewingResult(null)}
              style={{ fontSize: '11px' }}
            >
              ✕ Close Breakdown
            </button>
          </div>

          {/* Match Score Banner */}
          <div className="score-banner">
            <div className="score-banner-left">
              <h2>Screening Assessment: {viewingResult.status || 'COMPLETED'}</h2>
              <p>Job Reference: <strong>#{viewingResult.jobId}</strong></p>
              {viewingResult.profile?.name && (
                <p style={{ marginTop: '4px' }}>
                  Candidate: <strong>{viewingResult.profile.name}</strong> {viewingResult.profile.email ? `(${viewingResult.profile.email})` : ''}
                </p>
              )}
            </div>
            <div className="score-circle">
              {viewingResult.matchScore != null ? Math.round(viewingResult.matchScore) : 'N/A'}
              <span>MATCH SCORE</span>
            </div>
          </div>

          {/* AI Explanation Panel */}
          {viewingResult.explanation && (
            <div className="panel">
              <h3 style={{ margin: '0 0 10px', color: '#1e3a63' }}>Executive Rationale & Assessment</h3>
              <p style={{ margin: 0, lineHeight: 1.7, color: '#3b506f' }}>{viewingResult.explanation}</p>
            </div>
          )}

          {/* Skills Breakdown */}
          <div className="panel">
            <h3 style={{ margin: '0 0 12px', color: '#1e3a63' }}>Skills & Qualifications Match</h3>
            <div style={{ marginBottom: '14px' }}>
              <strong style={{ fontSize: '12px', color: '#176f45' }}>✓ Matched Skills:</strong>
              <div className="skills-tags-container">
                {viewingResult.matchedSkills && viewingResult.matchedSkills.length > 0 ? (
                  viewingResult.matchedSkills.map((skill, idx) => (
                    <span key={idx} className="skill-tag matched">✓ {skill}</span>
                  ))
                ) : (
                  <span style={{ color: '#888', fontSize: '12px' }}>None identified</span>
                )}
              </div>
            </div>

            <div>
              <strong style={{ fontSize: '12px', color: '#a82727' }}>✗ Missing Required Skills:</strong>
              <div className="skills-tags-container">
                {viewingResult.missingSkills && viewingResult.missingSkills.length > 0 ? (
                  viewingResult.missingSkills.map((skill, idx) => (
                    <span key={idx} className="skill-tag missing">✗ {skill}</span>
                  ))
                ) : (
                  <span style={{ color: '#888', fontSize: '12px' }}>All required skills matched!</span>
                )}
              </div>
            </div>
          </div>

          {/* Candidate Profile */}
          {viewingResult.profile && (
            <div className="panel">
              <h3 style={{ margin: '0 0 14px', color: '#1e3a63' }}>Candidate Profile (Extracted from Resume)</h3>
              <div className="profile-grid">
                {viewingResult.profile.education && viewingResult.profile.education.length > 0 && (
                  <div className="profile-card">
                    <h4>🎓 Education</h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', color: '#4a5d78', fontSize: '12px', lineHeight: 1.6 }}>
                      {viewingResult.profile.education.map((edu, i) => (
                        <li key={i}>
                          <strong>{edu.degree || 'Degree'}</strong> in {edu.field || 'N/A'}{' '}
                          {edu.institution ? `(${edu.institution})` : ''} {edu.year ? `— ${edu.year}` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {viewingResult.profile.experience && viewingResult.profile.experience.length > 0 && (
                  <div className="profile-card">
                    <h4>💼 Experience</h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', color: '#4a5d78', fontSize: '12px', lineHeight: 1.6 }}>
                      {viewingResult.profile.experience.map((exp, i) => (
                        <li key={i}>
                          <strong>{exp.role || 'Role'}</strong> at {exp.organization || 'Organization'}{' '}
                          {exp.duration ? `(${exp.duration})` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Evidence Citations */}
          {viewingResult.evidence && viewingResult.evidence.length > 0 && (
            <div className="panel">
              <h3 style={{ margin: '0 0 10px', color: '#1e3a63' }}>Evidence & Resume Citations</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="evidence-table">
                  <thead>
                    <tr>
                      <th style={{ width: '25%' }}>Criterion</th>
                      <th style={{ width: '40%' }}>Resume Evidence</th>
                      <th style={{ width: '35%' }}>AI Assessment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingResult.evidence.map((ev, i) => (
                      <tr key={i}>
                        <td><strong>{ev.criterion}</strong></td>
                        <td><span className="evidence-quote">"{ev.resumeEvidence}"</span></td>
                        <td>{ev.assessment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const pageTitles = {
    dashboard: 'Dashboard',
    jobs: 'Jobs',
    candidates: 'Candidates',
    screening: 'AI Screening',
  };

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{pageTitles[activePage]}</strong>
          </div>
          <div className="topbar-right">
            <span className="connection-indicator">
              <span className="connection-dot" />
              Recruitment Portal
            </span>
            <div className="topbar-avatar">HR</div>
          </div>
        </header>

        {activePage === 'dashboard' && (
          <Dashboard onNavigate={setActivePage} />
        )}

        {activePage === 'jobs' && <JobsPage />}

       {activePage === 'candidates' && <CandidatesPage />}

      {activePage === 'screening' && (
        <ScreeningPage />
      )}

        <footer className="app-footer">
          FacultyHire · AI-assisted faculty recruitment
          <span>Final recruitment decisions remain with human reviewers.</span>
        </footer>
      </main>
    </div>
  );
}
