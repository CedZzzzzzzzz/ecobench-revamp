import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useSensorData = () => {
  const [sensorData, setSensorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual API call to fetch sensor data
        // For now, using mock data
        const mockData = {
          batteryLevel: 85,
          solarPower: 450,
          temperature: 28,
          humidity: 65,
          chargingPorts: [
            { id: 1, status: 'charging', device: 'iPhone' },
            { id: 2, status: 'idle', device: null },
            { id: 3, status: 'charging', device: 'Tablet' },
            { id: 4, status: 'idle', device: null }
          ],
          timestamp: new Date().toISOString()
        }
        setSensorData(mockData)
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to fetch sensor data')
        setSensorData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSensorData()

    // Optionally set up polling or real-time subscription
    const interval = setInterval(fetchSensorData, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return { sensorData, loading, error }
}
