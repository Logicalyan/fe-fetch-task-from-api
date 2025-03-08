"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast, Toaster } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Sun, Moon } from "lucide-react";

import ModalsEdit from "@/components/dashboard/ModalsEdit";
import ModalsDelete from "@/components/dashboard/ModalsDelete";

import useEditUser from "@/hooks/useEditUser";
import useDeleteUser from "@/hooks/useDeleteUser";
import useCreateUser from "@/hooks/useCreateUser";
import ModalsCreate from "@/components/dashboard/ModalsCreate";
import { useRouter } from "next/navigation";
import { destroyCookie, parseCookies } from "nookies";

export default function UserDashboard() {

  const router = useRouter();
  const cookies = parseCookies();
  const token = cookies.token;

  //Hooks for modal create
  const { openCreate, setOpenCreate, handleOpenCreate, newUser, setNewUser, handleCreateUser } = useCreateUser();

  //Hooks for modal edit
  const { openEdit, setOpenEdit, editUser, setEditUser, handleOpenEdit, handleEdit } = useEditUser();

  //Hooks for modal delete
  const { openDelete, setOpenDelete, handleDeleteConfirm, handleDelete } = useDeleteUser();
  
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    next_page_url: null,
    prev_page_url: null,
  });

  const [loading, setLoading] = useState(true);

  // State untuk dark mode
  const [darkMode, setDarkMode] = useState(() => {
    return typeof window !== "undefined" ? localStorage.getItem("theme") === "dark" : false;
  });

  // Memeriksa apakah pengguna sudah login
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);  
  
  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, [])
  const fetchUsers = (page = 1) => {
    setLoading(true);
    axios.get(`http://localhost:8000/api/users?page=${page}`, {
      headers: {
        Authorization: `${token}`,
      }
    })
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

const handleLogout = async () => {
    try {
        await axios.post(
            "http://localhost:8000/api/logout",
            {},
            {
                headers: {
                    Authorization: `${token}`,
                },
            }
        );

        destroyCookie(null, "token");
        // localStorage.removeItem("name"); // Hapus nama user jika diperlukan
        router.push("/login");
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`p-6 flex justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen`}>
      <Toaster position="top-right" />
      <Card className="w-full max-w-7xl shadow-lg rounded-2xl">
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle className="md:text-3xl font-semibold">User Dashboard</CardTitle>
          {/* <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div> */}
          <Button onClick={handleLogout} variant="destructive">Logout</Button>
        </CardHeader>

        <CardContent>
          <div className="flex justify-between items-center mb-4 gap-2">
            <Button onClick={handleOpenCreate}>Buat User</Button>
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

      {/* Modal Create User */}
      <ModalsCreate openCreate={openCreate} setOpenCreate={setOpenCreate} newUser={newUser} setNewUser={setNewUser} handleCreateUser={()=> handleCreateUser(fetchUsers)} />

      {/* Modal Edit User */}
      <ModalsEdit open={openEdit} setOpen={setOpenEdit} editUser={editUser} setEditUser={setEditUser} handleEdit={() => handleEdit(fetchUsers)} />

      {/* Modal Delete User */}
      <ModalsDelete openDelete={openDelete} setOpenDelete={setOpenDelete} handleDelete={() => handleDelete(fetchUsers)}/>

    </div>
  );
}