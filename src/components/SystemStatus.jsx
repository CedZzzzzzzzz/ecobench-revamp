const SystemStatus = ({ data }) => {
  const status = data?.status || 'online'
  const lastUpdate = new Date(data?.timestamp || new Date())
  const now = new Date()
  const secondsSinceUpdate = (now - lastUpdate) / 1000

  let displayStatus = 'OFFLINE'
  let statusBg = '#fee2e2'
  let statusColor = '#991b1b'
  let statusMessage = 'No data received'
  let statusIcon = '❌'

  if (secondsSinceUpdate < 30) {
    if (status === 'warning') {
      displayStatus = 'WARNING'
      statusBg = '#fef3c7'
      statusColor = '#92400e'
      statusMessage = 'Low battery warning • Battery below 20%'
      statusIcon = '⚠️'
    } else {
      displayStatus = 'ONLINE'
      statusBg = '#f0fdf4'
      statusColor = '#166534'
      statusMessage = 'All systems operational • No errors detected'
      statusIcon = '✅'
    }
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fff 100%)', borderRadius: '20px', padding: '0', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '3px solid #2d2d2d', overflow: 'hidden' }}>
      <div style={{ background: statusIcon === '✅' ? 'linear-gradient(90deg, #22c55e 0%, #15803d 100%)' : (statusIcon === '⚠️' ? 'linear-gradient(90deg, #f4c430 0%, #ca8a04 100%)' : 'linear-gradient(90deg, #ef4444 0%, #991b1b 100%)'), padding: '16px 24px', color: 'white' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>💻</span>
          SYSTEM STATUS
        </h3>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', borderRadius: '12px', border: '3px solid #2d2d2d', background: statusBg, marginBottom: '24px', boxShadow: statusIcon === '✅' ? '0 4px 12px rgba(34, 197, 94, 0.2)' : 'none' }}>
          <div style={{ fontSize: '48px' }}>{statusIcon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8, color: statusColor }}>CURRENT STATUS</div>
            <div style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px', color: statusColor }}>{displayStatus}</div>
            <div style={{ fontSize: '13px', opacity: 0.85, color: statusColor, fontWeight: 600 }}>{statusMessage}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '3px solid #2d2d2d' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏱️</div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>UPTIME</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#2d2d2d', fontFamily: 'Courier New, monospace' }}>6.5h</div>
          </div>
          <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '8px', border: '3px solid #2d2d2d' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DAILY ENERGY</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#6fa83a', fontFamily: 'Courier New, monospace' }}>3.45 kWh</div>
          </div>
          <div style={{ padding: '16px', background: '#ecfccb', borderRadius: '8px', border: '3px solid #2d2d2d' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📈</div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>EFFICIENCY</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#22c55e', fontFamily: 'Courier New, monospace' }}>87%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatus