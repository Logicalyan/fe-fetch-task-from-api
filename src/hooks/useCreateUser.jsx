import axios from 'axios';
import { parseCookies } from 'nookies';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const useCreateUser = () => {

    //Ambil token dari cookies
    const cookies = parseCookies();
    const token = cookies.token;

    // State untuk modal Create
    const [openCreate, setOpenCreate] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });

    // Fungsi untuk membuka modal Create
    const handleOpenCreate = () => {
        setOpenCreate(true);
    };

    // Fungsi untuk membuat user
    const handleCreateUser = async (fetchUsers) => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            toast.error("All fields are required!");
            return;
        }

        if (!token) {
            toast.error("Unauthorized: No token found");
            return;
        }

        try {
            // Kirim permintaan POST ke server
            await axios.post("http://localhost:8000/api/users", newUser, {
                headers: {
                    Authorization: `${token}`,
                }
            });
            toast.success("User created successfully!");
            setNewUser({ name: "", email: "", password: "" });
            setOpenCreate(false);
            fetchUsers();
        } catch (error) {
            console.error("Error creating user:", error);
            toast.error("Failed to create user");
        }

    };


    return {
        openCreate,
        setOpenCreate,
        newUser,
        setNewUser,
        handleOpenCreate,
        handleCreateUser
    }
}

export default useCreateUser

