import { createSlice } from '@reduxjs/toolkit';
import sampleData from "../sampleData2.json";

const initialState = {
    items: sampleData.user.favoriteBooks
};

const BooklistSlice = createSlice({
    name: 'booklist',
    initialState,
    //TODO: update the state of addition to the wishlist in database as well!!!!!!
    reducers: {
        addToBooklist(state, action) {
            const isbn = action.payload;
            if (!state.items.includes(isbn)) {
                state.items.push(isbn);
            }
        },
        removeFromBooklist(state, action) {
            const isbn = action.payload;
            state.items = state.items.filter(id => id !== isbn);
        },
        clearBooklist(state) {
            state.items = [];
        }
    }
});

export const { addToBooklist, removeFromBooklist, clearBooklist } = BooklistSlice.actions;
export default BooklistSlice.reducer;
