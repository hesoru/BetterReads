
import { createSlice } from '@reduxjs/toolkit';
import { loginUser, signupUser, fetchUserProfile} from './userThunks';


export const guestUser = {
    _id: null,
    username: 'guest',
    avatarUrl: 'https://ui-avatars.com/api/?name=Guest&background=888',
    wishList: [],
    reviews: [],
    favoriteGenres: [],
    isGuest: true
};
const initialState = {
    user: guestUser, // will hold the entire user object
    status: 'idle',
    error: null,
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUser(state) {
            state.user = guestUser;
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
            });
    },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
