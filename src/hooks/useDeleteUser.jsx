import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { parseCookies } from "nookies";

export default function useDeleteUser() {

    //Ambil token dari cookies
        const cookies = parseCookies();
        const token = cookies.token;

    // State untuk modal Delete
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);

    // Fungsi untuk membuka modal Delete
    const handleDeleteConfirm = (id) => {
        setDeleteUserId(id);
        setOpenDelete(true);
    };

    // Fungsi untuk menghapus user
    const handleDelete = async (fetchUsers) => {
        if (!deleteUserId) return;

        if (!token) {
            toast.error("Unauthorized: No token found");
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/users/${deleteUserId}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            toast.success("User deleted successfully!");
            fetchUsers(); // Memperbarui data setelah delete
        } catch (error) {
            toast.error("Failed to delete user");
        } finally {
            setOpenDelete(false);
            setDeleteUserId(null);
        }
    };

    // Mengembalikan state dan fungsi
    return { openDelete, setOpenDelete, handleDeleteConfirm, handleDelete, deleteUserId };
}
