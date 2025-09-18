# 🏛️ JanSetu Frontend

A modern React + Vite web app for the JanSetu platform, enabling citizens and authorities to manage complaints, view analytics, and promote transparency.

---

## 🚀 Features

- **Citizen Portal**
    - Submit complaints (text, photo, audio)
    - Geotagging (location support)
    - Track complaint status
- **Authority Dashboard**
    - View and filter complaints
    - AI-based severity & urgency tagging
    - Update complaint status
    - Heatmap & performance leaderboard
    - Escalation tracking
- **Public Analytics**
    - Monthly report/resolution graphs
    - Live heatmap
    - Department leaderboard
    - Complaint counters
- **Multi-Language Support**
    - Google Translate widget
- **Responsive UI**
    - Mobile-first design (Tailwind CSS)

---

## 🛠️ Tech Stack

- React 18 + Vite
- Tailwind CSS
- Axios
- React Router v6
- Lucide React (icons)
- Recharts (charts)
- React Leaflet + Leaflet.heat (maps)
- Google Translate Widget

---

## 📂 Project Structure

```
src/
├── assets/              # Images & icons
├── components/          # UI components
├── context/             # Auth context
├── pages/               # App screens
├── App.jsx              # Routes
└── main.jsx             # Entry point
```

---

## ⚙️ Getting Started

1. **Clone the repo**
     ```bash
     git clone https://github.com/your-repo/jansetu-frontend.git
     cd jansetu-frontend
     ```
2. **Install dependencies**
     ```bash
     npm install
     ```
3. **Configure environment**
     Create `.env` in root:
     ```
     VITE_API_URL=http://localhost:5000
     ```
     For production, use your backend URL.
4. **Run locally**
     ```bash
     npm run dev
     ```
     App runs at [http://localhost:5173](http://localhost:5173).
5. **Build for production**
     ```bash
     npm run build
     ```

---

## 🔗 API Endpoints

- `POST /api/complaints` — Create complaint
- `GET /api/complaints/mine?citizenId=...` — Citizen complaints
- `GET /api/complaints` — Authority: all complaints
- `PATCH /api/complaints/:id/status` — Update status
- `GET /api/complaints/nearby?lat=..&lng=..` — Nearby complaints

---

## 📦 Deployment

Deploy on **Vercel**, **Netlify**, or **Render**.  
Set `VITE_API_URL` to your backend endpoint.

---

## 🧑‍💻 Contributing

- Fork the repo
- Create a branch: `git checkout -b feature-xyz`
- Commit: `git commit -m "Add xyz"`
- Push: `git push origin feature-xyz`
- Open a Pull Request

---

## 📜 License

MIT License © JanSetu Project Team

