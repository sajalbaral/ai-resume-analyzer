export default function Header({ user, handleLogout }) {
  return (
    <header className="header">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <h2>Welcome, {user?.email}</h2>
      <div className="badge">AI-powered</div>
      <h1>
        Resume <em>Analyzer</em>
      </h1>
      <p className="subtitle">
        Paste your resume and job description to get an instant match score and
        actionable improvements.
      </p>
    </header>
  );
}
