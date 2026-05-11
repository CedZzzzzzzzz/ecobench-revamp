from fastapi import FastAPI, HTTPException, Depends, Security, status
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from contextlib import asynccontextmanager
import os 
from dotenv import load_dotenv
import sys

load_dotenv()


class Config:
    # Environment
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    
    # Supabase PostgreSQL Configuration
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is required")

    # Supabase Auth & API Configuration
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    if not SUPABASE_URL:
        raise ValueError("SUPABASE_URL environment variable is required")
    
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
    if not SUPABASE_SERVICE_KEY:
        raise ValueError("SUPABASE_SERVICE_KEY environment variable is required")
    
    SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
    if not SUPABASE_ANON_KEY:
        raise ValueError("SUPABASE_ANON_KEY environment variable is required")

    # CORS Configuration
    CORS_ORIGINS_STR = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://localhost:3001" if ENVIRONMENT == "development" else ""
    )
    CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS_STR.split(",") if origin.strip()]

    # Battery Configuration (LiFePO4 Prototype)
    BATTERY_MIN_VOLTAGE = float(os.getenv("BATTERY_MIN_VOLTAGE", "6.0"))
    BATTERY_MAX_VOLTAGE = float(os.getenv("BATTERY_MAX_VOLTAGE", "9.0"))
    BATTERY_CAPACITY_AH = float(os.getenv("BATTERY_CAPACITY_AH", "2.0"))

    # Crank System Configuration
    CRANK_VOLTAGE_THRESHOLD = float(os.getenv("CRANK_VOLTAGE_THRESHOLD", "6.0"))

    # System Configuration
    SAMPLING_INTERVAL_SECONDS = int(os.getenv("SAMPLING_INTERVAL_SECONDS", "5"))
    DATA_RETENTION_DAYS = int(os.getenv("DATA_RETENTION_DAYS", "30"))
    


Base = declarative_base()


class SensorReading(Base):

    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key = True, index = True, autoincrement = True)
    timestamp = Column(DateTime, default = datetime.utcnow, index = True)
    voltage = Column(Float, nullable = False)
    current = Column(Float, nullable = False)
    power = Column(Float, nullable = False)
    is_charging = Column(Boolean, default = False)
    is_crank_active = Column(Boolean, default = False)
    created_at = Column(DateTime, default = datetime.utcnow)

class DailyAggregate(Base):

    __tablename__ = "daily_aggregates"

    id = Column(Integer, primary_key = True, index = True, autoincrement = True)
    date = Column(DateTime, unique = True, index = True)
    total_energy_generated_wh = Column(Float, default = 0.0)
    total_energy_consumed_wh = Column(Float, default = 0.0)
    avg_voltage = Column(Float, default = 0.0)
    max_power = Column(Float, default = 0.0)
    min_battery_percentage = Column(Float, default = 100.0)
    max_battery_percentage = Column(Float, default = 100.0)
    crank_contribution_percent = Column(Float, default = 0.0)
    total_crank_duration_seconds = Column(Integer, default = 0)
    peak_usage_hour = Column(Integer, default = 0.0)
    created_at = Column(DateTime, default = datetime.utcnow)

class SystemStatus(Base):

    __tablename__ = "system_status"

    id = Column(Integer, primary_key = True, default = 1)
    last_update = Column(DateTime, default = datetime.utcnow)
    total_incoming_watts = Column(Float, default = 0.0)
    system_voltage = Column(Float, default = 0.0)
    battery_percentage = Column(Integer, default=0)
    charge_rate = Column(Float, default=0)
    discharge_rate = Column(Float, default=0)
    estimated_runtime = Column(Float, default=0)
    energy_balance = Column(Float, default=0)
    is_crank_active = Column(Boolean, default=False)
    low_battery_warning = Column(Boolean, default=False)
    status = Column(String(20), default="online")


engine = create_engine(
    Config.DATABASE_URL,
    pool_pre_ping = True,
    pool_recycle = 3600,
    echo = False 
)

SessionLocal = sessionmaker(autocommit = False, autoflush = False, bind = engine)

def get_db():
    db =SessionLocal()
    try: 
        yield db
    finally:
        db.close()


class SensorDataInput(BaseModel):
    
    voltage: float = Field(..., ge = 0, le = 20, description = "System Voltage in Volts")
    current: float = Field(..., description = "Current in Amperes (+ charging, - discharging)")

    class Config:
        json_schema_extra = {
            "example": {
                "voltage": 7.5,
                "current": 1.2
            }
        }

class PortInfo(BaseModel):
    port_number: int
    device_type: str
    is_active: bool
    status: str
    current: float
    voltage: Optional[float] = None
    power: Optional[float] = None

class EnhancedSensorDataInput(BaseModel):
    voltage: float
    current: float
    ports: List[PortInfo]
    active_ports: int
    available_ports: int        

class CurrentStatusResponse(BaseModel):

    last_update: datetime
    total_incoming_watts: float
    system_voltage: float
    battery_percentage: int
    charge_rate: float
    discharge_rate: float
    estimated_runtime: float
    energy_balance: float
    is_crank_active: bool
    low_battery_warning: bool
    status: str

class DailyEnergyResponse(BaseModel):

    date: str
    total_generated_wh: float
    total_consumed_wh: float
    avg_voltage: float
    max_power: float
    crank_contribution_percent: float
    peak_usage_hour: int

class HourlyDataPoint(BaseModel):

    hour: str
    watts: float
    count: int


class EnergyCalculator:
    @staticmethod
    def calculate_power(voltage: float, current: float) -> float:
        return voltage * abs(current)
    
    @staticmethod
    def voltage_to_percentage(voltage : float) -> int:
        if voltage >= Config.BATTERY_MAX_VOLTAGE:
            return 100
        if voltage <= Config.BATTERY_MIN_VOLTAGE:
            return 0
        
        percentage = ((voltage - Config.BATTERY_MIN_VOLTAGE) / 
                     (Config.BATTERY_MAX_VOLTAGE - Config.BATTERY_MIN_VOLTAGE)) * 100
        return max(0, min(100, int(percentage)))
    
    @staticmethod
    def estimate_runtime(battery_percentage : int, discharge_current : float) -> float:
        if discharge_current <= 0:
            return 9999.0  # Infinite runtime if not discharging
        
        remaining_capacity = (battery_percentage / 100) * Config.BATTERY_CAPACITY_AH
        runtime_hours = remaining_capacity / abs(discharge_current)
        return round(runtime_hours, 1)
    
    @staticmethod
    def detect_crank_active(voltage: float, db: Session) -> bool:
        if voltage <= Config.CRANK_VOLTAGE_THRESHOLD:
            return False
        
        # Check last 3 readings for sustained spike
        recent = db.query(SensorReading).order_by(
            SensorReading.timestamp.desc()
        ).limit(3).all()
        
        if len(recent) < 2:
            return True
        
        high_count = sum(1 for r in recent if r.voltage > Config.CRANK_VOLTAGE_THRESHOLD)
        return high_count >= 2

class DataService:

    @staticmethod
    def process_sensor_data(data: SensorDataInput, db: Session) -> CurrentStatusResponse:
        
        # Calculate metrics
        power = EnergyCalculator.calculate_power(data.voltage, abs(data.current))
        battery_pct = EnergyCalculator.voltage_to_percentage(data.voltage)
        is_charging = data.current > 0
        is_crank = EnergyCalculator.detect_crank_active(data.voltage, db)
        
        charge_rate = data.current if is_charging else 0
        discharge_rate = abs(data.current) if not is_charging else 0
        runtime = EnergyCalculator.estimate_runtime(battery_pct, discharge_rate)
        energy_balance = power if is_charging else -power
        
        # Save raw reading
        reading = SensorReading(
            timestamp=datetime.utcnow(),
            voltage=data.voltage,
            current=data.current,
            power=power,
            is_charging=is_charging,
            is_crank_active=is_crank
        )
        db.add(reading)
        
        # Update system status
        status = db.query(SystemStatus).filter(SystemStatus.id == 1).first()
        if not status:
            status = SystemStatus(id=1)
            db.add(status)
        
        status.last_update = datetime.utcnow()
        status.total_incoming_watts = power if is_charging else 0
        status.system_voltage = data.voltage
        status.battery_percentage = battery_pct
        status.charge_rate = charge_rate
        status.discharge_rate = discharge_rate
        status.estimated_runtime = runtime
        status.energy_balance = energy_balance
        status.is_crank_active = is_crank
        status.low_battery_warning = battery_pct < 30
        status.status = "warning" if battery_pct < 20 else "online"
        
        db.commit()
        db.refresh(status)
        
        return CurrentStatusResponse(
            last_update=status.last_update,
            total_incoming_watts=status.total_incoming_watts,
            system_voltage=status.system_voltage,
            battery_percentage=status.battery_percentage,
            charge_rate=status.charge_rate,
            discharge_rate=status.discharge_rate,
            estimated_runtime=status.estimated_runtime,
            energy_balance=status.energy_balance,
            is_crank_active=status.is_crank_active,
            low_battery_warning=status.low_battery_warning,
            status=status.status
        )
    
    @staticmethod
    def aggregate_daily_data(db: Session):
        today = datetime.utcnow().date()
        today_start = datetime.combine(today, datetime.min.time())
        today_end = datetime.combine(today, datetime.max.time())

        # Get Today Reading
        readings = db.query(SensorReading).filter(
            SensorReading.timestamp >= today_start,
            SensorReading.timestamp <= today_end
        ).all()

        if not readings:
            return 
        
        # Calculate aggregates
        total_generated = sum(
            r.power * (Config.SAMPLING_INTERVAL_SECONDS / 3600) 
            for r in readings if r.is_charging
        )
        total_consumed = sum(
            r.power * (Config.SAMPLING_INTERVAL_SECONDS / 3600) 
            for r in readings if not r.is_charging
        )
        avg_voltage = sum(r.voltage for r in readings) / len(readings)
        max_power = max(r.power for r in readings)
        
        voltages = [r.voltage for r in readings]
        battery_percentages = [
            EnergyCalculator.voltage_to_percentage(v) for v in voltages
        ]
        min_battery = min(battery_percentages)
        max_battery = max(battery_percentages)
        
        crank_readings = [r for r in readings if r.is_crank_active]
        crank_duration = len(crank_readings) * Config.SAMPLING_INTERVAL_SECONDS
        total_charging_duration = len([r for r in readings if r.is_charging]) * Config.SAMPLING_INTERVAL_SECONDS
        crank_contribution = (crank_duration / total_charging_duration * 100) if total_charging_duration > 0 else 0
        
        # Find peak usage hour
        hourly_discharge = {}
        for r in readings:
            if not r.is_charging:
                hour = r.timestamp.hour
                if hour not in hourly_discharge:
                    hourly_discharge[hour] = []
                hourly_discharge[hour].append(r.current)
        
        peak_hour = 0
        if hourly_discharge:
            peak_hour = max(
                hourly_discharge.items(),
                key=lambda x: sum(x[1]) / len(x[1])
            )[0]
        
        # Update or create daily aggregate
        daily = db.query(DailyAggregate).filter(
            DailyAggregate.date == today_start
        ).first()
        
        if not daily:
            daily = DailyAggregate(date=today_start)
            db.add(daily)
        
        daily.total_energy_generated_wh = total_generated
        daily.total_energy_consumed_wh = total_consumed
        daily.avg_voltage = avg_voltage
        daily.max_power = max_power
        daily.min_battery_percentage = min_battery
        daily.max_battery_percentage = max_battery
        daily.crank_contribution_percent = crank_contribution
        daily.total_crank_duration_seconds = crank_duration
        daily.peak_usage_hour = peak_hour
        
        db.commit()

# === FastAPI Application Setup ===

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database Tables Created")
    except Exception as e:
        print(f"⚠️ Warning: Could not create tables: {e}")
        print("⚠️ Tables may already exist or there's a connection issue")

    # Initialize System Status if not exists
    try:
        db = SessionLocal()
        try:
            status = db.query(SystemStatus).filter(SystemStatus.id == 1).first()
            if not status:
                status = SystemStatus(id=1)
                db.add(status)
                db.commit()
                print("✅ Initialized System Status")
        finally:
            db.close()
    except Exception as e:
        print(f"⚠️ Warning: Could not initialize SystemStatus: {e}")

    yield

    #Shutdown
    print("🛑 Shutting down...")

app = FastAPI(
    title="EcoBench Monitoring API",
    description="IoT backend for solar-powered charging bench",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.CORS_ORIGINS if Config.CORS_ORIGINS else ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# === API Routes ===
@app.get("/")
async def root():
    return {
        "status" : "online",
        "service" : "EcoBench Monitoring API",
        "version" : "1.0.0",
        "docs" : "/docs"
    }

@app.post("/api/sensor-data", response_model=CurrentStatusResponse)
async def receive_sensor_data(data : SensorDataInput, db: Session = Depends(get_db)):
    try:
        result = DataService.process_sensor_data(data, db)

        # Aggregate daily data every hour (check if minute is 0)
        if datetime.utcnow().minute == 0:
            DataService.aggregate_daily_data(db)
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/sensor-data-enhanced")
async def receive_enhanced_sensor_data(data: EnhancedSensorDataInput, db: Session = Depends(get_db)):
    # Process basic data
    basic_data = SensorDataInput(voltage=data.voltage, current=data.current)
    result = DataService.process_sensor_data(basic_data, db)
    
    return result

@app.get("/api/status/current", response_model=CurrentStatusResponse)
async def get_current_status(db: Session = Depends(get_db)):
    status = db.query(SystemStatus).filter(SystemStatus.id == 1).first()
    if not status:
        raise HTTPException(status_code=404, detail="System status not found")
    
    return CurrentStatusResponse(
        last_update=status.last_update,
        total_incoming_watts=status.total_incoming_watts,
        system_voltage=status.system_voltage,
        battery_percentage=status.battery_percentage,
        charge_rate=status.charge_rate,
        discharge_rate=status.discharge_rate,
        estimated_runtime=status.estimated_runtime,
        energy_balance=status.energy_balance,
        is_crank_active=status.is_crank_active,
        low_battery_warning=status.low_battery_warning,
        status=status.status
    )


@app.get("/api/energy/daily", response_model=DailyEnergyResponse)
async def get_daily_energy(date: Optional[str] = None, db: Session = Depends(get_db)):
    if date:
        try:
            target_date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    else:
        target_date = datetime.utcnow().date()
    
    target_datetime = datetime.combine(target_date, datetime.min.time())
    
    daily = db.query(DailyAggregate).filter(
        DailyAggregate.date == target_datetime
    ).first()
    
    if not daily:
        # Return empty data if no readings yet
        return DailyEnergyResponse(
            date=target_date.strftime("%Y-%m-%d"),
            total_generated_wh=0,
            total_consumed_wh=0,
            avg_voltage=0,
            max_power=0,
            crank_contribution_percent=0,
            peak_usage_hour=0
        )
    
    return DailyEnergyResponse(
        date=target_date.strftime("%Y-%m-%d"),
        total_generated_wh=daily.total_energy_generated_wh,
        total_consumed_wh=daily.total_energy_consumed_wh,
        avg_voltage=daily.avg_voltage,
        max_power=daily.max_power,
        crank_contribution_percent=daily.crank_contribution_percent,
        peak_usage_hour=daily.peak_usage_hour
    )

@app.get("/api/energy/hourly")
async def get_hourly_energy(date: Optional[str] = None, db: Session = Depends(get_db)):
    if date:
        try:
            target_date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    else:
        target_date = datetime.utcnow().date()
    
    start_time = datetime.combine(target_date, datetime.min.time())
    end_time = datetime.combine(target_date, datetime.max.time())
    
    readings = db.query(SensorReading).filter(
        SensorReading.timestamp >= start_time,
        SensorReading.timestamp <= end_time,
        SensorReading.is_charging == True
    ).all()
    
    # Group by hour
    hourly_data = {}
    for hour in range(24):
        hourly_data[hour] = []
    
    for reading in readings:
        hour = reading.timestamp.hour
        hourly_data[hour].append(reading.power)
    
    # Calculate average for each hour
    result = []
    for hour in range(24):
        avg_watts = sum(hourly_data[hour]) / len(hourly_data[hour]) if hourly_data[hour] else 0
        result.append({
            "hour": f"{hour:02d}:00",
            "watts": round(avg_watts, 1),
            "count": len(hourly_data[hour])
        })
    
    return result

@app.get("/api/energy/weekly")
async def get_weekly_energy(db: Session = Depends(get_db)):
    today = datetime.utcnow().date()
    week_ago = today - timedelta(days=6)
    
    start_time = datetime.combine(week_ago, datetime.min.time())
    
    dailies = db.query(DailyAggregate).filter(
        DailyAggregate.date >= start_time
    ).order_by(DailyAggregate.date).all()
    
    # Create result with all 7 days
    result = []
    for i in range(7):
        date = week_ago + timedelta(days=i)
        date_str = date.strftime("%Y-%m-%d")
        day_name = date.strftime("%a")
        
        # Find matching daily aggregate
        daily = next((d for d in dailies if d.date.date() == date), None)
        
        result.append({
            "date": date_str,
            "day": day_name,
            "generated": round(daily.total_energy_generated_wh, 0) if daily else 0,
            "consumed": round(daily.total_energy_consumed_wh, 0) if daily else 0
        })
    
    return result

@app.get("/api/battery/status")
async def get_battery_status(db: Session = Depends(get_db)):
    status = db.query(SystemStatus).filter(SystemStatus.id == 1).first()
    if not status:
        raise HTTPException(status_code=404, detail="Battery status not found")
    
    return {
        "voltage": status.system_voltage,
        "percentage": status.battery_percentage,
        "charge_rate": status.charge_rate,
        "discharge_rate": status.discharge_rate,
        "estimated_runtime_hours": status.estimated_runtime,
        "low_battery_warning": status.low_battery_warning,
        "is_charging": status.charge_rate > 0,
        "capacity_ah": Config.BATTERY_CAPACITY_AH
    }

@app.get("/api/crank/status")
async def get_crank_status(db: Session = Depends(get_db)):
    status = db.query(SystemStatus).filter(SystemStatus.id == 1).first()
    
    # Get today's contribution
    today = datetime.utcnow().date()
    today_start = datetime.combine(today, datetime.min.time())
    
    daily = db.query(DailyAggregate).filter(
        DailyAggregate.date == today_start
    ).first()
    
    return {
        "is_active": status.is_crank_active if status else False,
        "contribution_today_percent": daily.crank_contribution_percent if daily else 0,
        "total_duration_seconds": daily.total_crank_duration_seconds if daily else 0,
        "detection_threshold_voltage": Config.CRANK_VOLTAGE_THRESHOLD
    }

# API Key Security
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def verify_admin_api_key(api_key: str = Security(api_key_header)):
    """Verify admin API key for protected endpoints."""
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Missing API key. Provide X-API-Key header."
        )
    
    expected_key = os.getenv("ADMIN_API_KEY")
    if not expected_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server misconfiguration: ADMIN_API_KEY not set"
        )
    
    if api_key != expected_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API key"
        )
    return api_key

@app.delete("/api/data/cleanup")
async def cleanup_old_data(api_key: str = Depends(verify_admin_api_key), db: Session = Depends(get_db)):
    """Delete sensor readings older than retention period. Requires ADMIN_API_KEY."""
    cutoff_date = datetime.utcnow() - timedelta(days=Config.DATA_RETENTION_DAYS)
    
    deleted = db.query(SensorReading).filter(
        SensorReading.timestamp < cutoff_date
    ).delete()
    
    db.commit()
    
    return {
        "status": "success",
        "deleted_readings": deleted,
        "cutoff_date": cutoff_date.isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host = os.getenv("HOST", "0.0.0.0"),
        port = int(os.getenv("PORT", "8000")),
        reload = Config.DEBUG  # Only reload in development
    )