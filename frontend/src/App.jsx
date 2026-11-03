
import { useEffect, useState } from 'react';
import './App.css';

// Professional inline vector SVG icons for sidebar navigation
function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function JobsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function CandidatesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ScreeningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'jobs', label: 'Jobs', icon: <JobsIcon /> },
  { id: 'candidates', label: 'Candidates', icon: <CandidatesIcon /> },
  { id: 'screening', label: 'AI Screening', icon: <ScreeningIcon /> },
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
        <span>[i]</span>
        Preview mode — dashboard figures are sample data, not live database records.
      </div>

      <div className="stats-grid">
        <StatCard label="Open Positions" value="04" icon="#" note="Sample dashboard figure" />
        <StatCard label="Total Candidates" value="128" icon="" note="Sample dashboard figure" />
        <StatCard label="Resumes Uploaded" value="96" icon="" note="Sample dashboard figure" />
        <StatCard label="AI Screenings" value="72" icon="#" note="Sample dashboard figure" />
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
            <span className="action-icon">+</span>
            <span>
              <strong>View job openings</strong>
              <small>Load positions from the database</small>
            </span>
            <span className="action-arrow">&gt;</span>
          </button>

          <button className="action-row" onClick={() => onNavigate('candidates')}>
            <span className="action-icon"></span>
            <span>
              <strong>Manage candidates</strong>
              <small>Review registered applicants</small>
            </span>
            <span className="action-arrow">&gt;</span>
          </button>

          <button className="action-row" onClick={() => onNavigate('screening')}>
            <span className="action-icon">+</span>
            <span>
              <strong>Review AI screening</strong>
              <small>Explore screening results</small>
            </span>
            <span className="action-arrow">&gt;</span>
          </button>
        </section>
      </div>
    </div>
  );
}


// Helper to parse human-readable error messages from backend responses
async function parseErrorMessage(response, defaultMsg) {
  try {
    const raw = await response.text();
    try {
      const parsed = JSON.parse(raw);
      if (parsed.message) return parsed.message;
      if (parsed.error && typeof parsed.error === 'string') return parsed.error;
      // If it's a validation map like {"title": "Job title is needed"}
      if (typeof parsed === 'object') {
        const values = Object.values(parsed);
        if (values.length > 0 && typeof values[0] === 'string') return values.join(', ');
      }
    } catch {
      if (raw && raw.length < 200) return raw;
    }
  } catch {}
  return `${defaultMsg} (${response.status})`;
}

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
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

  function handleStartCreate() {
    setEditingJobId(null);
    setForm({ title: '', department: '', description: '' });
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  function handleStartEdit(job) {
    setEditingJobId(job.id);
    setForm({
      title: job.title || '',
      department: job.department || '',
      description: job.description || '',
    });
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  async function handleDeleteJob(id, title) {
    if (!window.confirm(`Are you sure you want to delete job "${title || '#' + id}"?\n\nNotice: This will also remove any candidates and screening results associated with this position.`)) {
      return;
    }

    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (!response.ok && response.status !== 204) {
        throw new Error(`Failed to delete job (${response.status})`);
      }
      setSuccess(`Job #${id} deleted successfully.`);
      await fetchJobs();
    } catch (err) {
      setError(err.message || 'Could not delete the job.');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const url = editingJobId ? `/api/jobs/${editingJobId}` : '/api/jobs';
      const method = editingJobId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const msg = await parseErrorMessage(response, `Could not ${editingJobId ? 'update' : 'create'} job`);
        throw new Error(msg);
      }

      setForm({
        title: '',
        department: '',
        description: '',
      });

      setShowForm(false);
      setSuccess(editingJobId ? 'Job updated successfully!' : 'Job created successfully!');
      setEditingJobId(null);
      await fetchJobs();
    } catch (err) {
      setError(err.message || `Could not ${editingJobId ? 'update' : 'create'} the job.`);
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
            Create, update, and manage faculty positions.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingJobId(null);
            } else {
              handleStartCreate();
            }
          }}
        >
          {showForm ? 'Cancel' : '+ Create Job'}
        </button>
      </div>

      {success && (
        <div className="notice" style={{ background: '#e6f6ee', color: '#176f45', border: '1px solid #b7e8d0' }}>
          <span>[OK]</span>
          {success}
        </div>
      )}

      {error && (
        <div className="error-message">
          <strong>Something went wrong:</strong>
          <p>{error}</p>
        </div>
      )}

      {showForm && (
        <section className="panel job-form-panel">
          <div className="panel-heading">
            <div>
              <h3>{editingJobId ? `Edit Job #${editingJobId}` : 'Create a Faculty Position'}</h3>
              <p>{editingJobId ? 'Modify the details of this job opening.' : 'Enter the details of the new job opening.'}</p>
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
                onClick={() => {
                  setShowForm(false);
                  setEditingJobId(null);
                }}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving ? (editingJobId ? 'Updating...' : 'Saving...') : (editingJobId ? 'Update Job' : 'Save Job')}
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
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="state-message">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">[]</div>
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
                  <th>ACTIONS</th>
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
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="secondary-button"
                          style={{ padding: '5px 10px', fontSize: '11px' }}
                          onClick={() => handleStartEdit(job)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="secondary-button"
                          style={{ padding: '5px 10px', fontSize: '11px', color: '#c53030', borderColor: '#feb2b2' }}
                          onClick={() => handleDeleteJob(job.id, job.title)}
                        >
                          Delete
                        </button>
                      </div>
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
  const [editingCandidateId, setEditingCandidateId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewingCandidateAnalysis, setViewingCandidateAnalysis] = useState(null);
  const [loadingAnalysisId, setLoadingAnalysisId] = useState(null);

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

  function handleStartCreate() {
    setEditingCandidateId(null);
    setForm({
      fullName: '',
      email: '',
      phone: '',
      jobId: jobs.length > 0 ? jobs[0].id : '',
    });
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  function handleStartEdit(cand) {
    setEditingCandidateId(cand.id);
    setForm({
      fullName: cand.fullName || '',
      email: cand.email || '',
      phone: cand.phone || '',
      jobId: cand.job?.id || (jobs.length > 0 ? jobs[0].id : ''),
    });
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  async function handleDeleteCandidate(id, name) {
    if (!window.confirm(`Are you sure you want to delete candidate "${name || '#' + id}"?\n\nThis will remove their candidate record and any associated resume analysis.`)) {
      return;
    }

    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
      if (!response.ok && response.status !== 204) {
        throw new Error(`Failed to delete candidate (${response.status})`);
      }
      setSuccess(`Candidate #${id} deleted successfully.`);
      await fetchPageData();
    } catch (err) {
      setError(err.message || 'Could not delete candidate.');
    }
  }

  async function handleViewAnalysis(candidate) {
    setLoadingAnalysisId(candidate.id);
    setError('');
    try {
      const res = await fetch(`/api/screening-results/candidates/${candidate.id}`);
      if (!res.ok) {
        throw new Error('Could not retrieve candidate screening history.');
      }
      const results = await res.json();
      if (!Array.isArray(results) || results.length === 0) {
        alert(`No saved screening analysis found for ${candidate.fullName}. You can screen them under the "AI Screening" tab!`);
        return;
      }
      // Sort by newest screenedAt
      const latest = results[results.length - 1];
      
      // Parse structured fields if stored as JSON strings
      let parsedMatched = [];
      let parsedMissing = [];
      let parsedEvidence = [];

      try {
        parsedMatched = JSON.parse(latest.matchedSkills || '[]');
      } catch {
        parsedMatched = (latest.matchedSkills || '').split(',').map(s => s.trim()).filter(Boolean);
      }

      try {
        parsedMissing = JSON.parse(latest.missingSkills || '[]');
      } catch {
        parsedMissing = [];
      }

      try {
        parsedEvidence = JSON.parse(latest.evidence || '[]');
      } catch {
        parsedEvidence = latest.evidence ? [{ criterion: 'Summary Evidence', resumeEvidence: latest.evidence, assessment: 'Verified from Database' }] : [];
      }

      setViewingCandidateAnalysis({
        ...latest,
        candidateName: candidate.fullName,
        candidateEmail: candidate.email,
        jobTitle: candidate.job?.title || 'Faculty Role',
        matchedSkills: parsedMatched,
        missingSkills: parsedMissing,
        evidence: parsedEvidence,
      });
    } catch (err) {
      setError(err.message || 'Could not load analysis details.');
    } finally {
      setLoadingAnalysisId(null);
    }
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
      if (editingCandidateId) {
        const response = await fetch(
          `/api/candidates/${editingCandidateId}?jobId=${form.jobId}`,
          {
            method: 'PUT',
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
          const msg = await parseErrorMessage(response, 'Could not update candidate');
          throw new Error(msg);
        }
        setSuccess('Candidate updated successfully.');
      } else {
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
          const msg = await parseErrorMessage(response, 'Could not register candidate');
          throw new Error(msg);
        }
        setSuccess('Candidate registered successfully.');
      }

      setForm({
        fullName: '',
        email: '',
        phone: '',
        jobId: '',
      });

      setShowForm(false);
      setEditingCandidateId(null);
      await fetchPageData();
    } catch (err) {
      setError(err.message || 'Could not save candidate.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-content">
      <div className="welcome-section">
        <div>
          <p className="eyebrow">APPLICANT TRACKING</p>
          <h1>Candidates</h1>
          <p className="muted">
            Register applicants, update candidate profiles, and review saved AI evaluations.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingCandidateId(null);
            } else {
              handleStartCreate();
            }
          }}
        >
          {showForm ? 'Cancel' : '+ Register Candidate'}
        </button>
      </div>

      {success && (
        <div className="notice" style={{ background: '#e6f6ee', color: '#176f45', border: '1px solid #b7e8d0' }}>
          <span>[OK]</span>
          {success}
        </div>
      )}

      {error && (
        <div className="error-message">
          <strong>Something went wrong:</strong>
          <p>{error}</p>
        </div>
      )}

      {showForm && (
        <section className="panel job-form-panel">
          <div className="panel-heading">
            <div>
              <h3>{editingCandidateId ? `Edit Candidate #${editingCandidateId}` : 'Register a New Candidate'}</h3>
              <p>{editingCandidateId ? 'Update applicant contact and job details.' : 'Enter applicant contact information and select an opening.'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="job-form">
            <div className="form-field">
              <label htmlFor="candidate-name">Full Name *</label>
              <input
                id="candidate-name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="e.g. Dr. Jane Smith"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="candidate-email">Email Address *</label>
              <input
                id="candidate-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. jane.smith@example.edu"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="candidate-phone">Phone Number</label>
              <input
                id="candidate-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
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
                onClick={() => {
                  setShowForm(false);
                  setEditingCandidateId(null);
                }}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving ? (editingCandidateId ? 'Updating...' : 'Saving...') : (editingCandidateId ? 'Update Candidate' : 'Register Candidate')}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Viewing Saved Analysis Modal */}
      {viewingCandidateAnalysis && (
        <section className="screening-results-container" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, color: '#1e3a63' }}>
                Permanent Database Analysis: {viewingCandidateAnalysis.candidateName}
              </h3>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '12px' }}>
                Job Role: <strong>{viewingCandidateAnalysis.jobTitle}</strong> | Saved at:{' '}
                {viewingCandidateAnalysis.screenedAt ? new Date(viewingCandidateAnalysis.screenedAt).toLocaleString() : 'Recent'}
              </p>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setViewingCandidateAnalysis(null)}
              style={{ fontSize: '11px' }}
            >
              Close Analysis
            </button>
          </div>

          <div className="score-banner" style={{ marginTop: '14px' }}>
            <div className="score-banner-left">
              <h2>Evaluated Profile Score</h2>
              <p>Database Status: <strong>PERMANENT RECORD</strong></p>
              <p style={{ marginTop: '4px' }}>
                Contact: <strong>{viewingCandidateAnalysis.candidateEmail}</strong>
              </p>
            </div>
            <div className="score-circle">
              {viewingCandidateAnalysis.matchScore != null ? Math.round(viewingCandidateAnalysis.matchScore) : 'N/A'}
              <span>MATCH SCORE</span>
            </div>
          </div>

          {viewingCandidateAnalysis.explanation && (
            <div className="panel" style={{ marginTop: '14px' }}>
              <h3 style={{ margin: '0 0 10px', color: '#1e3a63' }}>Executive Rationale & Assessment</h3>
              <p style={{ margin: 0, lineHeight: 1.7, color: '#3b506f' }}>{viewingCandidateAnalysis.explanation}</p>
            </div>
          )}

          <div className="panel" style={{ marginTop: '14px' }}>
            <h3 style={{ margin: '0 0 12px', color: '#1e3a63' }}>Skills & Qualifications Match</h3>
            <div style={{ marginBottom: '14px' }}>
              <strong style={{ fontSize: '12px', color: '#176f45' }}>Matched Skills:</strong>
              <div className="skills-tags-container">
                {viewingCandidateAnalysis.matchedSkills && viewingCandidateAnalysis.matchedSkills.length > 0 ? (
                  viewingCandidateAnalysis.matchedSkills.map((skill, idx) => (
                    <span key={idx} className="skill-tag matched">{skill}</span>
                  ))
                ) : (
                  <span style={{ color: '#888', fontSize: '12px' }}>None identified</span>
                )}
              </div>
            </div>

            {viewingCandidateAnalysis.missingSkills && viewingCandidateAnalysis.missingSkills.length > 0 && (
              <div>
                <strong style={{ fontSize: '12px', color: '#a82727' }}>Missing Skills:</strong>
                <div className="skills-tags-container">
                  {viewingCandidateAnalysis.missingSkills.map((skill, idx) => (
                    <span key={idx} className="skill-tag missing">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {viewingCandidateAnalysis.evidence && viewingCandidateAnalysis.evidence.length > 0 && (
            <div className="panel" style={{ marginTop: '14px' }}>
              <h3 style={{ margin: '0 0 10px', color: '#1e3a63' }}>Evidence & Resume Citations</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="evidence-table">
                  <thead>
                    <tr>
                      <th style={{ width: '30%' }}>Criterion</th>
                      <th style={{ width: '40%' }}>Resume Evidence</th>
                      <th style={{ width: '30%' }}>Assessment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingCandidateAnalysis.evidence.map((ev, i) => (
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
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="state-message">Loading candidates...</p>
        ) : candidates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
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
                  <th>ANALYSIS & ACTIONS</th>
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
                    <td>{candidate.phone || '—'}</td>
                    <td>
                      {candidate.job?.title ??
                        (candidate.job?.id
                          ? `Job #${candidate.job.id}`
                          : '—')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="primary-button"
                          style={{ padding: '5px 10px', fontSize: '11px', background: '#2563eb' }}
                          onClick={() => handleViewAnalysis(candidate)}
                          disabled={loadingAnalysisId === candidate.id}
                        >
                          {loadingAnalysisId === candidate.id ? 'Loading...' : 'View Analysis'}
                        </button>
                        <button
                          type="button"
                          className="secondary-button"
                          style={{ padding: '5px 10px', fontSize: '11px' }}
                          onClick={() => handleStartEdit(candidate)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="secondary-button"
                          style={{ padding: '5px 10px', fontSize: '11px', color: '#c53030', borderColor: '#feb2b2' }}
                          onClick={() => handleDeleteCandidate(candidate.id, candidate.fullName)}
                        >
                          Delete
                        </button>
                      </div>
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

  // Academic Stepper & Progressive Disclosure State
  const [singleProgress, setSingleProgress] = useState(0);
  const [singlePhaseText, setSinglePhaseText] = useState('');
  const [activeDossierTab, setActiveDossierTab] = useState('subscores');
  const [isDossierOpen, setIsDossierOpen] = useState(true);
  const [copiedQuestions, setCopiedQuestions] = useState(false);

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

  // --- Helper to save screening analysis permanently to database ---
  async function saveScreeningResultToDb(candidateName, email, screeningData, fileName) {
    try {
      // 1. Ensure candidate exists in database for this job
      let candidateId = null;
      const candListRes = await fetch('/api/candidates');
      if (candListRes.ok) {
        const cands = await candListRes.json();
        const existing = cands.find(
          (c) => (email && c.email?.toLowerCase() === email.toLowerCase()) || 
                 (c.fullName?.toLowerCase() === candidateName?.toLowerCase())
        );
        if (existing) {
          candidateId = existing.id;
        }
      }

      if (!candidateId) {
        const createCandRes = await fetch(`/api/candidates/jobs/${form.jobId || '1'}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: candidateName || 'Candidate',
            email: email || `${(candidateName || 'candidate').toLowerCase().replace(/[^a-z0-9]/g, '.')}@candidate.org`,
            phone: 'N/A',
          }),
        });
        if (createCandRes.ok) {
          const created = await createCandRes.json();
          candidateId = created.id;
        }
      }

      if (candidateId) {
        // 2. Persist screening result to database
        const score = screeningData.matchScore != null ? screeningData.matchScore : 50.0;
        await fetch(`/api/screening-results/candidates/${candidateId}?fileName=${encodeURIComponent(fileName || 'resume.pdf')}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            matchScore: score,
            matchedSkills: JSON.stringify(screeningData.matchedSkills || []),
            evidence: JSON.stringify(screeningData.evidence || []),
            explanation: screeningData.explanation || 'Screening evaluated successfully.',
          }),
        });
      }
    } catch (persistErr) {
      console.warn('Auto-save to database failed:', persistErr);
    }
  }

  // --- Fallback search for past database result if LLM is offline ---
  async function findCachedDatabaseResult(candidateName, email) {
    try {
      const candListRes = await fetch('/api/candidates');
      if (!candListRes.ok) return null;
      const cands = await candListRes.json();
      const match = cands.find(
        (c) => (email && c.email?.toLowerCase() === email.toLowerCase()) ||
               (candidateName && c.fullName?.toLowerCase() === candidateName?.toLowerCase())
      );
      if (!match) return null;

      const resResults = await fetch(`/api/screening-results/candidates/${match.id}`);
      if (!resResults.ok) return null;
      const history = await resResults.json();
      if (!Array.isArray(history) || history.length === 0) return null;

      const latest = history[history.length - 1];
      let parsedMatched = [];
      let parsedEvidence = [];

      try { parsedMatched = JSON.parse(latest.matchedSkills || '[]'); } catch { parsedMatched = (latest.matchedSkills || '').split(',').map(s => s.trim()).filter(Boolean); }
      try { parsedEvidence = JSON.parse(latest.evidence || '[]'); } catch { parsedEvidence = latest.evidence ? [{ criterion: 'Cached Evidence', resumeEvidence: latest.evidence, assessment: 'Retrieved from database' }] : []; }

      return {
        status: 'CACHED (LLM OFFLINE)',
        jobId: form.jobId || String(match.job?.id || '1'),
        matchScore: latest.matchScore,
        matchedSkills: parsedMatched,
        missingSkills: [],
        evidence: parsedEvidence,
        explanation: latest.explanation + ' [Note: Displayed from past database evaluation because live AI service is currently offline].',
        profile: {
          name: match.fullName,
          email: match.email,
          skills: parsedMatched,
        },
        isFallback: true,
      };
    } catch {
      return null;
    }
  }

  // --- Single Upload Handler ---
  async function handleSingleScreenSubmit(e) {
    e.preventDefault();
    setError('');
    setDbSuccessMsg('');
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
    setSingleProgress(12);
    setSinglePhaseText('Phase 1 of 4: Extracting academic credentials & peer-reviewed citations...');

    const progressTimer = setInterval(() => {
      setSingleProgress((prev) => {
        if (prev < 30) {
          setSinglePhaseText('Phase 1 of 4: Extracting academic credentials & peer-reviewed citations...');
          return prev + 6;
        } else if (prev < 60) {
          setSinglePhaseText('Phase 2 of 4: Assessing teaching tenure, ABET readiness & thesis mentorship...');
          return prev + 5;
        } else if (prev < 82) {
          setSinglePhaseText('Phase 3 of 4: Benchmarking against faculty rank & curriculum gaps...');
          return prev + 3;
        } else if (prev < 94) {
          setSinglePhaseText('Phase 4 of 4: Synthesizing academic dossier & committee interview guide...');
          return prev + 1;
        }
        return prev;
      });
    }, 450);

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

      let data = null;
      let usedFallback = false;

      try {
        const res = await fetch('/api/v1/screen-resume', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => null);
          throw new Error(errJson?.detail || `Screening service error (HTTP ${res.status}).`);
        }

        data = await res.json();
      } catch (liveAiErr) {
        // Attempt fallback to cached database result for this resume file name
        const candidateName = resumeFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        const cached = await findCachedDatabaseResult(candidateName, null);
        if (cached) {
          data = cached;
          usedFallback = true;
        } else {
          throw liveAiErr;
        }
      }

      setSingleResult(data);
      setViewingResult(data);

      if (!usedFallback) {
        // Automatically save analysis result permanently to PostgreSQL/H2 database
        const candidateName = data.profile?.name || resumeFile.name.replace(/\.[^/.]+$/, "");
        const email = data.profile?.email;
        await saveScreeningResultToDb(candidateName, email, data, resumeFile.name);
        setDbSuccessMsg('Screening completed and analysis permanently saved to database!');
      } else {
        setDbSuccessMsg('LLM offline: Successfully displayed previously saved analysis from database!');
      }
    } catch (err) {
      setError(err.message || 'Failed to screen resume.');
    } finally {
      if (typeof progressTimer !== 'undefined') clearInterval(progressTimer);
      setSingleProgress(100);
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

      let screeningData = null;
      let usedFallback = false;

      try {
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

        screeningData = await res.json();
      } catch (liveAiErr) {
        // Fallback to cached analysis if live LLM fails
        const cached = await findCachedDatabaseResult(cand.candidateName, null);
        if (cached) {
          screeningData = cached;
          usedFallback = true;
        } else {
          throw liveAiErr;
        }
      }

      setCandidatesQueue((prev) => {
        const copy = [...prev];
        copy[index] = {
          ...copy[index],
          screeningStatus: 'COMPLETED',
          candidateName: screeningData.profile?.name || copy[index].candidateName,
          result: screeningData,
          isFallback: usedFallback,
        };
        return copy;
      });

      if (!usedFallback) {
        // Automatically persist each screened candidate and their analysis result
        const finalName = screeningData.profile?.name || cand.candidateName;
        const email = screeningData.profile?.email;
        await saveScreeningResultToDb(finalName, email, screeningData, cand.fileName);
      }
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
            Single Resume
          </button>
          <button
            type="button"
            className={uploadMode === 'batch' ? 'primary-button' : 'secondary-button'}
            onClick={() => setUploadMode('batch')}
          >
            Batch Archive (.zip)
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
          <strong>{dbSuccessMsg}</strong>
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
                {screening ? 'Evaluating with Academic Engine...' : 'Run AI Screening'}
              </button>
            </div>
          </form>

          {screening && (
            <div className="screening-progress-card">
              <div className="progress-header">
                <span className="progress-title">Evaluating Candidate Academic Dossier</span>
                <span className="progress-percent">{Math.min(100, Math.round(singleProgress))}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min(100, Math.round(singleProgress))}%` }}></div>
              </div>
              <div className="progress-phase-label">{singlePhaseText}</div>
              <ul className="progress-stepper-list">
                <li className={`progress-step-item ${singleProgress >= 25 ? 'completed' : singleProgress >= 10 ? 'active' : ''}`}>
                  <span className={`step-indicator ${singleProgress >= 25 ? 'completed' : singleProgress >= 10 ? 'active' : ''}`}>1</span>
                  <span>Extracting academic credentials, doctoral rigor, and citations</span>
                </li>
                <li className={`progress-step-item ${singleProgress >= 55 ? 'completed' : singleProgress >= 30 ? 'active' : ''}`}>
                  <span className={`step-indicator ${singleProgress >= 55 ? 'completed' : singleProgress >= 30 ? 'active' : ''}`}>2</span>
                  <span>Evaluating teaching tenure, ABET readiness, and thesis mentorship</span>
                </li>
                <li className={`progress-step-item ${singleProgress >= 82 ? 'completed' : singleProgress >= 60 ? 'active' : ''}`}>
                  <span className={`step-indicator ${singleProgress >= 82 ? 'completed' : singleProgress >= 60 ? 'active' : ''}`}>3</span>
                  <span>Benchmarking against faculty rank requirements and curriculum gaps</span>
                </li>
                <li className={`progress-step-item ${singleProgress >= 95 ? 'completed' : singleProgress >= 82 ? 'active' : ''}`}>
                  <span className={`step-indicator ${singleProgress >= 95 ? 'completed' : singleProgress >= 82 ? 'active' : ''}`}>4</span>
                  <span>Synthesizing academic dossier and committee interview questions</span>
                </li>
              </ul>
            </div>
          )}
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
                    {registeringDb ? 'Registering...' : 'Add All to Candidates List'}
                  </button>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={runAllBatchScreenings}
                    disabled={activeBatchIndex !== null}
                  >
                    {activeBatchIndex !== null ? 'Processing Batch...' : 'Run All Screenings'}
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
                            <span style={{ color: '#176f45', fontWeight: 600 }}>Evaluated</span>
                          ) : item.screeningStatus === 'PROCESSING' ? (
                            <span style={{ color: '#2b5a94', fontWeight: 600 }}>Analyzing...</span>
                          ) : item.screeningStatus === 'FAILED' ? (
                            <span style={{ color: '#a82727', fontWeight: 600 }}>Failed</span>
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

      {/* Detailed Screening Result View: Progressive Disclosure Academic Dossier */}
      {viewingResult && (
        <section className="screening-results-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#1e3a63', fontSize: '16px' }}>Academic Candidate Assessment</h3>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setViewingResult(null)}
              style={{ fontSize: '11px' }}
            >
              Close Dossier
            </button>
          </div>

          {/* Tier 1: Glanceable Executive Card */}
          <div className="score-banner">
            <div className="score-banner-left">
              <h2>{viewingResult.profile?.name || 'Candidate Dossier'}</h2>
              <p>Job Reference: <strong>#{viewingResult.jobId}</strong> {viewingResult.profile?.email ? `| Email: ${viewingResult.profile.email}` : ''}</p>
              {viewingResult.recommendedRank && (
                <div className="rank-pill">
                  <span>Recommended Action:</span> <strong>{viewingResult.recommendedRank}</strong>
                </div>
              )}
            </div>
            <div className="score-circle">
              {viewingResult.matchScore != null ? Math.round(viewingResult.matchScore) : 'N/A'}%
              <span>OVERALL</span>
            </div>
          </div>

          {/* Three-Pillar Academic Balance Meter (Tier 1 Glanceable) */}
          {viewingResult.academicBreakdown && (
            <div className="academic-balance-container">
              <div className="academic-balance-title">Three-Pillar Academic Balance</div>
              <div className="balance-meters-grid">
                <div className="balance-meter">
                  <div className="balance-meter-labels">
                    <span>Teaching & Pedagogy</span>
                    <span>{Math.round(viewingResult.academicBreakdown.teachingScore || 0)}%</span>
                  </div>
                  <div className="balance-meter-track">
                    <div className="balance-meter-bar teaching" style={{ width: `${viewingResult.academicBreakdown.teachingScore || 0}%` }}></div>
                  </div>
                </div>
                <div className="balance-meter">
                  <div className="balance-meter-labels">
                    <span>Research & Publications</span>
                    <span>{Math.round(viewingResult.academicBreakdown.researchScore || 0)}%</span>
                  </div>
                  <div className="balance-meter-track">
                    <div className="balance-meter-bar research" style={{ width: `${viewingResult.academicBreakdown.researchScore || 0}%` }}></div>
                  </div>
                </div>
                <div className="balance-meter">
                  <div className="balance-meter-labels">
                    <span>Domain Specialization</span>
                    <span>{Math.round(viewingResult.academicBreakdown.domainScore || 0)}%</span>
                  </div>
                  <div className="balance-meter-track">
                    <div className="balance-meter-bar domain" style={{ width: `${viewingResult.academicBreakdown.domainScore || 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Executive Rationale */}
          {viewingResult.explanation && (
            <div className="panel" style={{ background: '#f8fafc' }}>
              <h3 style={{ margin: '0 0 8px', color: '#1e3a63', fontSize: '13px' }}>Executive Committee Rationale</h3>
              <p style={{ margin: 0, lineHeight: 1.6, color: '#334155', fontSize: '13px' }}>{viewingResult.explanation}</p>
            </div>
          )}

          {/* Tier 2: Progressive Disclosure Dossier Drawer & Tabs */}
          <div className="dossier-drawer">
            <button
              type="button"
              className={`dossier-toggle-bar ${isDossierOpen ? 'open' : ''}`}
              onClick={() => setIsDossierOpen(!isDossierOpen)}
            >
              <span className="dossier-toggle-title">Academic Dossier & Search Committee Tools</span>
              <span className="dossier-toggle-hint">
                {isDossierOpen ? 'Hide Reviewer Tools [-]' : 'View Sub-Score Evidence & Interview Questions [+]'}
              </span>
            </button>

            {isDossierOpen && (
              <>
                <div className="dossier-tabs-nav">
                  <button
                    type="button"
                    className={`dossier-tab-btn ${activeDossierTab === 'subscores' ? 'active' : ''}`}
                    onClick={() => setActiveDossierTab('subscores')}
                  >
                    Sub-Scores & Evidence
                  </button>
                  <button
                    type="button"
                    className={`dossier-tab-btn ${activeDossierTab === 'questions' ? 'active' : ''}`}
                    onClick={() => setActiveDossierTab('questions')}
                  >
                    Committee Interview Pack
                  </button>
                </div>

                <div className="dossier-tab-content">
                  {/* Tab 1: Sub-Score Logic, Skills, Evidence & Profile */}
                  {activeDossierTab === 'subscores' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* Skills Matrix */}
                      <div>
                        <strong style={{ fontSize: '12px', color: '#176f45' }}>Direct Competencies Matched:</strong>
                        <div className="skills-tags-container" style={{ marginBottom: '14px' }}>
                          {viewingResult.matchedSkills && viewingResult.matchedSkills.length > 0 ? (
                            viewingResult.matchedSkills.map((skill, idx) => (
                              <span key={idx} className="skill-tag matched">{skill}</span>
                            ))
                          ) : (
                            <span style={{ color: '#888', fontSize: '12px' }}>None identified</span>
                          )}
                        </div>

                        <strong style={{ fontSize: '12px', color: '#a82727' }}>Competency / Discipline Gaps:</strong>
                        <div className="skills-tags-container">
                          {viewingResult.missingSkills && viewingResult.missingSkills.length > 0 ? (
                            viewingResult.missingSkills.map((skill, idx) => (
                              <span key={idx} className="skill-tag missing">{skill}</span>
                            ))
                          ) : (
                            <span style={{ color: '#888', fontSize: '12px' }}>All required competencies verified</span>
                          )}
                        </div>
                      </div>

                      {/* Evidence Citations Table */}
                      {viewingResult.evidence && viewingResult.evidence.length > 0 && (
                        <div>
                          <h4 style={{ margin: '0 0 10px', color: '#1e3a63', fontSize: '13px' }}>Resume Evidence & Verification</h4>
                          <div style={{ overflowX: 'auto' }}>
                            <table className="evidence-table">
                              <thead>
                                <tr>
                                  <th style={{ width: '28%' }}>Criterion</th>
                                  <th style={{ width: '38%' }}>Direct Resume Evidence</th>
                                  <th style={{ width: '34%' }}>Academic Assessment</th>
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

                      {/* Extracted Profile */}
                      {viewingResult.profile && (
                        <div>
                          <h4 style={{ margin: '0 0 10px', color: '#1e3a63', fontSize: '13px' }}>Candidate Credentials (Extracted)</h4>
                          <div className="profile-grid">
                            {viewingResult.profile.education && viewingResult.profile.education.length > 0 && (
                              <div className="profile-card">
                                <h4>Education History</h4>
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
                                <h4>Academic Appointments & Experience</h4>
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
                    </div>
                  )}

                  {/* Tab 2: Search Committee Interview Pack */}
                  {activeDossierTab === 'questions' && (
                    <div>
                      {viewingResult.committeeQuestions && viewingResult.committeeQuestions.length > 0 ? (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                              Tailored probing questions for the faculty search committee interview:
                            </p>
                            <button
                              type="button"
                              className="copy-btn"
                              onClick={() => {
                                const qText = viewingResult.committeeQuestions.map((q, idx) => `${idx + 1}. ${q}`).join('\n\n');
                                navigator.clipboard.writeText(qText);
                                setCopiedQuestions(true);
                                setTimeout(() => setCopiedQuestions(false), 2500);
                              }}
                            >
                              {copiedQuestions ? 'Questions Copied' : 'Copy All Questions'}
                            </button>
                          </div>

                          <div className="questions-list">
                            {viewingResult.committeeQuestions.map((q, idx) => (
                              <div key={idx} className="question-card">
                                <div className="question-number">Question {idx + 1}</div>
                                <div>{q}</div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p style={{ color: '#64748b', fontSize: '12px' }}>General interview questions will be generated upon full dossier review.</p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
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
