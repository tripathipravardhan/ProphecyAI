# 🔮 ProphecyAI — AI-Powered Property & Spatial Intelligence Platform

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.12+-3776AB?logo=python)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)
![License](https://img.shields.io/badge/License-MIT-green.svg)

ProphecyAI is an advanced, full-stack spatial property intelligence application designed for India. It integrates machine learning valuation engines, GIS satellite imagery, spatial distance web graph networks, and IS 1893 environmental risk models to provide real-time suitability scoring and forward investment projections.

---

## 🚀 Key Features

*   **✨ Aceternity UI Hero Backdrop:** Animated subtle **Spotlight** radial glow and **Background Beams** ray paths strictly engineered behind the left hero section.
*   **🛰️ High-Definition Satellite Hybrid Mapping:** Interactive Leaflet GIS maps built on Esri World Imagery combined with Carto Voyager place, village, street, and highway name overlays, equipped with a seamless **Satellite / Street** toggle.
*   **📊 Dynamic Factor Analysis & Distance Breakdown:** Clickable factor cards (**Connectivity**, **Healthcare**, **Education**, **Daily Life**, **Environment**) that expand to show individual facility distance breakdowns (e.g. *Metro Station — 1.2 km*, *Hospital — 0.9 km*).
*   **🛡️ IS 1893 Seismic & Hydrological Risk Engine:** Automated environmental vulnerability audits mapping locations against Bureau of Indian Standards (IS 1893:2016) seismic zones (Zones II to V) and hydrological river catchment proximity.
*   **📈 Predictive Valuation Modeling:** Forward valuation forecasting (2028–2032 estimates) based on area, property type, and coordinate bounding boxes.
*   **🌐 3D Spatial Explorer:** Contextual 3D web connector lines mapping amenity nodes directly to property locations.
*   **✉️ Direct Support & Account Avatar:** Integrated Gmail web compose support button for `pravardhantripathi@gmail.com` and dynamic account initial avatar symbol badge.

---

## 📸 Output & Dashboard Samples

### 1. Hero Landing Page (Spotlight & Background Beams)
![Hero Landing Page](./Output%20samples/sample_1_hero_overview.png)

### 2. Property Valuation & Investment Projections
![Property Intelligence Report](./Output%20samples/sample_2_property_value.png)

### 3. Spatial Context (Satellite Hybrid Map & Factor Analysis)
![Spatial Context & Satellite Map](./Output%20samples/sample_3_spatial_context.png)

### 4. 3D Spatial Explorer & Web Context Visualizer
![3D Spatial Explorer](./Output%20samples/sample_4_3d_spatial_explorer.png)

---

## 💻 Architecture & Technology Stack

### **Frontend**
- **Framework:** React 19 + Vite 8
- **Mapping:** Leaflet & React-Leaflet (Esri World Imagery + Carto Hybrid Overlay)
- **Visuals & Motion:** Framer Motion (Spotlight & Background Beams), Recharts, Lucide Icons
- **Routing:** React Router DOM 7

### **Backend & Machine Learning**
- **Framework:** Python 3.12 + FastAPI (Uvicorn async server)
- **Spatial Analysis:** Overpass API (OpenStreetMap GIS queries), Nominatim Geocoding
- **Risk Assessment:** Bureau of Indian Standards IS 1893:2016 Seismic Matrix & Hydrological Proximity Rules

---

## ⚙️ Getting Started (Local Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/tripathipravardhan/ProphecyAI.git
cd ProphecyAI
```

### 2. Start the Frontend (Vite App)
```bash
cd react-frontend
npm install
npm run dev
```
*Access the application at `http://localhost:5173`*

### 3. Start the Backend Engine (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*API endpoints active at `http://127.0.0.1:8000`*

---

## 🤝 Support & Contact

If you have questions, feedback, or need support, feel free to reach out directly:
- **Email:** [pravardhantripathi@gmail.com](mailto:pravardhantripathi@gmail.com?subject=ProphecyAI%20Query)
- **GitHub:** [@tripathipravardhan](https://github.com/tripathipravardhan)

---

## 📝 License

Distributed under the MIT License.
