import {configureStore} from "@reduxjs/toolkit";
import Booklist from "../states/Booklist.jsx";


const store = configureStore({
    reducer: {
        booklist: Booklist

    },
});

export default store;