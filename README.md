# 🔮 ProphecyAI: Advanced Real Estate & Spatial Intelligence Platform

ProphecyAI is an intelligent, full-stack real estate application that leverages machine learning and GIS satellite data to predict property prices, analyze environmental risks, and identify high-yield investment corridors. 

## 🚀 Features

*   **📊 XGBoost Price Prediction:** Real-time spatial decision tree modeling to forecast future property valuations (2028-2032) based on area, property type, and geographical coordinates.
*   **🛰️ GIS Multispectral Satellite Analysis:** High-resolution spatial mapping utilizing Esri World Imagery to track urban heat islands, built-up growth, and vegetation indices.
*   **🛡️ Environmental Risk Audits:** Automated compliance verification against flood zones, seismic parameters, and eco-sensitive land regulations.
*   **🔍 Live Property Market Index:** Search real-world properties across major Indian cities and calculate forward profit projections.
*   **💡 Investment Insights:** AI-driven trend forecasting based on upcoming transit expansions and municipal master plans.

---

## 💻 Technology Stack

### **Frontend (Client-Side)**
*   **React.js (Vite):** Fast, component-based user interface.
*   **React-Leaflet:** Interactive, responsive web mapping.
*   **Recharts:** Dynamic data visualization and charting.
*   **Lucide React:** Modern, scalable UI iconography.
*   **CSS3 Flexbox/Grid:** Custom, fully responsive dark-mode dashboard layout.
*   **Deployment:** Vercel

### **Backend (Server-Side & API)**
*   **Python:** Core backend processing logic.
*   **FastAPI:** High-performance async API framework handling prediction requests.
*   **Deployment:** Render

### **Machine Learning & AI**
*   **XGBoost (Extreme Gradient Boosting):** The core spatial decision tree model powering the price prediction engine.
*   **Hyperparameter Tuning:** Dynamic UI controls adjusting the number of estimators (trees) and max tree depth on the fly.
*   **Evaluation Metrics R² & MAE:** Evaluated against 14,200+ urban property benchmarks for high accuracy modeling.
*   **Geocoding APIs:** OpenStreetMap Nominatim API for precise latitude/longitude coordinate conversion.

---

## 📸 Output Samples & Dashboard Previews

Check out the dashboard in action! Below are sample screenshots of the live platform, model training studio, and spatial analysis tools.

*   ![Dashboard Sample 1](./Output%20samples/Sample%201.png)
*   ![Dashboard Sample 2](./Output%20samples/Sample%202.png)
*   ![Dashboard Sample 3](./Output%20samples/Sample%203.png)

---

## ⚙️ Getting Started (Run Locally)

### 1. Clone the repository
```bash
git clone [https://github.com/tripathipravardhan/ProphecyAI.git](https://github.com/tripathipravardhan/ProphecyAI.git)
cd ProphecyAI
```

2. Start the Frontend
Bash
cd react-frontend
npm install
npm run dev

3. Start the Backend (FastAPI)
Ensure you have Python installed and your virtual environment activated.

Bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

📝 License
This project is licensed under the MIT License.


### How to push this update:
Once you have pasted this into your `README.md` in VS Code, run your final terminal commands:
```bash
git add README.md
git commit -m "Update README with accurate image links and tech stack"
git push origin main
