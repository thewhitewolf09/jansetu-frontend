import { useState, useEffect, useRef } from "react";
import { Camera, Mic, Pencil, MapPin, AlertTriangle } from "lucide-react";

function ReportIssueSection({
  handleSubmitComplaint,
  form,
  setForm,
  nearbyComplaints,
}) {
  const [activeForm, setActiveForm] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);

  // Auto-fetch location
  useEffect(() => {
    if (activeForm) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setForm((prev) => ({
            ...prev,
            location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          })),
        (err) => console.warn("Location error:", err)
      );
    }
  }, [activeForm, setForm]);

  // Voice recording logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      let chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });

        // ✅ For playback (preview in UI)
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // ✅ For backend upload
        const audioFile = new File([blob], `recording-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        setForm((prev) => ({ ...prev, audioFile }));
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
      alert("Microphone access denied or unsupported browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Validation before submit
  const validateAndSubmit = () => {
    if (!form.category) return alert("⚠️ Please select a category");
    if (activeForm === "photo" && !form.file)
      return alert("⚠️ Please upload a photo");
    if (activeForm === "voice" && !audioUrl)
      return alert("⚠️ Please record your voice");
    if (
      (activeForm === "photo" ||
        activeForm === "voice" ||
        activeForm === "text") &&
      !form.description
    ) {
      return alert("⚠️ Please add a description");
    }
    if (!form.location) return alert("⚠️ Location not available yet");

    handleSubmitComplaint();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 space-y-6">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        Report an Issue
      </h3>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            key: "photo",
            label: "Upload Photo",
            color: "bg-green-600",
            icon: <Camera className="w-7 h-7" />,
          },
          {
            key: "voice",
            label: "Record Voice",
            color: "bg-indigo-600",
            icon: <Mic className="w-7 h-7" />,
          },
          {
            key: "text",
            label: "Write Text",
            color: "bg-blue-600",
            icon: <Pencil className="w-7 h-7" />,
          },
          {
            key: "nearby",
            label: "Nearby Issues",
            color: "bg-rose-600",
            icon: <MapPin className="w-7 h-7" />,
          },
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() =>
              setActiveForm(activeForm === btn.key ? null : btn.key)
            }
            className={`flex flex-col items-center justify-center gap-2 p-6 rounded-2xl shadow-lg transition ${
              activeForm === btn.key
                ? `${btn.color} brightness-110`
                : `${btn.color} hover:brightness-110`
            } text-white`}
          >
            {btn.icon}
            <span className="font-semibold text-sm">{btn.label}</span>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center sm:text-left">
        Auto-classification + GPS tagging happens in background.
      </p>

      {/* Accordion Sections */}
      {activeForm && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-4 animate-fadeIn">
          {/* Category */}
          {activeForm !== "nearby" && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Select Issue Type
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- Select Category --</option>
                <option value="road">🛣 Road</option>
                <option value="garbage">🗑 Garbage</option>
                <option value="water">💧 Water</option>
                <option value="other">❓ Other</option>
              </select>
            </div>
          )}

          {/* Photo Upload */}
          {activeForm === "photo" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Upload Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, file: e.target.files[0] }))
                  }
                  className="w-full border p-2 rounded-lg cursor-pointer bg-green-100 text-green-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700"
                />
              </div>
              <textarea
                placeholder="Write description..."
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </>
          )}

          {/* Voice Recording */}
          {activeForm === "voice" && (
            <>
              {!recording ? (
                <button
                  onClick={startRecording}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg shadow"
                >
                  🎤 Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg shadow"
                >
                  ⏹ Stop Recording
                </button>
              )}
              {audioUrl && (
                <audio controls src={audioUrl} className="w-full mt-2"></audio>
              )}
              <textarea
                placeholder="Add extra notes..."
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </>
          )}

          {/* Text Complaint */}
          {activeForm === "text" && (
            <textarea
              placeholder="Write your complaint here..."
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          )}

          {/* Nearby Issues */}
          {activeForm === "nearby" && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                Nearby Issues
              </h4>
              {nearbyComplaints?.length > 0 ? (
                <ul className="space-y-2">
                  {nearbyComplaints.map((c) => (
                    <li
                      key={c._id}
                      className="p-3 bg-white border rounded shadow-sm flex items-center justify-between"
                    >
                      <span>
                        {c.category} — {c.description}
                      </span>
                      <span className="text-xs text-gray-500">
                        {c.location?.lat.toFixed(3)},{" "}
                        {c.location?.lng.toFixed(3)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">
                  🚫 No nearby issues found.
                </p>
              )}
            </div>
          )}

          {/* Location */}
          {form.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="px-2 py-1 bg-blue-50 rounded">
                Lat: {form.location.lat.toFixed(4)} | Lng:{" "}
                {form.location.lng.toFixed(4)}
              </span>
            </div>
          )}

          {/* Submit */}
          {activeForm !== "nearby" && (
            <button
              onClick={validateAndSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg shadow font-medium"
            >
              Submit Complaint
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ReportIssueSection;
