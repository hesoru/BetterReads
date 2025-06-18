
import { createAsyncThunk } from '@reduxjs/toolkit';
import {clearBooklist, setBooklist} from "./Booklist.js";


export const loginUser = createAsyncThunk(
    'user/loginUser',
    async ({ username, password}, thunkAPI) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password}),
            });

            if (!res.ok) {
                const error = await res.json();
                return thunkAPI.rejectWithValue(error.message || 'Login failed');
            }

            const data = await res.json();

            thunkAPI.dispatch(setBooklist(data.wishList));
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue('Login request failed', err);
        }
    }
);

// 2. User signup
export const signupUser = createAsyncThunk(
    'user/signupUser',
    async ({ username, password, favoriteGenres }, thunkAPI) => {
        try {
            // Step 1: POST to /signup
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, favoriteGenres }),
            });

            if (!res.ok) {
                const error = await res.json();
                return thunkAPI.rejectWithValue(error.message || 'Signup failed');
            }

            // Step 2: GET full user info
            const profileRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/get-user/${username}`);
            if (!profileRes.ok) {
                const error = await profileRes.json();
                return thunkAPI.rejectWithValue(error.message || 'Failed to fetch profile');
            }

            const user = await profileRes.json();

            // Step 3: Clear guest booklist if necessary
            const currentState = thunkAPI.getState();
            if (currentState.user?.user?.isGuest) {
                thunkAPI.dispatch(clearBooklist());
            }


            thunkAPI.dispatch(setBooklist(user.wishList || []));

            return user; //
        } catch (err) {
            return thunkAPI.rejectWithValue('Signup request failed');
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
