// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { loginUser, signupUser, fetchUserProfile, logoutUser } from './userThunks';

const initialState = {
    user: null, // will hold the entire user object
    status: 'idle',
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUser(state) {
            state.user = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'succeeded';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(signupUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'succeeded';
            })

            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            })

            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.status = 'idle';
            });
    },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
