const ChargingPorts = ({ data }) => {
  const activePorts = data?.active_ports || 0
  const availablePorts = data?.available_ports || 4

  const ports = [
    { name: 'PORT 1', type: 'USB-C', active: activePorts >= 1 },
    { name: 'PORT 2', type: 'Lightning', active: activePorts >= 2 },
    { name: 'PORT 3', type: 'USB-C', active: activePorts >= 3 },
    { name: 'PORT 4', type: 'Lightning', active: activePorts >= 4 },
  ]

  return (
    <div className="eink-card">
      <h3 className="eink-section-title">
        <i className="fas fa-plug"></i>
        CHARGING PORTS
      </h3>

      <div className="ports-summary mb-4">
        <div className="port-stat">
          <span className="port-stat-number">{activePorts}</span>
          <span className="port-stat-label">Active</span>
        </div>
        <div className="port-stat">
          <span className="port-stat-number">{availablePorts}</span>
          <span className="port-stat-label">Available</span>
        </div>
      </div>

      <div className="ports-list">
        {ports.map((port, index) => (
          <div key={index} className={`port-item ${port.active ? 'port-charging' : 'port-available'}`}>
            <div className="port-indicator"></div>
            <div className="port-info">
              <div className="port-name">{port.name}</div>
              <div className="port-type">{port.type}</div>
            </div>
            <div className="port-stats">
              <div className="port-status">{port.active ? 'CHARGING' : 'AVAILABLE'}</div>
              <div className="port-specs">{port.active ? '5.0V / 2.1A' : 'Ready'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChargingPorts