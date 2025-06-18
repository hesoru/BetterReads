import { createAsyncThunk } from '@reduxjs/toolkit';
import BookUtils from "../utils/BookUtils.js";

import {addToBooklist, removeFromBooklist} from "./Booklist.js"; // fix path if needed

export const addToBookListThunk = createAsyncThunk(
    'user/addToBookList',
    async ({ userId, bookId }, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const isGuest = state.user.isGuest;
            console.log("isGuest: ", isGuest);

            if (!isGuest) {
                await BookUtils.updateWishlist(bookId, userId, "add");
            }

            thunkAPI.dispatch(addToBooklist(bookId));
        } catch (err) {
            console.error("Failed to add to wishlist:", err);
        }
    }
);


export const removeFromBookListThunk = createAsyncThunk(
    'user/removeFromBookList',
    async ({ userId, bookId }, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const isGuest = state.user.isGuest;
            console.log("isGuest: ", isGuest);
            if (!isGuest) {
                await BookUtils.updateWishlist(bookId, userId, "remove");
            }

            thunkAPI.dispatch(removeFromBooklist(bookId));
        } catch (err) {
            console.error("Failed to add to wishlist:", err);
        }
    }
);

