"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import {
  UserPlus,
  ShieldCheck,
  Key,
  Pencil,
  X,
  CheckCircle,
  User,
} from "@phosphor-icons/react";
import { Member } from "@/types/nexo";

export function MembersView() {
  const { members, ipos, addMember, updateMember, currentUser } = useNexo();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Add form state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [pan, setPan] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("/oggy.png");

  // Edit form state
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editName, setEditName] = useState("");
  const [editPan, setEditPan] = useState("");
  const [editRole, setEditRole] = useState<"ADMIN" | "MEMBER">("MEMBER");

  const getAppliedIpoCount = (member: Member): number => {
    if (!ipos || ipos.length === 0) return 0;
    return ipos.filter((ipo) => {
      if (!ipo.applications || ipo.applications.length === 0) return false;
      return ipo.applications.some((app: any) => {
        const isDirectMatch =
          app.memberId === member.id ||
          (app.applicantName && app.applicantName.toLowerCase() === member.name.toLowerCase());

        const isParticipantMatch =
          Array.isArray(app.participants) &&
          app.participants.some(
            (p: any) =>
              p.memberId === member.id ||
              (p.memberName && p.memberName.toLowerCase() === member.name.toLowerCase())
          );

        return isDirectMatch || isParticipantMatch;
      });
    }).length;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !password) return;

    await addMember({
      name,
      username: username.trim().toLowerCase(),
      password: password.trim(),
      role,
      panMasked: pan.trim().toUpperCase() || "ABCDE1234F",
      panFull: pan.trim().toUpperCase() || "ABCDE1234F",
      email: email || `${username.trim().toLowerCase()}@nexo.private`,
      avatar,
    });

    setIsAddModalOpen(false);
    resetAddForm();
  };

  const resetAddForm = () => {
    setName("");
    setUsername("");
    setPassword("");
    setRole("MEMBER");
    setPan("");
    setEmail("");
    setAvatar("/oggy.png");
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setEditName(member.name);
    setEditUsername(member.username || member.name.toLowerCase());
    setEditPassword(member.password || (member.role === "ADMIN" ? "admin123" : "user123"));
    setEditPan(member.panFull || member.panMasked);
    setEditRole(member.role);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editUsername || !editPassword) return;

    await updateMember(editingMember.id, {
      name: editName,
      username: editUsername.trim().toLowerCase(),
      password: editPassword.trim(),
      panMasked: editPan.trim().toUpperCase(),
      panFull: editPan.trim().toUpperCase(),
      role: editRole,
    });

    setEditingMember(null);
  };

  const isCurrentUserAdmin = currentUser?.role === "ADMIN";

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="nexo-h2 text-ink flex items-center gap-2">
            Group Members
            <span className="text-caption font-semibold px-2 py-0.5 rounded-full bg-surface-alt border border-line text-ink-secondary">
              {members.length} Members
            </span>
          </h2>
          <p className="text-xs text-ink-secondary font-normal mt-0.5">
            Manage trusted group members and view IPO application activity
          </p>
        </div>

        {isCurrentUserAdmin && (
          <Button size="sm" variant="primary" onClick={() => setIsAddModalOpen(true)}>
            <UserPlus size={16} /> Add Member
          </Button>
        )}
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.map((member) => {
          const mUsername = member.username || member.name.toLowerCase();
          const appliedCount = getAppliedIpoCount(member);

          return (
            <Card key={member.id} className="flex flex-col justify-between space-y-4 border-line">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-accent/30 bg-surface-alt"
                    />
                    <div>
                      <h3 className="text-[18px] leading-[26px] font-semibold text-ink flex items-center gap-1.5">
                        {member.name}
                        {member.role === "ADMIN" && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-caution-soft text-caution font-semibold uppercase font-mono">
                            Admin
                          </span>
                        )}
                      </h3>
                      <div className="text-xs text-ink-secondary font-normal">{member.email}</div>
                    </div>
                  </div>
                </div>

                {/* Username Box */}
                <div className="mt-4 p-3 rounded-xl bg-surface-alt/70 border border-line-subtle flex items-center justify-between text-xs font-mono">
                  <span className="text-ink-tertiary font-medium font-sans flex items-center gap-1.5">
                    <User size={14} className="text-accent" /> Username:
                  </span>
                  <span className="font-bold text-ink bg-surface px-2.5 py-0.5 rounded border border-line">
                    {mUsername}
                  </span>
                </div>

                {/* Attributes */}
                <div className="mt-3 p-3 rounded-xl bg-page border border-line space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-ink-secondary font-medium">IPOs Applied Till Date</span>
                    <span className="font-bold text-accent bg-accent-soft px-2.5 py-0.5 rounded-full text-[11px] font-mono border border-accent/20">
                      {appliedCount} {appliedCount === 1 ? "IPO" : "IPOs"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-ink-secondary font-medium">Member Since</span>
                    <span className="text-ink font-medium">{member.joinedAt}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-between text-xs">
                <span className="text-positive font-medium flex items-center gap-1">
                  <ShieldCheck size={14} /> Verified Member
                </span>
                {isCurrentUserAdmin && (
                  <button
                    onClick={() => openEditModal(member)}
                    className="text-accent hover:underline font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <Pencil size={13} /> Edit Member
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* ADD MEMBER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-body-md font-bold text-ink flex items-center gap-2">
                  <UserPlus size={18} className="text-accent" />
                  Add Member & Issue Credentials
                </h3>
                <p className="text-caption text-ink-tertiary">
                  Create member account with assigned username & password
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-ink-tertiary hover:text-ink p-1 rounded-lg hover:bg-surface-alt transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-caption font-semibold text-ink mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!username) setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""));
                  }}
                  placeholder="e.g. Ashay Kumar"
                  required
                  className="w-full px-3.5 py-2 bg-surface-alt border border-line rounded-xl text-small text-ink focus:border-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-caption font-semibold text-ink mb-1">Username *</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. ashay"
                    required
                    className="w-full px-3.5 py-2 bg-surface-alt border border-line rounded-xl text-small text-ink font-mono focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-caption font-semibold text-ink mb-1">Password *</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="e.g. user123"
                    required
                    className="w-full px-3.5 py-2 bg-surface-alt border border-line rounded-xl text-small text-ink font-mono focus:border-accent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-caption font-semibold text-ink mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-surface-alt border border-line rounded-xl text-small text-ink focus:border-accent outline-none"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-caption font-semibold text-ink mb-1">Avatar Preset</label>
                <div className="flex items-center gap-3 pt-1">
                  {["/oggy.png", "/jack.png", "/sinchan.png", "/doremon.png", "/cockroach.png"].map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setAvatar(img)}
                      className={`relative rounded-full p-0.5 border-2 transition-all ${
                        avatar === img ? "border-accent scale-110" : "border-transparent opacity-70"
                      }`}
                    >
                      <img src={img} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  <CheckCircle size={16} /> Save & Issue Credentials
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CREDENTIALS MODAL */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-body-md font-bold text-ink flex items-center gap-2">
                  <Key size={18} className="text-accent" />
                  Edit Credentials for {editingMember.name}
                </h3>
                <p className="text-caption text-ink-tertiary">
                  Update login username and password
                </p>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="text-ink-tertiary hover:text-ink p-1 rounded-lg hover:bg-surface-alt transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-caption font-semibold text-ink mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 bg-surface-alt border border-line rounded-xl text-small text-ink focus:border-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-caption font-semibold text-ink mb-1">Username *</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-surface-alt border border-line rounded-xl text-small text-ink font-mono focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-caption font-semibold text-ink mb-1">Password *</label>
                  <input
                    type="text"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-surface-alt border border-line rounded-xl text-small text-ink font-mono focus:border-accent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-caption font-semibold text-ink mb-1">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-surface-alt border border-line rounded-xl text-small text-ink focus:border-accent outline-none"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingMember(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  <CheckCircle size={16} /> Save Credentials
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
