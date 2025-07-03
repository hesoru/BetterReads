
import { createSlice } from '@reduxjs/toolkit';
import { loginUser, signupUser, fetchUserProfile} from './UserThunks';


export const guestUser = {
    _id: null,
    username: 'guest',
    avatarUrl: '../../src/images/icons/User_Profile_Image_NoLogo.png',
    wishList: [],
    reviews: [],
    favoriteGenres: [],
    isGuest: true,
    join_time: new Date()
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
                state.user = action.payload;
                state.status = 'succeeded';
                state.isGuest = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.isGuest = true;
            })

            .addCase(signupUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'succeeded';
                state.isGuest = false;
            })

            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isGuest = false;
            });
    },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
