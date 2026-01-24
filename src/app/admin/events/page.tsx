"use client";
import React, { useState, useRef } from "react";
import useSWR from "swr";
import AdminNav from "@/components/admin/AdminNav";
import { useRouter } from "next/navigation";

type UpcomingEvent = {
  id?: number;
  title: string;
  date: string;
  time?: string;
  dateTBA?: boolean;
  venue?: string;
  location?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonUrl?: string;
  hidden?: boolean;
};

type PastEvent = {
  id?: number;
  title: string;
  date: string;
  venue?: string;
  location?: string;
  image?: string;
  gallery?: string;
  description?: string;
  hidden?: boolean;
};

type AdminEventsResponse = {
  ok: true;
  upcoming: UpcomingEvent[];
  past: PastEvent[];
} | {
  ok: false;
  error: string;
};

const fetcher = async (url: string) => {
  const r = await fetch(url, { credentials: "same-origin" });
  if (r.status === 401) {
    throw new Error("Unauthorized");
  }
  return r.json();
};

export default function EventsAdminPage() {
  const router = useRouter();
  const { data, mutate, isLoading, error } = useSWR<AdminEventsResponse>(
    "/api/events/admin",
    fetcher,
    { onError: (err) => { if (err.message === "Unauthorized") router.replace("/admin"); } }
  );

  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [editing, setEditing] = useState<UpcomingEvent | PastEvent | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const flash = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const defaultUpcoming: UpcomingEvent = {
    title: "",
    date: new Date().toISOString().slice(0, 10),
    time: "",
    dateTBA: false,
    venue: "",
    location: "",
    description: "",
    image: "",
    buttonText: "",
    buttonUrl: "",
    hidden: false,
  };

  const defaultPast: PastEvent = {
    title: "",
    date: new Date().toISOString().slice(0, 10),
    venue: "",
    location: "",
    image: "",
    gallery: "",
    description: "",
    hidden: false,
  };

  const handleNew = () => {
    setEditing(tab === "upcoming" ? { ...defaultUpcoming } : { ...defaultPast });
    setIsNew(true);
  };

  const handleEdit = (event: UpcomingEvent | PastEvent) => {
    setEditing({ ...event });
    setIsNew(false);
  };

  const handleCancel = () => {
    setEditing(null);
    setIsNew(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.ok) {
        setEditing({ ...editing, image: result.url });
        flash("success", "Image uploaded!");
      } else {
        flash("error", result.error || "Upload failed");
      }
    } catch {
      flash("error", "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);

    try {
      const res = await fetch("/api/events/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isNew ? "create" : "update",
          type: tab,
          data: editing,
        }),
      });

      const result = await res.json();
      if (result.ok) {
        flash("success", isNew ? "Event created!" : "Event updated!");
        mutate();
        handleCancel();
      } else {
        flash("error", result.error || "Save failed");
      }
    } catch {
      flash("error", "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch("/api/events/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          type: tab,
          data: { id },
        }),
      });

      const result = await res.json();
      if (result.ok) {
        flash("success", "Event deleted!");
        mutate();
      } else {
        flash("error", result.error || "Delete failed");
      }
    } catch {
      flash("error", "Delete failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-turkish-red border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error || !data?.ok) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Failed to load events. Please try again.
          </div>
        </div>
      </div>
    );
  }

  const events = tab === "upcoming" ? data.upcoming : data.past;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <button
            onClick={handleNew}
            className="bg-turkish-red text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            + Add {tab === "upcoming" ? "Upcoming" : "Past"} Event
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 px-4 py-3 rounded-lg ${message.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => { setTab("upcoming"); handleCancel(); }}
            className={`pb-3 px-1 font-medium transition-colors ${tab === "upcoming" ? "text-turkish-red border-b-2 border-turkish-red" : "text-gray-500 hover:text-gray-700"}`}
          >
            Upcoming ({data.upcoming.length})
          </button>
          <button
            onClick={() => { setTab("past"); handleCancel(); }}
            className={`pb-3 px-1 font-medium transition-colors ${tab === "past" ? "text-turkish-red border-b-2 border-turkish-red" : "text-gray-500 hover:text-gray-700"}`}
          >
            Past ({data.past.length})
          </button>
        </div>

        {/* Editor Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">{isNew ? "New" : "Edit"} {tab === "upcoming" ? "Upcoming" : "Past"} Event</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turkish-red focus:border-transparent"
                      placeholder="Event title"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                      <input
                        type="date"
                        value={editing.date}
                        onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turkish-red focus:border-transparent"
                      />
                    </div>
                    {tab === "upcoming" && "time" in editing && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input
                          type="text"
                          value={editing.time || ""}
                          onChange={(e) => setEditing({ ...editing, time: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turkish-red focus:border-transparent"
                          placeholder="e.g., 19:00"
                        />
                      </div>
                    )}
                  </div>

                  {tab === "upcoming" && "dateTBA" in editing && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="dateTBA"
                        checked={editing.dateTBA || false}
                        onChange={(e) => setEditing({ ...editing, dateTBA: e.target.checked })}
                        className="h-4 w-4 text-turkish-red focus:ring-turkish-red border-gray-300 rounded"
                      />
                      <label htmlFor="dateTBA" className="text-sm text-gray-700">Date TBA</label>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                      <input
                        type="text"
                        value={editing.venue || ""}
                        onChange={(e) => setEditing({ ...editing, venue: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turkish-red focus:border-transparent"
                        placeholder="e.g., Vrijhof"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={editing.location || ""}
                        onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turkish-red focus:border-transparent"
                        placeholder="e.g., University of Twente"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editing.description || ""}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turkish-red focus:border-transparent"
                      placeholder="Event description..."
                    />
                  </div>

                  {tab === "upcoming" && "buttonText" in editing && (
                    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                      <p className="text-sm font-medium text-gray-700">Action Button (optional)</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Button Text (max 30 chars)</label>
                          <input
                            type="text"
                            value={editing.buttonText || ""}
                            onChange={(e) => setEditing({ ...editing, buttonText: e.target.value.slice(0, 30) })}
                            maxLength={30}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turkish-red focus:border-transparent"
                            placeholder="e.g., Get Tickets, RSVP"
                          />
                          <p className="text-xs text-gray-400 mt-1">{(editing.buttonText?.length || 0)}/30</p>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Button URL</label>
                          <input
                            type="url"
                            value={editing.buttonUrl || ""}
                            onChange={(e) => setEditing({ ...editing, buttonUrl: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turkish-red focus:border-transparent"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                      {editing.buttonText && !editing.buttonUrl && (
                        <p className="text-xs text-amber-600">⚠️ Add a URL for the button to work</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editing.image || ""}
                        onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turkish-red focus:border-transparent"
                        placeholder="Image URL or upload"
                      />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        {uploading ? "..." : "Upload"}
                      </button>
                    </div>
                    {editing.image && (
                      <div className="mt-2">
                        <img src={editing.image} alt="Preview" className="h-32 w-auto rounded-lg object-cover" />
                      </div>
                    )}
                  </div>

                  {tab === "past" && "gallery" in editing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gallery (comma-separated URLs)</label>
                      <textarea
                        value={editing.gallery || ""}
                        onChange={(e) => setEditing({ ...editing, gallery: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turkish-red focus:border-transparent"
                        placeholder="https://..., https://..."
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hidden"
                      checked={editing.hidden || false}
                      onChange={(e) => setEditing({ ...editing, hidden: e.target.checked })}
                      className="h-4 w-4 text-turkish-red focus:ring-turkish-red border-gray-300 rounded"
                    />
                    <label htmlFor="hidden" className="text-sm text-gray-700">Hidden (not visible on website)</label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !editing.title}
                    className="px-6 py-2 bg-turkish-red text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {events.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No {tab} events yet. Click the button above to add one.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {events.map((event) => (
                <div key={event.id} className="p-4 hover:bg-gray-50 flex items-center gap-4">
                  {event.image ? (
                    <img src={event.image} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-2xl">📅</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 truncate">{event.title}</h3>
                      {event.hidden && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">Hidden</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      {event.venue && ` • ${event.venue}`}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-3 py-1 text-sm text-turkish-red hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => event.id && handleDelete(event.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
