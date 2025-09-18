function EscalationList({ complaints }) {
  const escalated = complaints.filter((c) => {
    if (c.status === "resolved") return false;
    const hoursOpen = (new Date() - new Date(c.createdAt)) / (1000 * 60 * 60);
    return hoursOpen > 48; // SLA = 48 hours
  });

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {escalated.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {escalated.map((c) => (
            <li key={c._id} className="flex justify-between border-b pb-1">
              <span>
                {c.category} — {c.description.slice(0, 40)}...
              </span>
              <span className="text-red-600">
                {(new Date() - new Date(c.createdAt)) / (1000 * 60 * 60) | 0} hrs
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">✅ No escalations currently.</p>
      )}
    </div>
  );
}

export default EscalationList;
