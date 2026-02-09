import { useEffect, useState } from "react";
import API from "../api/api"; 

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); 

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      alert("User removed successfully.");
    } catch (error) {
      alert("Failed to delete user.",error);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading users...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          Total Users: {users.length}
        </span>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
              <tr>
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b">Role</th>
                <th className="p-4 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-500">#{u.id}</td>
                    <td className="p-4 font-medium text-gray-900">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : u.role === "seller"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition font-medium text-sm"
                        disabled={u.role === "admin"} 
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;