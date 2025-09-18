// src/pages/AuthorityDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  UserCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import ComplaintHeatmap from "../components/ComplaintHeatmap";
import PerformanceLeaderboard from "../components/PerformanceLeaderboard";
import EscalationList from "../components/EscalationList";

function AuthorityDashboard() {
  const { user } = useAuth();

  const officer = user || {
    name: "Demo Officer",
    department: "Demo Department",
    email: "demo@jansetu.gov",
  };

  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    severity: "",
    urgency: "",
  });
  const [stats, setStats] = useState({ pending: 0, today: 0, resolved: 0 });

  // AI Mock Analyzer → classify severity & urgency + explain
  const analyzeComplaint = (c) => {
    let severity = "Low";
    let urgency = "Normal";
    let analysisNote = "Normal issue";

    if (/accident|fire|flood|danger|blocked/i.test(c.description)) {
      severity = "High";
      urgency = "Urgent";
      analysisNote = "🚨 Critical keywords detected (accident/fire/etc.)";
    } else if (/leakage|broken|overflow|garbage/i.test(c.description)) {
      severity = "Medium";
      analysisNote = "⚠️ Infrastructure issue (leakage/broken/garbage)";
    }

    // Time-based urgency boost
    const hoursOpen = (new Date() - new Date(c.createdAt)) / (1000 * 60 * 60);
    if (hoursOpen > 24 && c.status !== "resolved") {
      urgency = "Urgent";
      analysisNote = "⏰ Open > 24 hrs → escalated urgency";
    }

    return { ...c, severity, urgency, analysisNote };
  };

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/complaints`
      );

      const enriched = res.data.map(analyzeComplaint);
      setComplaints(enriched);

      // Quick stats
      const today = new Date().toDateString();
      const pending = enriched.filter((c) => c.status === "pending").length;
      const resolved = enriched.filter((c) => c.status === "resolved").length;
      const todayCount = enriched.filter(
        (c) => new Date(c.createdAt).toDateString() === today
      ).length;

      setStats({ pending, resolved, today: todayCount });
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Update complaint status
  const updateComplaint = async (id, status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/complaints/${id}/status`,
        { status, assignedTo: user._id }
      );
      fetchComplaints();
    } catch (err) {
      console.error("Error updating complaint:", err);
    }
  };

  // Apply filters
  const filteredComplaints = complaints.filter(
    (c) =>
      (!filters.category || c.category === filters.category) &&
      (!filters.status || c.status === filters.status) &&
      (!filters.severity || c.severity === filters.severity) &&
      (!filters.urgency || c.urgency === filters.urgency)
  );

  const statusColors = {
    pending: "bg-orange-100 text-orange-700",
    "in-progress": "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700",
  };

  const severityColors = {
    High: "text-red-600 font-bold",
    Medium: "text-yellow-600 font-semibold",
    Low: "text-gray-600",
  };

  const urgencyColors = {
    Urgent: "bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs",
    Normal: "bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs",
  };

  return (
    <div className="space-y-6 p-4">
      {/* Officer Header */}
      <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{officer.department}</h2>
          <p className="text-sm text-gray-500">
            Logged in as {officer.name} ({officer.email})
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-orange-100 text-orange-800 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{stats.pending}</p>
          <p>Pending</p>
        </div>
        <div className="bg-blue-100 text-blue-800 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{stats.today}</p>
          <p>Incoming Today</p>
        </div>
        <div className="bg-green-100 text-green-800 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{stats.resolved}</p>
          <p>Resolved</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-gray-600" />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="road">Road</option>
          <option value="garbage">Garbage</option>
          <option value="water">Water</option>
          <option value="other">Other</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          value={filters.severity}
          onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Severity</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={filters.urgency}
          onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Urgency</option>
          <option value="Urgent">Urgent</option>
          <option value="Normal">Normal</option>
        </select>
      </div>

      {/* Complaints Table */}
      <div className="bg-white shadow rounded-lg p-4">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[800px]">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="p-2">Category</th>
                <th className="p-2">Description</th>
                <th className="p-2">Citizen</th>
                <th className="p-2">Severity</th>
                <th className="p-2">Urgency</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((c) => (
                <tr key={c._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 capitalize">{c.category}</td>
                  <td className="p-2">
                    <p>{c.description || "-"}</p>
                    <p className="text-xs text-gray-500 italic mt-1">
                      {c.analysisNote}
                    </p>
                  </td>
                  <td className="p-2">{c.citizen?.name || "Anonymous"}</td>
                  <td className={`p-2 ${severityColors[c.severity]}`}>
                    {c.severity}
                  </td>
                  <td className="p-2">
                    <span className={urgencyColors[c.urgency]}>
                      <Zap className="w-3 h-3 inline mr-1" />
                      {c.urgency}
                    </span>
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[c.status]
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2">
                    {c.status === "pending" && (
                      <button
                        onClick={() => updateComplaint(c._id, "in-progress")}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded flex items-center gap-1 hover:bg-blue-700 cursor-pointer"
                      >
                        <UserCheck className="w-3 h-3" /> Assign Task
                      </button>
                    )}

                    {c.status === "in-progress" && (
                      <button
                        onClick={() => updateComplaint(c._id, "resolved")}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded flex items-center gap-1 hover:bg-green-700 cursor-pointer"
                      >
                        <CheckCircle className="w-3 h-3" /> Mark Resolved
                      </button>
                    )}

                    {c.status === "resolved" && (
                      <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Successfully
                        Resolved
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredComplaints.map((c) => (
            <div key={c._id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="capitalize font-semibold">{c.category}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[c.status]
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <p className="text-sm mb-2">{c.description || "-"}</p>
              <p className="text-xs text-gray-500 italic mb-2">
                {c.analysisNote}
              </p>
              <p className="text-xs text-gray-700 mb-1">
                👤 {c.citizen?.name || "Anonymous"}
              </p>
              <p className={`text-xs mb-1 ${severityColors[c.severity]}`}>
                🔥 Severity: {c.severity}
              </p>
              <p className="text-xs mb-2">
                <span className={urgencyColors[c.urgency]}>
                  <Zap className="w-3 h-3 inline mr-1" />
                  {c.urgency}
                </span>
              </p>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {c.status === "pending" && (
                  <button
                    onClick={() => updateComplaint(c._id, "in-progress")}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded flex items-center gap-1 hover:bg-blue-700 cursor-pointer"
                  >
                    <UserCheck className="w-3 h-3" /> Assign Task
                  </button>
                )}

                {c.status === "in-progress" && (
                  <button
                    onClick={() => updateComplaint(c._id, "resolved")}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded flex items-center gap-1 hover:bg-green-700 cursor-pointer"
                  >
                    <CheckCircle className="w-3 h-3" /> Mark Resolved
                  </button>
                )}

                {c.status === "resolved" && (
                  <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Successfully Resolved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredComplaints.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            No complaints match filters.
          </p>
        )}
      </div>

      {/* Map + Performance placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" /> Complaints Heatmap
          </h3>
          <ComplaintHeatmap complaints={complaints} />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-500" /> Performance Leaderboard
          </h3>
          <PerformanceLeaderboard complaints={complaints} />
        </div>
      </div>

      {/* Escalation Workflow Placeholder */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" /> Escalations
        </h3>
        <EscalationList complaints={complaints} />
      </div>
    </div>
  );
}

export default AuthorityDashboard;
