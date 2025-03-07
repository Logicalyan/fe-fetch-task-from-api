import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const useEditUser = () => {
    const [openEdit, setOpenEdit] = useState(false);
    const [editUser, setEditUser] = useState({ id: "", name: "", email: "" });

    const handleOpenEdit = (user) => {
        setEditUser(user);
        setOpenEdit(true);
    };

    const handleEdit = async (fetchUsers) => {
        if (!editUser.id || !editUser.name || !editUser.email) {
            toast.error("All fields are required");
            return;
        }

        try {
            await axios.put(`http://localhost:8000/api/users/${editUser.id}`, editUser);
            toast.success("User updated successfully");
            setOpenEdit(false);
            fetchUsers(); // Fetch data setelah update berhasil
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Failed to update user");
        }
    };

    return {
        openEdit,
        setOpenEdit,
        editUser,
        setEditUser,
        handleOpenEdit,
        handleEdit
    };
};

export default useEditUser;
