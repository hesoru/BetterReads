import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: []
};

const BooklistSlice = createSlice({
    name: 'booklist',
    initialState,
    //TODO: update the state of addition to the wishlist in database as well!!!!!!
    reducers: {
        addToBooklist(state, action) {
            const bookId = action.payload;
            if (!state.items.includes(bookId)) {
                state.items.push(bookId);
            }
        },
        setBooklist(state, action){
           state.items = action.payload;
        },
        removeFromBooklist(state, action) {
            const bookId = action.payload;
            state.items = state.items.filter(id => id !== bookId);
        },
        clearBooklist(state) {
            state.items = [];
        },

    }
});

export const { addToBooklist,setBooklist, removeFromBooklist, clearBooklist } = BooklistSlice.actions;
export default BooklistSlice.reducer;
