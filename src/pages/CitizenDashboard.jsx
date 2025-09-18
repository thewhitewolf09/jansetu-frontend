import { useState, useEffect } from "react";
import ReportIssueSection from "../components/ReportIssueSection";
import { useAuth } from "../context/useAuth";
import {
  MapPin,
  Star,
  BadgeCheck,
  Bell,
  Users,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";

function CitizenDashboard() {
  const { user } = useAuth();

  // State for complaint form
  const [form, setForm] = useState({
    category: "",
    description: "",
    file: null,
    audioFile: null,
    location: null,
  });

  const [nearbyComplaints, setNearbyComplaints] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);

  // ✅ Submit complaint to backend
  const handleSubmitComplaint = async () => {
    try {
      const formData = new FormData();
      formData.append("citizenId", user._id);
      formData.append("category", form.category);
      formData.append("description", form.description || "");
      formData.append("lat", form.location?.lat);
      formData.append("lng", form.location?.lng);
      formData.append("address", form.location?.address || "");

      if (form.file) formData.append("photo", form.file);
      if (form.audioFile) formData.append("audio", form.audioFile);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/complaints`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("✅ Complaint submitted successfully!");
      setForm({
        category: "",
        description: "",
        file: null,
        audioFile: null,
        location: null,
      });

      fetchMyComplaints(); // refresh my complaints
      fetchNearbyComplaints(); // refresh nearby complaints
    } catch (err) {
      console.error("Error submitting complaint:", err);
      alert("❌ Failed to submit complaint");
    }
  };

  // ✅ Fetch nearby complaints
  const fetchNearbyComplaints = async () => {
    try {
      if (!form.location) return;
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/complaints/nearby`,
        {
          params: {
            lat: form.location.lat,
            lng: form.location.lng,
            radius: 2, // km
          },
        }
      );
      setNearbyComplaints(res.data);
    } catch (err) {
      console.error("Error fetching nearby complaints:", err);
    }
  };

  // ✅ Fetch my complaints
  const fetchMyComplaints = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/complaints/mine`,
        { params: { citizenId: user._id } }
      );
      console.log("My complaints:", res.data);
      setMyComplaints(res.data);
    } catch (err) {
      console.error("Error fetching my complaints:", err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchMyComplaints();
      fetchNearbyComplaints();
    }
  }, [user]);

  const statusColors = {
    pending: "bg-orange-100 text-orange-700",
    "in-progress": "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700",
  };

  const badges = [
    { id: 1, label: "Cleanliness Champion", icon: "🧹" },
    { id: 2, label: "Water Saver", icon: "💧" },
    { id: 3, label: "Active Citizen", icon: "👥" },
  ];

  return (
    <div className="relative p-4 space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-md p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex flex-wrap items-center gap-2">
            {user?.name || "Demo User"}
            {user?.aadhaarVerified ? (
              <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <BadgeCheck className="w-4 h-4" /> Aadhaar Verified
              </span>
            ) : (
              <span className="text-orange-500 text-sm font-medium">
                ⚡ Demo Mode
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-500">Citizen Dashboard</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-5 h-5 fill-yellow-400" />
            <span className="font-semibold">120 pts</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {badges.map((b) => (
              <span
                key={b.id}
                className="px-2 py-1 text-xs bg-white border rounded-full shadow-sm"
              >
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Report Issue */}
      <ReportIssueSection
        handleSubmitComplaint={handleSubmitComplaint}
        form={form}
        setForm={setForm}
        nearbyComplaints={nearbyComplaints}
      />

      {/* Complaints */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          Track My Complaints
        </h3>
        <div className="space-y-6">
          {myComplaints.length > 0 ? (
            myComplaints.map((c) => {
              // Map status to progress steps
              const steps = [
                "Reported",
                "Acknowledged",
                "In Progress",
                "Resolved",
              ];

              let completedSteps = [];

              if (c.status === "pending") {
                completedSteps = ["Reported"];
              } else if (c.status === "in-progress") {
                completedSteps = ["Reported", "Acknowledged", "In Progress"];
              } else if (c.status === "resolved") {
                completedSteps = steps;
              }

              return (
                <div
                  key={c._id}
                  className="bg-gray-50 rounded-lg p-4 shadow-sm flex flex-col gap-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {c.photoUrl && (
                        <img
                          src={`${import.meta.env.VITE_API_URL}${c.photoUrl}`}
                          alt={c.category}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-800 capitalize">
                          {c.category}
                        </p>
                        <p className="text-xs text-gray-500">
                          {c.description || "No description"}
                        </p>
                        {c.audioUrl && (
                          <audio
                            controls
                            src={`${import.meta.env.VITE_API_URL}${c.audioUrl}`}
                            className="mt-2 w-40"
                          />
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full self-start sm:self-auto ${
                        statusColors[c.status]
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  {/* Progress timeline */}
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    {steps.map((step, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 min-w-fit"
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            completedSteps.includes(step)
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span>{step}</span>
                        {i < steps.length - 1 && (
                          <span className="w-6 h-0.5 bg-gray-300 hidden sm:inline"></span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Location */}
                  {c.location?.coordinates?.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>
                        Lat: {c.location.coordinates[1].toFixed(4)} | Lng:{" "}
                        {c.location.coordinates[0].toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm">No complaints yet.</p>
          )}
        </div>
      </div>

      {/* Community */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Community</h3>

        <div className="space-y-4">
          {/* Nearby Issues */}
          <div className="flex flex-row justify-between sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="truncate">
                {nearbyComplaints.length} issues near you
              </span>
            </span>
            <button
              className="text-sm sm:text-base text-blue-600 hover:underline"
              onClick={fetchNearbyComplaints}
            >
              Refresh
            </button>
          </div>

          {/* Alerts */}
          <div className="flex flex-row justify-between sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
              <Bell className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="truncate">Neighborhood Alerts</span>
            </span>
            <button className="text-sm sm:text-base text-blue-600 hover:underline">
              Subscribe
            </button>
          </div>

          {/* Support Complaints */}
          <div className="flex flex-row justify-between sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
              <Users className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="truncate">Support others’ complaints</span>
            </span>
            <button className="text-sm sm:text-base text-blue-600 hover:underline">
              Vote Now
            </button>
          </div>
        </div>
      </div>

      {/* Floating Emergency Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center justify-center transition">
        <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8" />
      </button>
    </div>
  );
}

export default CitizenDashboard;
