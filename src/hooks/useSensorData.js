import { useState, useEffect, useRef } from 'react'

export const useSensorData = () => {
  const [sensorData, setSensorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isInitialFetchRef = useRef(true)

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        // Only show loading state on initial fetch
        if (isInitialFetchRef.current) {
          setLoading(true)
        }
        
        // Call FastAPI backend (running on port 8000)
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        const response = await fetch(`${backendUrl}/api/status/current`)
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Transform backend data to match dashboard format
        const transformedData = {
          batteryLevel: data.battery_percentage,
          solarPower: data.total_incoming_watts,
          temperature: 28, // Not available from current API
          humidity: 65,    // Not available from current API
          chargingPorts: [
            { id: 1, status: 'idle', device: null },
            { id: 2, status: 'idle', device: null },
            { id: 3, status: 'idle', device: null },
            { id: 4, status: 'idle', device: null }
          ],
          timestamp: data.last_update,
          voltage: data.system_voltage,
          chargeRate: data.charge_rate,
          dischargeRate: data.discharge_rate,
          estimatedRuntime: data.estimated_runtime,
          isCrankActive: data.is_crank_active,
          lowBatteryWarning: data.low_battery_warning,
          status: data.status,
          energyBalance: data.energy_balance || 0,
          crankPower: data.crank_power || 0
        }
        
        setSensorData(transformedData)
        setError(null)
        
        // Mark initial fetch as complete
        if (isInitialFetchRef.current) {
          isInitialFetchRef.current = false
          setLoading(false)
        }
      } catch (err) {
        console.error('Sensor fetch error:', err)
        setError(err.message || 'Failed to fetch sensor data')
        setSensorData(null)
        
        // Mark initial fetch as complete even on error
        if (isInitialFetchRef.current) {
          isInitialFetchRef.current = false
          setLoading(false)
        }
      }
    }

    fetchSensorData()

    // Refresh every 5 seconds (match ESP32 polling interval)
    const interval = setInterval(fetchSensorData, 5000)

    return () => clearInterval(interval)
  }, [])

  return { sensorData, loading, error }
}
