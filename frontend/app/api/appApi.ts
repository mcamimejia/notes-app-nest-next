"use client";

import axios from 'axios';

export default () => {
    const api = axios.create({
        baseURL: 'http://localhost:4000',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }

    return api;
}