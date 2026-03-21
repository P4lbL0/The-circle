export default function DashboardLoading() {
  return (
    <div style={{
      background: '#0a0a0a',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}>
        {/* Spinner */}
        <style>{`
          @keyframes tc-spin {
            to { transform: rotate(360deg); }
          }
          .tc-spinner {
            width: 32px; height: 32px;
            border: 2px solid #1a1a1a;
            border-top-color: #FFC107;
            border-radius: 50%;
            animation: tc-spin 0.7s linear infinite;
          }
        `}</style>
        <div className="tc-spinner" />
        <span style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '0.65rem',
          color: '#333',
          textTransform: 'uppercase',
          letterSpacing: '3px',
        }}>
          Chargement
        </span>
      </div>
    </div>
  )
}
