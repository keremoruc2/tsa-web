"use client";
import React, { useState } from "react";
import useSWR from "swr";
import AdminNav from "@/components/admin/AdminNav";
import { useRouter } from "next/navigation";

type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

type Application = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  university?: string;
  studyProgram?: string;
  message?: string;
  status: ApplicationStatus;
  createdAt: string;
};

const fetcher = async (url: string) => {
  const r = await fetch(url, { credentials: "same-origin" });
  if (r.status === 401) throw new Error("Unauthorized");
  return r.json();
};

function DetailModal({ 
  application, 
  onClose, 
  onUpdateStatus 
}: { 
  application: Application; 
  onClose: () => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => Promise<void>;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAction = async (status: ApplicationStatus) => {
    setIsUpdating(true);
    await onUpdateStatus(application.id, status);
    setIsUpdating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{application.name}</h2>
              <p className="text-sm text-gray-500">
                Applied {new Date(application.createdAt).toLocaleDateString("en-GB", { 
                  day: "numeric", 
                  month: "long", 
                  year: "numeric" 
                })}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
            <p className="text-gray-900">
              <a href={`mailto:${application.email}`} className="text-turkish-red hover:underline">{application.email}</a>
            </p>
          </div>

          {application.phone && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</label>
              <p className="text-gray-900">{application.phone}</p>
            </div>
          )}

          {application.university && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">University</label>
              <p className="text-gray-900">{application.university}</p>
            </div>
          )}

          {application.studyProgram && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Study Program</label>
              <p className="text-gray-900">{application.studyProgram}</p>
            </div>
          )}

          {application.message && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Message</label>
              <p className="text-gray-900 whitespace-pre-wrap">{application.message}</p>
            </div>
          )}
        </div>

        {application.status === "PENDING" && (
          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              onClick={() => handleAction("ACCEPTED")}
              disabled={isUpdating}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isUpdating ? "..." : "Accept"}
            </button>
            <button
              onClick={() => handleAction("REJECTED")}
              disabled={isUpdating}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isUpdating ? "..." : "Reject"}
            </button>
          </div>
        )}

        {application.status !== "PENDING" && (
          <div className="p-6 border-t border-gray-200">
            <div className={`text-center py-2 rounded-lg font-medium ${
              application.status === "ACCEPTED" 
                ? "bg-green-50 text-green-700" 
                : "bg-red-50 text-red-700"
            }`}>
              {application.status === "ACCEPTED" ? "✓ Accepted" : "✗ Rejected"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeamAdminPage() {
  const router = useRouter();
  const { data, isLoading, error, mutate } = useSWR<{ ok: boolean; applications: Application[] }>(
    "/api/applications?type=TEAM",
    fetcher,
    { onError: (err) => { if (err.message === "Unauthorized") router.replace("/admin"); } }
  );
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");

  const handleUpdateStatus = async (id: string, status: ApplicationStatus) => {
    await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    mutate();
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
            Failed to load team applications.
          </div>
        </div>
      </div>
    );
  }

  const applications = data.applications;
  const pendingCount = applications.filter(a => a.status === "PENDING").length;
  const acceptedCount = applications.filter(a => a.status === "ACCEPTED").length;
  const rejectedCount = applications.filter(a => a.status === "REJECTED").length;

  const filteredApplications = applications.filter(a => {
    if (filter === "all") return true;
    return a.status === filter.toUpperCase();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Applications</h1>
            <p className="text-gray-500 text-sm mt-1">
              {pendingCount} pending • {acceptedCount} accepted • {rejectedCount} rejected
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {(["all", "pending", "accepted", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === f
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredApplications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No {filter === "all" ? "" : filter} team applications.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApplication(app)}
                  className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                    app.status === "PENDING" 
                      ? "hover:bg-yellow-50 bg-yellow-50/30" 
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      app.status === "PENDING" ? "bg-yellow-500" :
                      app.status === "ACCEPTED" ? "bg-green-500" : "bg-red-500"
                    }`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 truncate">{app.name}</span>
                        {app.message && (
                          <span className="text-xs text-gray-400">💬</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 truncate">{app.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-sm text-gray-400 hidden sm:block">
                      {new Date(app.createdAt).toLocaleDateString("en-GB", { 
                        day: "numeric", 
                        month: "short" 
                      })}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      app.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      app.status === "ACCEPTED" ? "bg-green-100 text-green-700" : 
                      "bg-red-100 text-red-700"
                    }`}>
                      {app.status.toLowerCase()}
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApplication && (
        <DetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
