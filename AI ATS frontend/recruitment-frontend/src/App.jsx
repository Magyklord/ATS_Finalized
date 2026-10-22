
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

function PlaceholderPage({ page }) {
  const details = {
    screening: {
      title: 'AI Screening',
      description:
        'Review match scores, supporting evidence, and AI-generated explanations.',
      icon: '✧',
    },
  };

  const item = details[page] ?? {
    title: 'Coming Soon',
    description: 'This section is under development.',
    icon: '▤',
  };

  return (
    <div className="page-content">
      <div className="welcome-section">
        <div>
          <p className="eyebrow">RECRUITMENT MANAGEMENT</p>
          <h1>{item.title}</h1>
          <p className="muted">{item.description}</p>
        </div>
      </div>

      <section className="panel empty-state">
        <div className="empty-icon">{item.icon}</div>
        <h3>{item.title}</h3>
        <p>This page will be connected to the backend in a later step.</p>
      </section>
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
        <PlaceholderPage page={activePage} />
      )}

        <footer className="app-footer">
          FacultyHire · AI-assisted faculty recruitment
          <span>Final recruitment decisions remain with human reviewers.</span>
        </footer>
      </main>
    </div>
  );
}
