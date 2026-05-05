import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useSensorData } from '../hooks/useSensorData.js'
import '../styles/dashboard.css'
import Sidebar from '../components/Sidebar'
import BatteryStatus from '../components/BatteryStatus'
import PowerMetrics from '../components/PowerMetrics'
import ChargingPorts from '../components/ChargingPorts'
import ProductionChart from '../components/ProductionChart'
import SystemStatus from '../components/SystemStatus'

const Dashboard = () => {
  const { sensorData } = useSensorData()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const scrollPositionRef = useRef(0)
  const prevSensorDataRef = useRef(null)

  // Save scroll position BEFORE data changes
  useEffect(() => {
    if (sensorData && prevSensorDataRef.current && sensorData !== prevSensorDataRef.current) {
      scrollPositionRef.current = window.scrollY
    }
    prevSensorDataRef.current = sensorData
  }, [sensorData])

  // Restore scroll position AFTER DOM is updated but BEFORE paint
  useLayoutEffect(() => {
    if (scrollPositionRef.current > 0 && sensorData) {
      window.scrollTo(0, scrollPositionRef.current)
    }
  }, [sensorData])

  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      setCurrentTime(timeStr)
      setCurrentDate(dateStr)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const data = sensorData || {}

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfccb 50%, #fef9c3 100%)' }}>
      <Sidebar />

      {/* Main Content */}
      <main className="lg:ml-64 p-6 md:p-8">
        {/* Header */}
        <div className="header-section mb-8">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div>
              <h1 className="gradient-text" style={{ fontSize: '32px', marginBottom: '8px', fontWeight: 'bold' }}>EcoBench Monitoring System Dashboard</h1>
              <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>Real-time monitoring and status display</p>
            </div>
          </div>
          <div className="status-badges">
            <div className="status-badge status-online">
              <span className="pulse-dot"></span>
              <span>System Online</span>
            </div>
            <div className="status-badge">
              <i className="fas fa-clock"></i>
              <span>{currentTime || '--:--:--'}</span>
            </div>
            <div className="status-badge">
              <i className="fas fa-calendar"></i>
              <span>{currentDate || '-- -- --'}</span>
            </div>
          </div>
        </div>

        {/* E-INK DISPLAY */}
        <div className="eink-display mb-8">
          <div className="eink-header">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 className="eink-text" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>PUP INSTITUTE OF TECHNOLOGY</h2>
              <p className="eink-text opacity-70" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>SUSTAINABLE ENERGY BENCH SYSTEM</p>
              <div className="eink-divider"></div>
            </div>
          </div>

          {/* Main Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <BatteryStatus data={data} />
            <PowerMetrics data={data} />
            <ChargingPorts data={data} />
          </div>

          {/* POWER SOURCES */}
          <div className="eink-divider my-6"></div>
          <h3 className="eink-section-title" style={{ marginBottom: '16px' }}>
            <i className="fas fa-solar-panel"></i>
            POWER SOURCES
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div className="power-source-card active">
              <div className="power-source-icon" style={{ fontSize: '32px' }}>
                <i className="fas fa-sun"></i>
              </div>
              <div className="power-source-name">SOLAR PANEL</div>
              <div className="power-source-status">Active</div>
              <div className="power-source-value">{(data?.solarPower || 132.5).toFixed(1)}W</div>
              <div className="power-source-graph">
                <div className="graph-bar" style={{ height: '85%' }}></div>
                <div className="graph-bar" style={{ height: '92%' }}></div>
                <div className="graph-bar" style={{ height: '78%' }}></div>
                <div className="graph-bar" style={{ height: '88%' }}></div>
                <div className="graph-bar" style={{ height: '95%' }}></div>
              </div>
            </div>

            <div className="power-source-card">
              <div className="power-source-icon" style={{ fontSize: '32px' }}>
                <i className="fas fa-cog"></i>
              </div>
              <div className="power-source-name">HAND CRANK</div>
              <div className="power-source-status">{(data?.crankPower || 0) > 0 ? 'Active' : 'Standby'}</div>
              <div className="power-source-value">{(data?.crankPower || 0).toFixed(1)}W</div>
              <div className="crank-detector">
                <i className="fas fa-microchip"></i>
                <span>Motion Sensor: {(data?.crankPower || 0) > 0 ? 'Active' : 'Idle'}</span>
              </div>
            </div>

            <div className="power-source-card">
              <div className="power-source-icon" style={{ fontSize: '32px' }}>
                <i className="fas fa-database"></i>
              </div>
              <div className="power-source-name">BATTERY BANK</div>
              <div className="power-source-status">{(data?.batteryLevel || 0) < 80 ? 'Charging' : 'Full'}</div>
              <div className="power-source-value">{(data?.chargeRate || 0).toFixed(1)}A</div>
              <div className="battery-health">
                <div className="health-label">Health</div>
                <div className="health-bar">
                  <div className="health-fill" style={{ width: `${data?.battery_health || 0}%` }}></div>
                </div>
                <div className="health-percent">{(data?.battery_health || 0)}%</div>
              </div>
            </div>
          </div>

          {/* PRODUCTION ANALYTICS */}
          <div className="eink-divider my-6"></div>
          <h3 className="eink-section-title" style={{ marginBottom: '16px' }}>
            <i className="fas fa-chart-bar"></i>
            PRODUCTION ANALYTICS
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div className="analytics-box">
              <div className="analytics-icon"><i className="fas fa-clock"></i></div>
              <div className="analytics-label">UPTIME</div>
              <div className="analytics-value">{(data?.uptime || 0).toFixed(1)} hrs</div>
            </div>
            <div className="analytics-box">
              <div className="analytics-icon"><i className="fas fa-calendar-day"></i></div>
              <div className="analytics-label">TODAY</div>
              <div className="analytics-value">{(data?.energy_today || 0).toFixed(2)} kWh</div>
            </div>
            <div className="analytics-box">
              <div className="analytics-icon"><i className="fas fa-calendar-week"></i></div>
              <div className="analytics-label">THIS WEEK</div>
              <div className="analytics-value">{(data?.energy_week || 0).toFixed(2)} kWh</div>
            </div>
            <div className="analytics-box">
              <div className="analytics-icon"><i className="fas fa-tachometer-alt"></i></div>
              <div className="analytics-label">EFFICIENCY</div>
              <div className="analytics-value">{(data?.efficiency || 0).toFixed(0)}%</div>
            </div>
          </div>

          {/* DAILY CHART */}
          <div className="chart-section mb-4">
            <h4 className="chart-title">24-HOUR PRODUCTION CHART</h4>
            <div className="production-chart">
              <div className="chart-bar" style={{ height: '45%' }}><span className="chart-time">00</span></div>
              <div className="chart-bar" style={{ height: '38%' }}><span className="chart-time">02</span></div>
              <div className="chart-bar" style={{ height: '42%' }}><span className="chart-time">04</span></div>
              <div className="chart-bar" style={{ height: '58%' }}><span className="chart-time">06</span></div>
              <div className="chart-bar" style={{ height: '75%' }}><span className="chart-time">08</span></div>
              <div className="chart-bar" style={{ height: '88%' }}><span className="chart-time">10</span></div>
              <div className="chart-bar" style={{ height: '95%' }}><span className="chart-time">12</span></div>
              <div className="chart-bar" style={{ height: '92%' }}><span className="chart-time">14</span></div>
              <div className="chart-bar" style={{ height: '78%' }}><span className="chart-time">16</span></div>
              <div className="chart-bar" style={{ height: '52%' }}><span className="chart-time">18</span></div>
              <div className="chart-bar" style={{ height: '35%' }}><span className="chart-time">20</span></div>
              <div className="chart-bar" style={{ height: '30%' }}><span className="chart-time">22</span></div>
            </div>
          </div>

          {/* PEAK USAGE & SYSTEM STATUS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="info-panel">
              <div className="info-icon"><i className="fas fa-chart-line"></i></div>
              <div className="info-content">
                <div className="info-label">PEAK USAGE TIME</div>
                <div className="info-value">{(data?.peak_time || '--:-- --').toUpperCase()}</div>
                <div className="info-detail">Average: {(data?.active_ports || 0)} ports active • {(data?.peak_consumption || 0).toFixed(1)}W consumed</div>
              </div>
            </div>
            <div className="info-panel">
              <div className="info-icon system-ok"><i className="fas fa-check-circle"></i></div>
              <div className="info-content">
                <div className="info-label">SYSTEM STATUS</div>
                <div className="info-value status-online-text">{(data?.status || 'OFFLINE').toUpperCase()}</div>
                <div className="info-detail">{(data?.system_message || 'Waiting for data...')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* MANUAL CRANK CONTROL */}
        <div className="control-panel mb-8">
          <div className="control-header">
            <div className="control-icon">
              <i className="fas fa-cog"></i>
            </div>
            <div>
              <h3 className="control-title">Manual Crank Generator</h3>
              <p className="control-subtitle">Activate emergency power generation system</p>
            </div>
            <button id="crankToggle" className="crank-button">
              <i className="fas fa-cog mr-2"></i>
              <span>ACTIVATE CRANK</span>
            </button>
          </div>
          <div id="crankActiveStatus" className="crank-active-display hidden">
            <div className="crank-animation">
              <i className="fas fa-cog fa-spin"></i>
            </div>
            <div className="crank-info">
              <p className="crank-status-text">CRANKING IN PROGRESS...</p>
              <p className="crank-output">Generating <span id="crankOutputValue">45W</span> of emergency power</p>
              <div className="crank-metrics">
                <div className="crank-metric">
                  <i className="fas fa-bolt"></i>
                  <span>Output: <strong>45W</strong></span>
                </div>
                <div className="crank-metric">
                  <i className="fas fa-tachometer-alt"></i>
                  <span>RPM: <strong>120</strong></span>
                </div>
                <div className="crank-metric">
                  <i className="fas fa-stopwatch"></i>
                  <span>Duration: <strong>0:00</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ENVIRONMENTAL IMPACT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div className="impact-card impact-carbon">
            <div className="impact-icon">
              <i className="fas fa-cloud"></i>
            </div>
            <div className="impact-content">
              <p className="impact-label">CO₂ Saved Today</p>
              <p className="impact-value">{(data?.co2_saved || 0).toFixed(2)} <span className="impact-unit">kg</span></p>
              <div className="impact-bar">
                <div className="impact-fill" style={{ width: `${Math.min((data?.co2_saved || 0) * 20, 100)}%` }}></div>
              </div>
            </div>
          </div>

          <div className="impact-card impact-trees">
            <div className="impact-icon">
              <i className="fas fa-tree"></i>
            </div>
            <div className="impact-content">
              <p className="impact-label">Trees Equivalent</p>
              <p className="impact-value">{(data?.trees_equivalent || 0).toFixed(2)} <span className="impact-unit">trees</span></p>
              <div className="impact-bar">
                <div className="impact-fill" style={{ width: `${Math.min((data?.trees_equivalent || 0) * 50, 100)}%` }}></div>
              </div>
            </div>
          </div>

          <div className="impact-card impact-energy">
            <div className="impact-icon">
              <i className="fas fa-bolt"></i>
            </div>
            <div className="impact-content">
              <p className="impact-label">Total Generated</p>
              <p className="impact-value">{(data?.total_energy || 0).toFixed(2)} <span className="impact-unit">kWh</span></p>
              <div className="impact-bar">
                <div className="impact-fill" style={{ width: `${Math.min((data?.total_energy || 0) * 15, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard