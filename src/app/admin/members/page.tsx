"use client";
import React from "react";
import useSWR from "swr";
import AdminNav from "@/components/admin/AdminNav";
import { useRouter } from "next/navigation";

type MembershipRequest = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  university?: string;
  studyProgram?: string;
  notes?: string;
  userEmailSent: boolean;
  adminEmailSent: boolean;
  createdAt: string;
};

const fetcher = async (url: string) => {
  const r = await fetch(url, { credentials: "same-origin" });
  if (r.status === 401) throw new Error("Unauthorized");
  return r.json();
};

export default function MembersAdminPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSWR<{ ok: boolean; requests: MembershipRequest[] }>(
    "/api/membership",
    fetcher,
    { onError: (err) => { if (err.message === "Unauthorized") router.replace("/admin"); } }
  );

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
            Failed to load membership requests.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Membership Requests</h1>
          <span className="text-gray-500">{data.requests.length} total</span>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {data.requests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No membership requests yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Study</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{req.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <a href={`mailto:${req.email}`} className="text-turkish-red hover:underline">{req.email}</a>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{req.phone || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{req.university || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{req.studyProgram || "-"}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-1">
                          {req.userEmailSent && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">User ✓</span>
                          )}
                          {req.adminEmailSent && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Admin ✓</span>
                          )}
                          {!req.userEmailSent && !req.adminEmailSent && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">No email</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Notes section */}
        {data.requests.some(r => r.notes) && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
            <div className="space-y-4">
              {data.requests.filter(r => r.notes).map((req) => (
                <div key={req.id} className="bg-white rounded-lg p-4 shadow">
                  <div className="font-medium text-gray-900">{req.name}</div>
                  <p className="text-sm text-gray-600 mt-1">{req.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
