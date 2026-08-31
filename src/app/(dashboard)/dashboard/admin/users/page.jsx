"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import {
  Check,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  serverFetch,
  serverMutation,
} from "@/lib/api";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await serverFetch("/api/admin/users");

      if (res?.success) {
        setUsers(res.users || []);
      } else {
        alert(res?.message || "Failed to load users");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // ROLE CHANGE
  const handleRoleChange = async (userId, role) => {
    try {
      setActionLoading(userId);

      const res = await serverMutation(
        `/api/admin/users/${userId}/role`,
        "PATCH",
        { role }
      );

      if (res?.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId ? { ...user, role } : user
          )
        );
      } else {
        alert(res?.message || "Role update failed");
      }
    } catch (error) {
      console.error(error);
      alert("Role update failed");
    } finally {
      setActionLoading(null);
    }
  };

  // ACCEPT / REJECT STATUS CHANGE
  const handleStatusChange = async (userId, status) => {
    try {
      setActionLoading(userId);

      const res = await serverMutation(
        `/api/admin/users/${userId}/status`,
        "PATCH",
        { status }
      );

      if (res?.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId ? { ...user, status } : user
          )
        );
      } else {
        alert(res?.message || "Status update failed");
      }
    } catch (error) {
      console.error(error);
      alert("Status update failed");
    } finally {
      setActionLoading(null);
    }
  };

  // BLOCK / UNBLOCK
  const handleBlockToggle = async (user) => {
    const nextStatus = !Boolean(user.isBlocked);
    const message = nextStatus
      ? `Block ${user.email}?`
      : `Unblock ${user.email}?`;

    if (!confirm(message)) return;

    try {
      setActionLoading(user._id);

      const res = await serverMutation(
        `/api/admin/users/${user._id}/block`,
        "PATCH",
        { isBlocked: nextStatus }
      );

      if (res?.success) {
        setUsers((prev) =>
          prev.map((item) =>
            item._id === user._id
              ? { ...item, isBlocked: nextStatus }
              : item
          )
        );
      } else {
        alert(res?.message || "Failed to update user status");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  // DELETE USER
  const handleDeleteUser = async (user) => {
    if (!confirm(`Are you sure you want to delete ${user.email}? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(user._id);

      const res = await serverMutation(
        `/api/admin/users/${user._id}`,
        "DELETE"
      );

      if (res?.success) {
        setUsers((prev) => prev.filter((item) => item._id !== user._id));
      } else {
        alert(res?.message || "Failed to delete user");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Users size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Manage Users</h1>
            <p className="text-sm text-default-500">
              View, accept/reject, manage roles, block or remove platform users.
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-default-200 bg-content1 dark:border-default-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-default-200 bg-default-50 dark:border-default-100 dark:bg-default-100/10">
              <tr>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-default-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-default-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const blocked = Boolean(user.isBlocked);
                  const status = user.status || "Approved";
                  const busy = actionLoading === user._id;

                  return (
                    <tr
                      key={user._id}
                      className="transition hover:bg-default-50/60 dark:hover:bg-default-100/10"
                    >
                      {/* User Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              user.image ||
                              "https://i.ibb.co/2kR3dJm/user.png"
                            }
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold">
                              {user.name || "Unknown User"}
                            </p>
                            <p className="text-xs text-default-500">
                              ID: {String(user._id).slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4 text-default-500">{user.email}</td>

                      {/* Role */}
                      <td className="p-4">
                        <select
                          value={user.role || "user"}
                          disabled={busy}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className="rounded-lg border border-default-200 bg-content2 px-3 py-2 text-xs outline-none focus:border-primary"
                        >
                          <option value="user">User</option>
                          <option value="founder">Founder</option>
                          <option value="collaborator">Collaborator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      {/* Status Badges */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          {blocked ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-semibold text-danger">
                              <ShieldOff size={12} />
                              Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                              <ShieldCheck size={12} />
                              Active
                            </span>
                          )}

                          {status === "Pending" && (
                            <span className="inline-flex items-center rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-semibold text-warning">
                              Pending
                            </span>
                          )}
                          {status === "Approved" && (
                            <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                              Approved
                            </span>
                          )}
                          {status === "Rejected" && (
                            <span className="inline-flex items-center rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-semibold text-danger">
                              Rejected
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex justify-end items-center gap-2">
                          {/* Accept / Approve */}
                          {status !== "Approved" && (
                            <button
                              disabled={busy}
                              onClick={() => handleStatusChange(user._id, "Approved")}
                              title="Approve User"
                              className="inline-flex items-center gap-1 rounded-lg bg-success/10 px-2.5 py-1.5 text-xs font-semibold text-success hover:bg-success/20 transition disabled:opacity-50"
                            >
                              <Check size={14} />
                              Accept
                            </button>
                          )}

                          {/* Reject */}
                          {status !== "Rejected" && (
                            <button
                              disabled={busy}
                              onClick={() => handleStatusChange(user._id, "Rejected")}
                              title="Reject User"
                              className="inline-flex items-center gap-1 rounded-lg bg-danger/10 px-2.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger/20 transition disabled:opacity-50"
                            >
                              <X size={14} />
                              Reject
                            </button>
                          )}

                          {/* Block / Unblock */}
                          <button
                            disabled={busy}
                            onClick={() => handleBlockToggle(user)}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                              blocked
                                ? "bg-success/10 text-success hover:bg-success/20"
                                : "bg-warning/10 text-warning hover:bg-warning/20"
                            }`}
                          >
                            {blocked ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
                            {blocked ? "Unblock" : "Block"}
                          </button>

                          {/* Delete */}
                          <button
                            disabled={busy}
                            onClick={() => handleDeleteUser(user)}
                            title="Delete User"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-danger/10 px-2.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger/20 transition disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}