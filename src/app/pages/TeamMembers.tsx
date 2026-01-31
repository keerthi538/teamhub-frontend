import React, { useState } from "react";
import InviteTeamMemberModal from "../components/InviteTeamMemberModal";

const TeamMembers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalMembers = 24;

  const mockMembers = [
    {
      id: "1",
      name: "Alex Rivera",
      email: "alex@dev-corp.com",
      avatar: "AR",
      avatarBg: "bg-gradient-to-br from-amber-400 to-orange-500",
      role: "Owner",
      lastActive: "2 mins ago",
    },
    {
      id: "2",
      name: "Jordan Smith",
      email: "j.smith@workspace.io",
      avatar: "JS",
      avatarBg: "bg-gradient-to-br from-blue-400 to-cyan-500",
      role: "Editor",
      lastActive: "1 hour ago",
    },
    {
      id: "3",
      name: "Sarah Chen",
      email: "sarah@codebase.dev",
      avatar: "SC",
      avatarBg: "bg-gradient-to-br from-purple-400 to-pink-500",
      role: "Editor",
      lastActive: "3 hours ago",
    },
    {
      id: "4",
      name: "Michael Scott",
      email: "m.scott@paper.com",
      avatar: "MS",
      avatarBg: "bg-gradient-to-br from-green-400 to-emerald-500",
      role: "Viewer",
      lastActive: "Yesterday",
    },
    {
      id: "5",
      name: "Taylor Swift",
      email: "taylor@swift.build",
      avatar: "TS",
      avatarBg: "bg-gradient-to-br from-rose-400 to-red-500",
      role: "Viewer",
      lastActive: "3 days ago",
    },
  ];

  const handleInvite = (email: string, role: "Admin" | "Member" | "Guest") => {
    console.log("Inviting:", email, "as", role);
    // Add your invite logic here
    setIsModalOpen(false);
  };

  const getRoleBadgeStyles = (role: "Owner" | "Editor" | "Viewer") => {
    switch (role) {
      case "Owner":
        return "bg-slate-900 text-white";
      case "Editor":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Viewer":
        return "bg-slate-50 text-slate-600 border border-slate-200";
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Team Members
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:scale-105">
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 font-semibold"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Invite Member
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="px-8 py-8 max-w-7xl mx-auto">
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search members by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold text-slate-700 hover:border-slate-300">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockMembers.map((member, index) => (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50 transition-all duration-200 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white ${member.avatarBg}`}
                          >
                            {member.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-base">
                              {member.name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold ${getRoleBadgeStyles(member.role)}`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-600 font-medium">
                          {member.lastActive}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110">
                          <svg
                            className="w-5 h-5 text-slate-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-5 border-t border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 font-medium">
                  Showing <span className="font-bold text-slate-900">1</span> to{" "}
                  <span className="font-bold text-slate-900">5</span> of{" "}
                  <span className="font-bold text-slate-900">
                    {totalMembers}
                  </span>{" "}
                  members
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 hover:bg-white rounded-lg transition-all duration-200 border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 hover:shadow-sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    <svg
                      className="w-5 h-5 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-md scale-105"
                          : "hover:bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:scale-105"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="p-2 hover:bg-white rounded-lg transition-all duration-200 border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 hover:shadow-sm"
                    disabled={currentPage === 3}
                    onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                  >
                    <svg
                      className="w-5 h-5 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InviteTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvite={handleInvite}
      />
    </>
  );
};

export default TeamMembers;
