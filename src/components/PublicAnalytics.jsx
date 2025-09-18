// src/components/PublicAnalytics.jsx
import { useEffect, useState } from "react";
import { BarChart3, Map as MapIcon, Award } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import ComplaintHeatmap from "./ComplaintHeatmap";

function PublicAnalytics() {
  const [stats, setStats] = useState({
    reported: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [complaints, setComplaints] = useState([]);

  // Fetch all complaints
  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/complaints`
      );
      const data = res.data;
      setComplaints(data);

      // Counters
      const reported = data.length;
      const inProgress = data.filter((c) => c.status === "in-progress").length;
      const resolved = data.filter((c) => c.status === "resolved").length;
      setStats({ reported, inProgress, resolved });

      // Monthly Data
      const grouped = {};
      data.forEach((c) => {
        const month = new Date(c.createdAt).toLocaleString("default", {
          month: "short",
        });
        if (!grouped[month])
          grouped[month] = { month, reported: 0, resolved: 0 };
        grouped[month].reported++;
        if (c.status === "resolved") grouped[month].resolved++;
      });
      setMonthlyData(Object.values(grouped));

      // Leaderboard
      const departments = {};
      data.forEach((c) => {
        if (!c.assignedTo?.department) return;
        const dept = c.assignedTo.department;
        if (!departments[dept]) {
          departments[dept] = { total: 0, resolved: 0, totalTime: 0 };
        }
        departments[dept].total++;
        if (c.status === "resolved") {
          departments[dept].resolved++;
          const created = new Date(c.createdAt);
          const resolvedAt = new Date(c.updatedAt);
          departments[dept].totalTime +=
            (resolvedAt - created) / (1000 * 60 * 60); // hours
        }
      });

      const leaderboardArr = Object.entries(departments).map(([dept, d]) => ({
        dept,
        score: Math.round((d.resolved / d.total) * 100),
        avgTime: d.resolved ? (d.totalTime / d.resolved).toFixed(1) : "N/A",
      }));

      setLeaderboard(leaderboardArr.sort((a, b) => b.score - a.score));
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <section className="bg-white shadow-lg rounded-2xl p-8 mt-12">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        Public Transparency – Live Stats
      </h2>

      {/* Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 text-center">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow hover:shadow-md transition">
          <p className="text-4xl font-extrabold text-blue-700">
            {stats.reported}
          </p>
          <p className="text-sm text-gray-600">Reported</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow hover:shadow-md transition">
          <p className="text-4xl font-extrabold text-orange-600">
            {stats.inProgress}
          </p>
          <p className="text-sm text-gray-600">In Progress</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow hover:shadow-md transition">
          <p className="text-4xl font-extrabold text-green-600">
            {stats.resolved}
          </p>
          <p className="text-sm text-gray-600">Resolved</p>
        </div>
      </div>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Monthly Graph */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4 text-gray-700 w-full">
            <BarChart3 className="w-5 h-5" />
            <p className="font-semibold text-sm">Reported vs Resolved</p>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: "8px" }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="reported"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-48 w-full">
              <p className="text-gray-500 text-sm">📉 No data available yet</p>
            </div>
          )}
        </div>

        {/* Heatmap */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-700">
            <MapIcon className="w-5 h-5" />
            <p className="font-semibold text-sm">Complaint Density Heatmap</p>
          </div>
          {complaints.length > 0 ? (
            <ComplaintHeatmap complaints={complaints} />
          ) : (
            <div className="flex justify-center items-center h-48 w-full">
              <p className="text-gray-500 text-sm">
                🌍 No complaint data to display
              </p>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-500" />
            <p className="font-semibold text-gray-700 text-sm">
              Department Leaderboard
            </p>
          </div>
          {leaderboard.length > 0 ? (
            <div className="space-y-4">
              {leaderboard.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="flex justify-between text-sm mb-1">
                    <span
                      className={`font-medium ${
                        idx === 0
                          ? "text-green-700"
                          : idx === leaderboard.length - 1
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      {idx === 0 && "🥇 "}
                      {idx === 1 && "🥈 "}
                      {idx === 2 && "🥉 "}
                      {idx === leaderboard.length - 1 && "⚠ "}
                      {item.dept}
                    </span>
                    <span>{item.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 ${
                        idx === 0
                          ? "bg-green-500"
                          : idx === leaderboard.length - 1
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    ⏱ Avg. Resolution Time: {item.avgTime} hrs
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-32 w-full">
              <p className="text-gray-500 text-sm">
                🏆 No departments ranked yet
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600">
        Trust through transparency – every citizen can see progress.
      </p>
    </section>
  );
}

export default PublicAnalytics;
