"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Ban, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách người dùng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      (user.username?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Quản lý Người dùng</h1>
        <p className="text-neutral-400 mt-1">Danh sách thành viên, số dư Coin và phân quyền trên hệ thống.</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên, email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111] border border-neutral-800 text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 transition-all"
          />
        </div>
        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-[#111] border border-neutral-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400 appearance-none min-w-[150px]"
        >
          <option value="all">Tất cả quyền</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>
        <button className="flex items-center gap-2 bg-[#111] border border-neutral-800 text-white px-4 py-2.5 rounded-xl hover:bg-neutral-900 transition-colors">
          <Filter className="w-5 h-5" />
          Lọc trạng thái
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-[#111] border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 flex justify-center items-center text-neutral-400">
              Đang tải dữ liệu...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900/50">
                  <th className="p-4 text-neutral-400 font-medium text-sm">Người dùng</th>
                  <th className="p-4 text-neutral-400 font-medium text-sm">Email</th>
                  <th className="p-4 text-neutral-400 font-medium text-sm">Số dư Coin</th>
                  <th className="p-4 text-neutral-400 font-medium text-sm">Quyền</th>
                  <th className="p-4 text-neutral-400 font-medium text-sm">Trạng thái</th>
                  <th className="p-4 text-neutral-400 font-medium text-sm">Ngày tham gia</th>
                  <th className="p-4 text-neutral-400 font-medium text-sm text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-neutral-500">
                      Không tìm thấy người dùng nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-neutral-900/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-black font-bold text-sm uppercase ${
                            user.role === 'ADMIN' ? 'bg-gradient-to-tr from-red-500 to-pink-500 text-white' : 'bg-gradient-to-tr from-yellow-400 to-orange-500'
                          }`}>
                            {user.username ? user.username.charAt(0) : '?'}
                          </div>
                          <span className="text-white font-medium">{user.username}</span>
                        </div>
                      </td>
                      <td className="p-4 text-neutral-400">{user.email}</td>
                      <td className="p-4 font-medium text-yellow-400">
                        {user.coins?.toLocaleString() || 0} <span className="text-xs text-neutral-500 ml-1">Coin</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                          user.role === 'ADMIN' 
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                            : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-max bg-emerald-500/10 text-emerald-500">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      </td>
                      <td className="p-4 text-neutral-400 text-sm">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button 
                            className="p-1.5 rounded-lg transition-colors text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
                            title="Khóa tài khoản"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          {user.role !== 'ADMIN' && (
                            <button className="p-1.5 text-neutral-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors" title="Chỉ định làm Admin">
                              <ShieldAlert className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-neutral-800 flex justify-between items-center text-sm text-neutral-400">
          <div>Hiển thị {filteredUsers.length} người dùng</div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-neutral-800 hover:bg-neutral-800 transition-colors disabled:opacity-50">Trước</button>
            <button className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-800 text-white transition-colors">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-neutral-800 hover:bg-neutral-800 transition-colors disabled:opacity-50">Tiếp</button>
          </div>
        </div>
      </div>
    </div>
  );
}
