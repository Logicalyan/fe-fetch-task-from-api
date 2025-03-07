import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function useDeleteUser() {
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

        try {
            await axios.delete(`http://localhost:8000/api/users/${deleteUserId}`);
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
