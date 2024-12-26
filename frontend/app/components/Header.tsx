"use client";

import { useRouter } from 'next/navigation';
import React from 'react';

const Header: React.FC = () => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <header className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h2 className="text-2xl font-bold">Notes App</h2>
                <button
                    onClick={handleLogout}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;