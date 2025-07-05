
import { createSlice } from '@reduxjs/toolkit';
import {loginUser, signupUser, fetchUserProfile, logoutUser} from './UserThunks';


export const guestUser = {
    _id: null,
    username: 'guest',
    avatarUrl: '../../src/images/icons/User_Profile_Image_NoLogo.png',
    wishList: [],
    reviews: [],
    favoriteGenres: [],
    isGuest: true,
    join_time: new Date().toISOString() // Use ISO string instead of Date object
};
const initialState = {
    user: guestUser,
    status: 'idle',
    error: null,
    isGuest: true
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUser(state) {
            state.user = guestUser;
            state.status = 'idle';
            state.error = null;
            state.isGuest = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                // Convert Date object to string to ensure serialization
                const payload = {...action.payload};
                if (payload.join_time && payload.join_time instanceof Date) {
                    payload.join_time = payload.join_time.toISOString();
                }
                state.user = payload;
                state.status = 'succeeded';
                state.isGuest = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.isGuest = true;
            })

            .addCase(signupUser.fulfilled, (state, action) => {
                // Convert Date object to string to ensure serialization
                const payload = {...action.payload};
                if (payload.join_time && payload.join_time instanceof Date) {
                    payload.join_time = payload.join_time.toISOString();
                }
                state.user = payload;
                state.status = 'succeeded';
                state.isGuest = false;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                // Convert Date object to string to ensure serialization
                const payload = {...action.payload};
                if (payload.join_time && payload.join_time instanceof Date) {
                    payload.join_time = payload.join_time.toISOString();
                }
                state.user = payload;
                state.isGuest = false;
            });
    },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
