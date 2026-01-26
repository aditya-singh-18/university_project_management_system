"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/store/auth.store";
import {
  updateSocialLinks,
  deleteSocialLink,
} from "@/services/profile.service";
import {
  updateStudentBio,
  getStudentProfile,
} from "@/services/student.service";
import {
  Github,
  Linkedin,
  Globe,
  Edit,
  Camera,
  X,
} from "lucide-react";
import Sidebar from "@/components/sidebar/StudentSidebar";
import Topbar from "@/components/dashboard/Topbar";

/* ================= TYPES ================= */

type SocialLink = {
  platform: string;
  link: string;
};

const PLATFORMS = [
  "github",
  "linkedin",
  "portfolio",
  "twitter",
  "instagram",
  "leetcode",
  "hackerrank",
  "codechef",
  "codeforces",
  "gmail",
];

const MAX_LINKS = 10;

/* ================= IMAGE CROP + RESIZE ================= */

function cropAndResizeImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => (img.src = reader.result as string);

    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;

      ctx.drawImage(img, sx, sy, size, size, 0, 0, 256, 256);

      canvas.toBlob((blob) => {
        if (!blob) return;
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg");
    };

    reader.readAsDataURL(file);
  });
}

/* ================= PAGE ================= */

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [bioEditMode, setBioEditMode] = useState(false);
  const [bio, setBio] = useState("");
  const [bioEdit, setBioEdit] = useState("");
  const [bioSaving, setBioSaving] = useState(false);

  const [duplicatePlatform, setDuplicatePlatform] =
    useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<string | null>(null);

  /* ===== UNDO ===== */
  const [undoItem, setUndoItem] = useState<SocialLink | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const undoTimerRef = useRef<NodeJS.Timeout | null>(null);

  /* ===== AVATAR ===== */
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] =
    useState<string | null>(null);

  const profileImage =
    user && typeof user === "object"
      ? (user as { profileImage?: string }).profileImage
      : undefined;

  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (user?.socialLinks && !isInitializedRef.current) {
      isInitializedRef.current = true;
      // eslint-disable-next-line
      setLinks(user.socialLinks);
    }
  }, [user?.socialLinks]);

  // Fetch bio from API on mount
  useEffect(() => {
    const fetchBio = async () => {
      try {
        const profile = await getStudentProfile();
        if (profile?.bio) {
          setBio(profile.bio);
          setBioEdit(profile.bio);
        }
      } catch (error) {
        console.error("Failed to fetch bio:", error);
      }
    };
    fetchBio();
  }, []);

  if (!user) return null;

  /* ================= AVATAR ================= */

  const onAvatarClick = () => fileRef.current?.click();

  const onAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const cropped = await cropAndResizeImage(file);
    setAvatarPreview(cropped);
  };

  const resetAvatar = () => {
    setAvatarPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ================= SOCIAL ================= */

  const addLink = () => {
    if (links.length >= MAX_LINKS) return;
    setLinks((p) => [...p, { platform: "", link: "" }]);
  };

  const updateLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    setLinks((prev) => {
      const copy = [...prev];

      if (
        field === "platform" &&
        value &&
        copy.some(
          (l, i) => l.platform === value && i !== index
        )
      ) {
        setDuplicatePlatform(value);
        return prev;
      }

      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  /* ===== DELETE FLOW (UNCHANGED + UNDO ADDED) ===== */

  const removeLink = (platform: string) => {
    setDeleteTarget(platform);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const deleted = links.find(
      (l) => l.platform === deleteTarget
    );
    if (!deleted) return;

    await deleteSocialLink(deleteTarget);

    setLinks((p) =>
      p.filter((l) => l.platform !== deleteTarget)
    );

    setUndoItem(deleted);
    setShowUndo(true);

    if (undoTimerRef.current)
      clearTimeout(undoTimerRef.current);

    undoTimerRef.current = setTimeout(() => {
      setShowUndo(false);
      setUndoItem(null);
    }, 6000);

    await refreshUser();
    setDeleteTarget(null);
  };

  const undoDelete = async () => {
    if (!undoItem) return;

    await fetch(
      `/api/profile/me/social-links/${undoItem.platform}/undo`,
      { method: "POST" }
    );

    setLinks((p) => [...p, undoItem]);
    setUndoItem(null);
    setShowUndo(false);

    if (undoTimerRef.current)
      clearTimeout(undoTimerRef.current);
  };

  const saveLinks = async () => {
    if (links.some((l) => !l.platform || !l.link)) {
      alert("Fill all links properly");
      return;
    }

    setSaving(true);
    await updateSocialLinks(links);
    await refreshUser();
    setEditMode(false);
    setSaving(false);
  };

  const saveBio = async () => {
    if (!bioEdit.trim()) {
      alert("Bio cannot be empty");
      return;
    }

    setBioSaving(true);
    try {
      await updateStudentBio(bioEdit);
      setBio(bioEdit);
      setBioEditMode(false);
      
      // Fetch fresh bio from API to ensure sync
      const profile = await getStudentProfile();
      if (profile?.bio) {
        setBio(profile.bio);
      }
      
      await refreshUser();
    } catch (error) {
      console.error("Failed to save bio:", error);
      alert("Failed to save bio");
    } finally {
      setBioSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar title="Student Profile" />

        <main className="flex-1 p-6 md:p-8 bg-slate-100 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* OVERVIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 flex flex-col items-center text-center gap-4">
                <p className="text-sm font-semibold text-slate-500">My Profile</p>

                {/* AVATAR */}
                <div className="relative w-28 h-28 md:w-32 md:h-32">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-100 shadow-sm bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center text-3xl font-bold text-slate-600">
                    {avatarPreview || profileImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={(avatarPreview as string) || profileImage || ""}
                        alt={user.name || "avatar"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (user.name || "?").charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-3 text-white">
                    <button onClick={onAvatarClick} aria-label="Upload avatar">
                      <Camera size={18} />
                    </button>
                    {avatarPreview && (
                      <button onClick={resetAvatar} aria-label="Remove avatar">
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onAvatarChange}
                  />
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{user.name}</h1>
                  <p className="text-sm text-slate-600">
                    {user.department || "N/A"} • Year {user.year || "—"} •{" "}
                    <span className="text-green-600 font-semibold">{user.status || "ACTIVE"}</span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="Enrollment No" value={user.enrollmentId} />
                  <Info label="Department" value={user.department} />
                  <Info label="Roll No" value={user.rollNumber} />
                  <Info label="Division" value={user.division} />
                  <Info label="Email" value={user.email} />
                  <Info label="Contact" value={user.contactNumber} />
                </div>
              </div>
            </div>

            {/* BIO SECTION */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">About Me</h3>
                {!bioEditMode && (
                  <button
                    onClick={() => setBioEditMode(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition"
                  >
                    <Edit size={14} /> Edit Bio
                  </button>
                )}
              </div>

              {!bioEditMode ? (
                <div className="text-slate-600 leading-relaxed min-h-24 p-4 bg-slate-50 rounded-lg">
                  {bio ? (
                    <p>{bio}</p>
                  ) : (
                    <p className="text-slate-400 italic">
                      No bio added yet. Click Edit Bio to add one!
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={bioEdit}
                    onChange={(e) => setBioEdit(e.target.value)}
                    placeholder="Write something about yourself..."
                    maxLength={500}
                    rows={4}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{bioEdit.length}/500</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setBioEdit(bio);
                          setBioEditMode(false);
                        }}
                        className="border border-slate-300 px-6 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveBio}
                        disabled={bioSaving}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                      >
                        {bioSaving ? "Saving..." : "Save Bio"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SOCIAL LINKS */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Social Links</h3>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition"
                  >
                    <Edit size={14} /> Manage
                  </button>
                )}
              </div>

              {!editMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {links.map((s, i) => (
                    <div
                      key={`${s.platform}-${i}`}
                      className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <Icon platform={s.platform} />
                        <div>
                          <p className="capitalize font-semibold text-slate-900">{s.platform}</p>
                          <p className="text-xs text-slate-500 truncate max-w-56">{s.link}</p>
                        </div>
                      </div>

                      <a
                        href={s.link}
                        target="_blank"
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white hover:bg-slate-100 transition"
                      >
                        Open
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {editMode && (
                <div className="space-y-3">
                  {links.map((s, i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-3">
                      <select
                        value={s.platform}
                        onChange={(e) =>
                          updateLink(
                            i,
                            "platform",
                            e.target.value
                          )
                        }
                        className="border border-slate-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="">Select platform</option>
                        {PLATFORMS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>

                      <input
                        value={s.link}
                        onChange={(e) =>
                          updateLink(
                            i,
                            "link",
                            e.target.value
                          )
                        }
                        className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm"
                        placeholder="https://..."
                      />

                      <button
                        onClick={() => removeLink(s.platform)}
                        className="text-red-500 text-sm"
                      >
                        🗑
                      </button>
                    </div>
                  ))}

                  <div className="flex flex-wrap gap-3 pt-4">
                    <button
                      onClick={addLink}
                      className="border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-50"
                    >
                      + Add
                    </button>
                    <button
                      onClick={saveLinks}
                      className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-700"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        if (user?.socialLinks) {
                          setLinks(user.socialLinks);
                        }
                        setEditMode(false);
                      }}
                      className="border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* CONFIRM DELETE */}
      {deleteTarget && (
        <DeleteConfirmModal
          platform={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      {/* DUPLICATE PLATFORM */}
      {duplicatePlatform && (
        <DuplicatePlatformModal
          platform={duplicatePlatform}
          onClose={() => setDuplicatePlatform(null)}
        />
      )}

      {/* UNDO SNACKBAR */}
      {showUndo && undoItem && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-gray-900 text-white px-5 py-3 rounded-xl flex items-center gap-4 shadow-lg">
            <span className="text-sm">
              {undoItem.platform} link deleted
            </span>
            <button
              onClick={undoDelete}
              className="text-green-400 font-semibold hover:underline"
            >
              UNDO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= HELPERS ================= */

function Icon({ platform }: { platform: string }) {
  if (platform === "github") return <Github size={18} />;
  if (platform === "linkedin") return <Linkedin size={18} />;
  if (platform === "leetcode") return <b>LC</b>;
  if (platform === "hackerrank") return <b>HR</b>;
  if (platform === "codechef") return <b>CC</b>;
  if (platform === "codeforces") return <b>CF</b>;
  if (platform === "gmail") return <b>GM</b>;
  return <Globe size={18} />;
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="border rounded-lg p-3 bg-slate-50">
      <p className="text-gray-500">{label}</p>
      <p className="font-medium truncate">{value || "-"}</p>
    </div>
  );
}

function DuplicatePlatformModal({
  platform,
  onClose,
}: {
  platform: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-100 text-center">
        <h2 className="text-red-600 font-semibold">
          Duplicate Platform
        </h2>
        <p className="mt-3 text-gray-600">
          {platform} can be added only once.
        </p>
        <button
          onClick={onClose}
          className="mt-5 px-4 py-2 bg-red-100 text-red-700 rounded"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  platform,
  onCancel,
  onConfirm,
}: {
  platform: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-95 text-center">
        <h2 className="text-lg font-semibold text-red-600">
          Delete {platform}?
        </h2>
        <p className="mt-3 text-gray-600">
          Are you sure you want to delete this link?
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
