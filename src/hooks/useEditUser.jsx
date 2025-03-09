import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { parseCookies } from "nookies";

const useEditUser = () => {

    //Ambil token dari cookies
    const cookies = parseCookies();
    const token = cookies.token;

    // State untuk modal Edit
    const [openEdit, setOpenEdit] = useState(false);
    const [editUser, setEditUser] = useState({ id: "", name: "", email: "" });

    // Fungsi untuk membuka modal Edit
    const handleOpenEdit = (user) => {
        setEditUser(user);
        setOpenEdit(true);
    };

    // Fungsi untuk menyimpan perubahan pada modal Edit
    const handleEdit = async (fetchUsers) => {
        if (!editUser.id || !editUser.name || !editUser.email) {
            toast.error("All fields are required");
            return;
        }

        if (!token) {
            toast.error("Unauthorized: No token found");
            return;
        }

        try {
            // Kirim permintaan PUT ke server
            await axios.put(`http://localhost:8000/api/users/${editUser.id}`, editUser,{
                headers: {
                    Authorization: `${token}`,
                },
            });
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
