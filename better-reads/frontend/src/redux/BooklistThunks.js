import { createAsyncThunk } from '@reduxjs/toolkit';
import BookUtils from "../utils/BookUtils.js";

import {addToWantToRead, removeFromWantToRead, addToFinished, removeFromFinished, setWantToRead, setFinished} from "./Booklist.js";

// Want to Read List Thunks
export const addToWantToReadThunk = createAsyncThunk(
    'user/addToWantToRead',
    async ({ userId, bookId }, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const isGuest = state.user.isGuest;
            console.log("isGuest: ", isGuest);

            if (!isGuest) {
                const result = await BookUtils.addToWantToRead(bookId, userId);
                thunkAPI.dispatch(setWantToRead(result.wantToRead));
                thunkAPI.dispatch(setFinished(result.finished));
            } else {
                thunkAPI.dispatch(addToWantToRead(bookId));
            }
        } catch (err) {
            console.error("Failed to add to want to read list:", err);
        }
    }
);

export const removeFromWantToReadThunk = createAsyncThunk(
    'user/removeFromWantToRead',
    async ({ userId, bookId }, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const isGuest = state.user.isGuest;
            console.log("isGuest: ", isGuest);
            if (!isGuest) {
                const result = await BookUtils.removeFromWantToRead(bookId, userId);
                thunkAPI.dispatch(setWantToRead(result.wantToRead));
                thunkAPI.dispatch(setFinished(result.finished));
            } else {
                thunkAPI.dispatch(removeFromWantToRead(bookId));
            }
        } catch (err) {
            console.error("Failed to remove from want to read list:", err);
        }
    }
);

// Finished List Thunks
export const addToFinishedThunk = createAsyncThunk(
    'user/addToFinished',
    async ({ userId, bookId }, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const isGuest = state.user.isGuest;
            console.log("isGuest: ", isGuest);

            if (!isGuest) {
                const result = await BookUtils.addToFinished(bookId, userId);
                thunkAPI.dispatch(setWantToRead(result.wantToRead));
                thunkAPI.dispatch(setFinished(result.finished));
            } else {
                thunkAPI.dispatch(addToFinished(bookId));
            }
        } catch (err) {
            console.error("Failed to add to finished list:", err);
        }
    }
);

export const removeFromFinishedThunk = createAsyncThunk(
    'user/removeFromFinished',
    async ({ userId, bookId }, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const isGuest = state.user.isGuest;
            console.log("isGuest: ", isGuest);
            if (!isGuest) {
                const result = await BookUtils.removeFromFinished(bookId, userId);
                thunkAPI.dispatch(setWantToRead(result.wantToRead));
                thunkAPI.dispatch(setFinished(result.finished));
            } else {
                thunkAPI.dispatch(removeFromFinished(bookId));
            }
        } catch (err) {
            console.error("Failed to remove from finished list:", err);
        }
    }
);

// Move between lists
export const markAsFinishedThunk = createAsyncThunk(
    'user/markAsFinished',
    async ({ userId, bookId }, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const isGuest = state.user.isGuest;
            console.log("isGuest: ", isGuest);

            if (!isGuest) {
                const result = await BookUtils.markAsFinished(bookId, userId);
                thunkAPI.dispatch(setWantToRead(result.wantToRead));
                thunkAPI.dispatch(setFinished(result.finished));
            } else {
                thunkAPI.dispatch(removeFromWantToRead(bookId));
                thunkAPI.dispatch(addToFinished(bookId));
            }
        } catch (err) {
            console.error("Failed to mark book as finished:", err);
        }
    }
);

export const markAsWantToReadThunk = createAsyncThunk(
    'user/markAsWantToRead',
    async ({ userId, bookId }, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const isGuest = state.user.isGuest;
            console.log("isGuest: ", isGuest);

            if (!isGuest) {
                const result = await BookUtils.markAsWantToRead(bookId, userId);
                thunkAPI.dispatch(setWantToRead(result.wantToRead));
                thunkAPI.dispatch(setFinished(result.finished));
            } else {
                thunkAPI.dispatch(removeFromFinished(bookId));
                thunkAPI.dispatch(addToWantToRead(bookId));
            }
        } catch (err) {
            console.error("Failed to mark book as want to read:", err);
        }
    }
);

