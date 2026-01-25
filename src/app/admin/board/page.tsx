"use client";
import React, { useState, useRef, useCallback } from "react";
import useSWR from "swr";
import AdminNav from "@/components/admin/AdminNav";
import { useRouter } from "next/navigation";
import Image from "next/image";

type BoardMember = {
  id?: string;
  name: string;
  role: string;
  roles?: string | null;
  image?: string | null;
  order: number;
};

type AdminBoardResponse = {
  ok: true;
  members: BoardMember[];
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

export default function BoardAdminPage() {
  const router = useRouter();
  const { data, mutate, isLoading, error } = useSWR<AdminBoardResponse>(
    "/api/board/admin",
    fetcher,
    { onError: (err) => { if (err.message === "Unauthorized") router.replace("/admin"); } }
  );

  const [editing, setEditing] = useState<BoardMember | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cropMode, setCropMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const flash = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const members = data?.ok ? data.members : [];

  const handleNew = () => {
    const maxOrder = members.reduce((max, m) => Math.max(max, m.order), -1);
    setEditing({
      name: "",
      role: "",
      roles: "",
      image: null,
      order: maxOrder + 1,
    });
    setIsNew(true);
    setImagePreview(null);
    setCropMode(false);
  };

  const handleEdit = (member: BoardMember) => {
    setEditing({ ...member });
    setIsNew(false);
    setImagePreview(member.image || null);
    setCropMode(false);
  };

  const handleCancel = () => {
    setEditing(null);
    setIsNew(false);
    setImagePreview(null);
    setCropMode(false);
    setOriginalImage(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        setOriginalImage(img);
        setCropMode(true);
        setScale(1);
        setOffsetX(0);
        setOffsetY(0);
        // Draw initial preview
        drawPreview(img, 1, 0, 0);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const drawPreview = useCallback((img: HTMLImageElement, s: number, ox: number, oy: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 200;
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, size, size);

    // Calculate dimensions to center and scale the image
    const minDim = Math.min(img.width, img.height);
    const sourceSize = minDim / s;
    const sourceX = (img.width - sourceSize) / 2 + (ox * sourceSize / size);
    const sourceY = (img.height - sourceSize) / 2 + (oy * sourceSize / size);

    // Draw circular clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    // Draw image
    ctx.drawImage(
      img,
      sourceX, sourceY, sourceSize, sourceSize,
      0, 0, size, size
    );

    ctx.restore();

    // Update preview
    setImagePreview(canvas.toDataURL("image/jpeg", 0.9));
  }, []);

  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
    if (originalImage) {
      drawPreview(originalImage, newScale, offsetX, offsetY);
    }
  };

  const handleOffsetChange = (axis: "x" | "y", value: number) => {
    if (axis === "x") {
      setOffsetX(value);
      if (originalImage) drawPreview(originalImage, scale, value, offsetY);
    } else {
      setOffsetY(value);
      if (originalImage) drawPreview(originalImage, scale, offsetX, value);
    }
  };

  const handleApplyCrop = async () => {
    if (!imagePreview || !editing) return;

    setUploading(true);
    try {
      // Convert data URL to blob
      const response = await fetch(imagePreview);
      const blob = await response.blob();
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.ok) {
        setEditing({ ...editing, image: result.url });
        setImagePreview(result.url);
        setCropMode(false);
        setOriginalImage(null);
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
    if (!editing.name.trim() || !editing.role.trim()) {
      flash("error", "Name and role are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/board/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isNew ? "create" : "update",
          ...editing,
        }),
      });

      const result = await res.json();
      if (result.ok) {
        flash("success", isNew ? "Member added!" : "Member updated!");
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

  const handleDelete = async (member: BoardMember) => {
    if (!member.id) return;
    if (!confirm(`Delete ${member.name}?`)) return;

    try {
      const res = await fetch("/api/board/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id: member.id }),
      });

      const result = await res.json();
      if (result.ok) {
        flash("success", "Member deleted!");
        mutate();
      } else {
        flash("error", result.error || "Delete failed");
      }
    } catch {
      flash("error", "Delete failed");
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newMembers = [...members];
    [newMembers[index - 1], newMembers[index]] = [newMembers[index], newMembers[index - 1]];
    
    const reordered = newMembers.map((m, i) => ({ id: m.id!, order: i }));
    
    try {
      await fetch("/api/board/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", members: reordered }),
      });
      mutate();
    } catch {
      flash("error", "Reorder failed");
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === members.length - 1) return;
    const newMembers = [...members];
    [newMembers[index], newMembers[index + 1]] = [newMembers[index + 1], newMembers[index]];
    
    const reordered = newMembers.map((m, i) => ({ id: m.id!, order: i }));
    
    try {
      await fetch("/api/board/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", members: reordered }),
      });
      mutate();
    } catch {
      flash("error", "Reorder failed");
    }
  };

  if (error && error.message !== "Unauthorized") {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <AdminNav />
        <div className="max-w-6xl mx-auto pt-20">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            Failed to load board members
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <AdminNav />
      <div className="max-w-6xl mx-auto pt-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Board Members</h1>
          <button
            onClick={handleNew}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            + Add Member
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        {isLoading ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-500">
            Loading...
          </div>
        ) : (
          <div className="grid gap-4">
            {members.map((member, index) => (
              <div
                key={member.id}
                className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4"
              >
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === members.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>

                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                      👤
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                  <p className="text-sm text-red-600">{member.role}</p>
                  {member.roles && (
                    <p className="text-xs text-gray-500 truncate">{member.roles}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {members.length === 0 && (
              <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                No board members yet. Click &quot;Add Member&quot; to get started.
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {isNew ? "Add Board Member" : "Edit Board Member"}
                </h2>

                <div className="space-y-4">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo
                    </label>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-gray-200">
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                            👤
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          {imagePreview ? "Change Photo" : "Upload Photo"}
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                          Square images work best. You can crop after uploading.
                        </p>
                      </div>
                    </div>

                    {/* Crop Controls */}
                    {cropMode && originalImage && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Adjust Image</h4>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-600">Zoom: {scale.toFixed(1)}x</label>
                            <input
                              type="range"
                              min="1"
                              max="3"
                              step="0.1"
                              value={scale}
                              onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-600">Horizontal: {offsetX}</label>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              step="1"
                              value={offsetX}
                              onChange={(e) => handleOffsetChange("x", parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-600">Vertical: {offsetY}</label>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              step="1"
                              value={offsetY}
                              onChange={(e) => handleOffsetChange("y", parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleApplyCrop}
                          disabled={uploading}
                          className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {uploading ? "Uploading..." : "Apply & Upload"}
                        </button>
                        
                        <canvas ref={canvasRef} className="hidden" />
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="e.g., Kaan Taşpek"
                    />
                  </div>

                  {/* Primary Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Role *
                    </label>
                    <input
                      type="text"
                      value={editing.role}
                      onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="e.g., President"
                    />
                  </div>

                  {/* Additional Roles */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Roles (optional)
                    </label>
                    <input
                      type="text"
                      value={editing.roles || ""}
                      onChange={(e) => setEditing({ ...editing, roles: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="e.g., Vice President, Events Coordinator"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate multiple roles with commas
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || cropMode}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Member"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
