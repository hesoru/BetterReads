import {configureStore} from "@reduxjs/toolkit";
import Booklist from "../redux/Booklist.jsx";
import userReducer from "../redux/UserSlice.js";


const store = configureStore({
    reducer: {
        booklist: Booklist,
        user: userReducer
    },
});

export default store;