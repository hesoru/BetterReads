
import { createAsyncThunk } from '@reduxjs/toolkit';
import {clearBooklist, setBooklist} from "./Booklist.js";
import {clearUser} from "./UserSlice.js";


export const loginUser = createAsyncThunk(
    'user/loginUser',
    async ({ username, password}, thunkAPI) => {
        try {

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if (!res.ok) {
                const error = await res.json();
                return thunkAPI.rejectWithValue(error.message || 'Login failed');
            }

            const data = await res.json();
            localStorage.setItem('token', data.token);
            thunkAPI.dispatch(setBooklist(data.user.wishList));
            return data.user;
        } catch (err) {
            return thunkAPI.rejectWithValue('Login request failed', err);
        }
    }
);

// 2. User signup
export const signupUser = createAsyncThunk(
    'user/signupUser',
    async ({ username, password, favoriteGenres}, thunkAPI) => {
        try {
            const { getState } = thunkAPI;
            //const state = getState();
            const wishList  = thunkAPI.getState().booklist.items;
            console.log("Wishlist: ", wishList);
            // Step 1: POST to /signup
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, favoriteGenres, wishList }),
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


export const logoutUser = createAsyncThunk('user/logoutUser', async (_, thunkAPI) => {
    const { dispatch} = thunkAPI;
    dispatch(clearUser());
    dispatch(clearBooklist());
    localStorage.removeItem('appState');
    localStorage.removeItem('user');
    return true;
});


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
