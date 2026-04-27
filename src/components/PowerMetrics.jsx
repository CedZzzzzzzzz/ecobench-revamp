const PowerMetrics = ({ data }) => {
  const totalWatts = data?.total_incoming_watts || 0
  const chargeRate = data?.charge_rate || 0
  const balance = data?.energy_balance || 0

  return (
    <div className="eink-card">
      <h3 className="eink-section-title">
        <i className="fas fa-bolt"></i>
        POWER METRICS
      </h3>

      <div className="power-display-main">
        <div className="power-label">TOTAL INCOMING POWER</div>
        <div className="power-value-huge">{totalWatts.toFixed(1)}W</div>
      </div>

      <div className="metric-grid mb-4">
        <div className="metric-box highlight">
          <div className="metric-label">CHARGE RATE</div>
          <div className="metric-value text-green-700">{chargeRate > 0 ? '+' : ''}{chargeRate.toFixed(1)}A</div>
        </div>
        <div className="metric-box highlight">
          <div className="metric-label">RUNTIME</div>
          <div className="metric-value text-blue-700">{(data?.estimated_runtime || 0).toFixed(1)}h</div>
        </div>
      </div>

      <div className="energy-balance-section">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs eink-text font-bold">ENERGY BALANCE</span>
          <span className="text-xs eink-text font-bold">{balance > 0 ? '+' : ''}{balance.toFixed(0)}W</span>
        </div>
        <div className="energy-balance-bar">
          <div className="balance-fill" style={{ width: '65%' }}></div>
          <div className="balance-indicator">
            <div className="indicator-arrow"></div>
          </div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs eink-text opacity-60">Discharge</span>
          <span className="text-xs eink-text opacity-60">Neutral</span>
          <span className="text-xs eink-text opacity-60">Charge</span>
        </div>
        <p className="text-sm eink-text mt-2 text-center font-semibold">System Charging Normally</p>
      </div>
    </div>
  )
}

export default PowerMetrics