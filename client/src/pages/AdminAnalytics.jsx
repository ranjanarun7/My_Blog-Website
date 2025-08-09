import { useEffect, useState } from "react";

export default function AdminAnalytics() {
  const [visitors, setVisitors] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showUsers, setShowUsers] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in as admin to view analytics.");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          let msg = "Access denied";
          try {
            const data = await res.json();
            msg = data.message || msg;
          } catch {
            msg = await res.text();
          }
          throw new Error(msg);
        }
        return res.json();
      })
      .then((data) => {
        setVisitors(data.visitors || []);
        setUsers(data.users || []);
        setTotalUsers(data.totalUsers || 0);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          📊 Visitor & User Activity
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {!error && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <h2 className="text-lg font-semibold text-gray-700 cursor-pointer" onClick={() => setShowUsers(!showUsers)}>
                  Total Registered Users
                </h2>
                <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <h2 className="text-lg font-semibold text-gray-700">Visitors (Last 1 Month)</h2>
                <p className="text-3xl font-bold text-green-600">{visitors.length}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <h2 className="text-lg font-semibold text-gray-700">All-Time Users</h2>
                <p className="text-3xl font-bold text-purple-600">{users.length}</p>
              </div>
            </div>

            {/* Users Table Toggle */}
            {showUsers && (
              <>
                <h2 className="text-xl font-bold mb-3">All Registered Users</h2>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="px-4 py-2 border">Username</th>
                        <th className="px-4 py-2 border">Email</th>
                        <th className="px-4 py-2 border">Role</th>
                        <th className="px-4 py-2 border">Registered At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((u, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-4 py-2 border">{u.username}</td>
                            <td className="px-4 py-2 border">{u.email}</td>
                            <td className="px-4 py-2 border">{u.role}</td>
                            <td className="px-4 py-2 border">{new Date(u.createdAt).toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-4 text-gray-500 border">
                            No registered users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Visitors Table */}
            <h2 className="text-xl font-bold mb-3">Recent Visitors (Last 1 Month)</h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 border">Username</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">IP</th>
                    <th className="px-4 py-2 border">Country</th>
                    <th className="px-4 py-2 border">City</th>
                    <th className="px-4 py-2 border max-w-xs truncate">Browser</th>
                    <th className="px-4 py-2 border">Path</th>
                    <th className="px-4 py-2 border">Visited At</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.length > 0 ? (
                    visitors.map((v, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-2 border">{v.username || "-"}</td>
                        <td className="px-4 py-2 border">{v.email || "-"}</td>
                        <td className="px-4 py-2 border">{v.ip}</td>
                        <td className="px-4 py-2 border">{v.country}</td>
                        <td className="px-4 py-2 border">{v.city}</td>
                        <td className="px-4 py-2 border max-w-xs truncate">{v.userAgent}</td>
                        <td className="px-4 py-2 border">{v.path}</td>
                        <td className="px-4 py-2 border">{new Date(v.visitedAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-gray-500 border">
                        No visitors in last month
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
