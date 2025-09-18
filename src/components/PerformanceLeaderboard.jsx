import { Clock } from "lucide-react";

function PerformanceLeaderboard({ complaints }) {
  // Filter only resolved complaints
  const resolved = complaints.filter((c) => c.status === "resolved");

  const departments = {};

  resolved.forEach((c) => {
    if (!c.assignedTo?.department) return;
    const dept = c.assignedTo.department;

    const created = new Date(c.createdAt);
    const resolvedAt = new Date(c.updatedAt);
    const resolutionHours = (resolvedAt - created) / (1000 * 60 * 60);

    if (!departments[dept]) {
      departments[dept] = { totalTime: 0, count: 0 };
    }
    departments[dept].totalTime += resolutionHours;
    departments[dept].count += 1;
  });

  const leaderboard = Object.entries(departments)
    .map(([dept, data]) => ({
      dept,
      avgTime: (data.totalTime / data.count).toFixed(1),
    }))
    .sort((a, b) => a.avgTime - b.avgTime);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {leaderboard.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {leaderboard.map((l, i) => (
            <li
              key={i}
              className="flex items-center justify-between border-b pb-1"
            >
              <span>{i + 1}. {l.dept}</span>
              <span className="text-gray-600">{l.avgTime} hrs avg</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No resolved complaints yet.</p>
      )}
    </div>
  );
}

export default PerformanceLeaderboard;
