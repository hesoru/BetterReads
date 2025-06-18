import { createAsyncThunk } from '@reduxjs/toolkit';
import BookUtils from "../utils/BookUtils.js";

import {addToBooklist, removeFromBooklist} from "./Booklist.js"; // fix path if needed

export const addToBookList = createAsyncThunk(
    'user/addToBookList',
    async ({ userId, bookId }, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const isGuest = state.isGuest;

            if (!isGuest) {
                await BookUtils.addToWishlist(bookId, userId);
            }

            thunkAPI.dispatch(addToBooklist(bookId));
        } catch (err) {
            console.error("Failed to add to wishlist:", err);
        }
    }
);


export const removeFromBookList = createAsyncThunk(
    'user/removeFromBookList',
    async ({ userId, bookId }, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const isGuest = state.isGuest;

            if (!isGuest) {
                await BookUtils.removeFromWishlist(bookId, userId);
            }

            thunkAPI.dispatch(removeFromBooklist(bookId));
        } catch (err) {
            console.error("Failed to add to wishlist:", err);
        }
    }
);

