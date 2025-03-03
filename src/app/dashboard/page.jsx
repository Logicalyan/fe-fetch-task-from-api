"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast, Toaster } from "react-hot-toast";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sun, Moon } from "lucide-react";

export default function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    next_page_url: null,
    prev_page_url: null,
  });
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });

  // State untuk modal Edit
  const [openEdit, setOpenEdit] = useState(false);
  const [editUser, setEditUser] = useState({ id: "", name: "", email: "" });

  //State untuk modal Delete
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // State untuk dark mode
  const [darkMode, setDarkMode] = useState(() => {
    return typeof window !== "undefined" ? localStorage.getItem("theme") === "dark" : false;
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const fetchUsers = (page = 1) => {
    setLoading(true);
    axios.get(`http://localhost:8000/api/users?page=${page}`)
      .then((response) => {
        const paginated = response.data.data;
        setUsers(paginated.data);
        setPagination({
          current_page: paginated.current_page,
          last_page: paginated.last_page,
          next_page_url: paginated.next_page_url,
          prev_page_url: paginated.prev_page_url,
        });
      })
      .catch(() => {
        toast.error("Failed to fetch users");
      })
      .finally(() => setLoading(false));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("All fields are required!");
      return;
    }

    axios.post("http://localhost:8000/api/users", newUser)
      .then(() => {
        toast.success("User created successfully!");
        setNewUser({ name: "", email: "", password: "" });
        setIsCreateOpen(false);
        fetchUsers();
      })
      .catch(() => {
        toast.error("Failed to create user");
      });
  };

  // Buka modal Edit dengan data user yang dipilih
  const handleOpenEdit = (user) => {
    setEditUser(user);
    setOpenEdit(true);
  };

  // Handle edit user
  const handleEdit = async () => {
    if (!editUser.name || !editUser.email) {
      toast.error("All fields are required");
      return;
    }

    try {
      await axios.put(`http://localhost:8000/api/users/${editUser.id}`, editUser);
      toast.success("User updated successfully");

      // Setelah update, re-fetch halaman saat ini
      fetchUsers(pagination.current_page);
      setOpenEdit(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };



  const handleDeleteConfirm = (id) => {
    setDeleteUserId(id);
    setOpenDelete(true);
  };

  // Handle delete user
  const handleDelete = async () => {
    if (!deleteUserId) return

    try {
      await axios.delete(`http://localhost:8000/api/users/${deleteUserId}`);
      toast.success("User deleted successfully");
      fetchUsers(pagination.current_page);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setOpenDelete(false);
      setDeleteUserId(null);
    }
  };

  return (
    <div className={`p-6 flex justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen`}>
      <Toaster position="top-right" />
      <Card className="w-full max-w-7xl shadow-lg rounded-2xl">
        <CardHeader className="flex items-center">
          <CardTitle className="text-3xl font-semibold">User Dashboard</CardTitle>
          {/* <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div> */}
        </CardHeader>

        <CardContent>
          <div className="flex justify-between items-center mb-4 gap-2">
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>Buat User</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter name"
                  />
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email"
                  />
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Enter password"
                  />
                  <Button onClick={handleCreateUser} className="w-full">Submit</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Input
              type="text"
              placeholder="Cari users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />

            <Button onClick={toggleDarkMode} variant="ghost">
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </Button>
          </div>

          {loading ? (
            <Skeleton className="w-full h-40 rounded-lg" />
          ) : (
            <>
              <Table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                <TableHeader className="bg-gray-200 dark:bg-gray-700">
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <TableRow key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="flex gap-2 justify-center">
                        <Button size="sm" onClick={() => handleOpenEdit(user)}>Ubah</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteConfirm(user.id)}>Hapus</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center mt-4">
                {pagination.prev_page_url ? (
                  <Button onClick={() => fetchUsers(pagination.current_page - 1)}>Previous</Button>
                ) : (
                  <span />
                )}
                <span>
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
                {pagination.next_page_url ? (
                  <Button onClick={() => fetchUsers(pagination.current_page + 1)}>Next</Button>
                ) : (
                  <span />
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal Edit User */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Name</Label>
            <Input value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
            <Label>Email</Label>
            <Input value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
            <Button className="w-full" onClick={handleEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Delete User */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
          </DialogHeader>
          <p>Apakah kamu yakin ingin menghapus user ini?</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpenDelete(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
