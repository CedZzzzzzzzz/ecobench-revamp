const BatteryStatus = ({ data }) => {
  const batteryPercent = data?.battery_percentage || 0
  const voltage = data?.system_voltage || 0
  const isCharging = (data?.charge_rate || 0) > 0

  return (
    <div className="eink-card">
      <h3 className="eink-section-title">
        <i className="fas fa-battery-three-quarters"></i>
        BATTERY STATUS
      </h3>

      <div className="battery-main-display">
        <div className="battery-percentage-large">{batteryPercent}%</div>
        <div className="battery-status-text">{isCharging ? 'CHARGING' : 'STANDBY'}</div>
      </div>

      <div className="battery-visual">
        <div className="battery-container">
          <div className="battery-level-fill" style={{ width: `${batteryPercent}%` }}></div>
          <div className="battery-segments">
            <div className="segment"></div>
            <div className="segment"></div>
            <div className="segment"></div>
            <div className="segment"></div>
          </div>
          <i className="fas fa-bolt battery-icon"></i>
        </div>
        <div className="battery-terminal"></div>
      </div>

      <div className="metric-grid">
        <div className="metric-box">
          <div className="metric-label">VOLTAGE</div>
          <div className="metric-value">{voltage.toFixed(1)}V</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">CAPACITY</div>
          <div className="metric-value">{((batteryPercent / 100) * 8.5).toFixed(2)}Ah</div>
        </div>
      </div>
    </div>
  )
}

export default BatteryStatus