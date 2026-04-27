const ProductionChart = () => {
  const hours = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22']
  const data = [45, 38, 42, 58, 75, 88, 95, 92, 78, 52, 35, 30]

  return (
    <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fff 100%)', borderRadius: '20px', padding: '0', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '3px solid #2d2d2d', overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(90deg, #22c55e 0%, #6fa83a 100%)', padding: '16px 24px', color: 'white' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📊</span>
          24-HOUR PRODUCTION CHART
        </h3>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '4px', padding: '24px', background: 'linear-gradient(135deg, #f0fdf4, #ecfccb)', borderRadius: '12px', border: '3px solid #2d2d2d', marginBottom: '24px' }}>
          {data.map((height, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '100%',
                  background: `linear-gradient(180deg, #22c55e 0%, #6fa83a 100%)`,
                  borderRadius: '4px 4px 0 0',
                  height: `${height}%`,
                  transition: 'all 0.3s ease',
                  minHeight: '6px',
                  border: '2px solid #2d2d2d',
                  boxShadow: '0 2px 8px rgba(111, 168, 58, 0.3)'
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', marginTop: '8px' }}>{hours[index]}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ textAlign: 'center', padding: '16px', background: '#f0fdf4', borderRadius: '8px', border: '3px solid #2d2d2d' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PEAK TIME</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#6fa83a', fontFamily: 'Courier New, monospace' }}>12:00 PM</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: '#ecfccb', borderRadius: '8px', border: '3px solid #2d2d2d' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AVG POWER</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#f4c430', fontFamily: 'Courier New, monospace' }}>15.2W</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductionChart