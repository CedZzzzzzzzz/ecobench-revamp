# EcoBench

EcoBench is a sustainable smart bench system developed for the Polytechnic University of the Philippines - Institute of Technology. It combines solar panel power generation, a manual hand-crank generator, ergonomic seating, and USB device charging into a single installation. This repository contains the web-based monitoring and management system built to display real-time energy data and system status.

## Overview

The monitoring system connects to an IoT backend that reads sensor data from the physical bench hardware. Administrators can sign in to access a live dashboard showing power generation metrics, battery status, charging port availability, and environmental impact statistics. The public-facing site provides information about the project, the team, and how to use the bench.

## Features

- Real-time dashboard with live sensor polling every 5 seconds
- Solar panel and hand-crank power source monitoring
- Battery level, charge rate, discharge rate, and runtime estimates
- USB charging port status display (4 ports)
- Production analytics including daily and weekly energy totals, uptime, and efficiency
- Environmental impact tracking (CO2 saved, tree equivalent, total energy generated)
- Admin-only dashboard protected by role-based authentication via Supabase
- User management panel for administrators
- Public pages: Home, About, FAQs, Contact

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Charts | Recharts |
| Authentication and database | Supabase |
| Backend API | FastAPI (separate service) |
| Deployment | Vercel |
| Analytics | Vercel Analytics |

## Project Structure

```
src/
  App.jsx              # Root component and route definitions
  main.jsx             # Application entry point
  pages/               # Full-page route components
    Landing.jsx
    Home.jsx
    About.jsx
    Contact.jsx
    FAQs.jsx
    SignIn.jsx
    SignUp.jsx
    Dashboard.jsx      # Admin-only monitoring dashboard
    Users.jsx          # Admin-only user management
  components/          # Reusable UI components
    Navbar.jsx
    Sidebar.jsx
    Footer.jsx
    BatteryStatus.jsx
    PowerMetrics.jsx
    ChargingPorts.jsx
    ProductionChart.jsx
    SystemStatus.jsx
  hooks/
    useSensorData.js   # Polls the FastAPI backend every 5 seconds
  lib/
    supabase.js        # Supabase client initialization
  data/
    siteData.js        # Static content: team members, FAQs, features, contact info
  styles/              # Component-specific CSS files
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Supabase project with a `profiles` table containing a `role` column
- A running FastAPI backend exposing `/api/status/current`

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000
```

`VITE_API_URL` defaults to `http://localhost:8000` if not set.

### Development

```bash
npm run dev
```

The development server starts on port 3000.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Authentication and Access Control

The sign-in page is the default route (`/`). After authentication, users are redirected based on their role. The `/dashboard` and `/users` routes are protected by the `AdminRoute` component, which checks the `role` field in the `profiles` table in Supabase. Users without the `admin` role are redirected to the home page.

## Backend API

The dashboard expects a FastAPI service running at the URL defined by `VITE_API_URL`. The endpoint `/api/status/current` must return a JSON object with the following fields:

| Field | Description |
|---|---|
| `battery_percentage` | Current battery level (0-100) |
| `total_incoming_watts` | Total power coming in from all sources |
| `system_voltage` | System voltage in volts |
| `charge_rate` | Current charge rate in amperes |
| `discharge_rate` | Current discharge rate in amperes |
| `estimated_runtime` | Estimated runtime in hours |
| `is_crank_active` | Boolean indicating if the hand crank is in use |
| `low_battery_warning` | Boolean for low battery threshold alert |
| `status` | System status string (e.g., "ONLINE") |
| `crank_power` | Power output from the hand crank in watts |
| `energy_balance` | Net energy balance |
| `last_update` | Timestamp of the last sensor reading |

## Team

| Name | Role |
|---|---|
| Marcus Cedric S. Pedrosa | Monitoring System Developer and Hardware Engineer |
| Audrey Nicole Q. Mesa | Project Lead and UI/UX Designer |
| Jigs C. Lactao | Backend Developer and Electrical Engineer |
| Mariem O. Manato | System Architect and Electrical Engineer |
| Quinn Harvey G. Pineda | Project Coordinator and Technical Specialist |

