// src/data/complaints.js
export const mockCitizen = {
  name: "Demo User",
  aadhaarVerified: false, // since demo
};

export const mockComplaints = [
  {
    id: 1,
    type: "Garbage",
    status: "Resolved",
    department: "Cleanliness",
    photo: "/assets/mock-garbage.jpg",
    location: "Ward 12",
  },
  {
    id: 2,
    type: "Road Damage",
    status: "In Progress",
    department: "Public Works",
    photo: "/assets/mock-road.jpg",
    location: "Ward 5",
  },
  {
    id: 3,
    type: "Street Light",
    status: "Pending",
    department: "Electricity",
    photo: "/assets/mock-light.jpg",
    location: "Ward 7",
  },
];
