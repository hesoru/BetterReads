
import { createAsyncThunk } from '@reduxjs/toolkit';

// 1. User login and return only username
export const loginUser = createAsyncThunk(
    'user/loginUser',
    async ({ username, password }, thunkAPI) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const error = await res.json();
                return thunkAPI.rejectWithValue(error.message || 'Login failed');
            }

            const data = await res.json();

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue('Login request failed', err);
        }
    }
);

// 2. User signup
export const signupUser = createAsyncThunk(
    'user/signupUser',
    async ({ username, password }, thunkAPI) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const error = await res.json();
                return thunkAPI.rejectWithValue(error.message || 'Signup failed');
            }

            const data = await res.json();
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue('Signup request failed', err);
        }
    }
);

// 3. Fetch user profile
export const fetchUserProfile = createAsyncThunk(
    'user/fetchUserProfile',
    async (userId, thunkAPI) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`, {
                credentials: 'include',
            });

            if (!res.ok) {
                return thunkAPI.rejectWithValue('Failed to fetch profile');
            }

            const data = await res.json();
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue('Profile request failed', err);
        }
    }
);


// // Logout for cookie session if we want
// export const logoutUser = createAsyncThunk(
//     'user/logoutUser',
//     async (_, thunkAPI) => {
//         try {
//             await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/logout`, {
//                 method: 'POST',
//                 credentials: 'include',
//             });
//             return true;
//         } catch (err) {
//             return thunkAPI.rejectWithValue('Logout failed', err);
//         }
//     }
// );
