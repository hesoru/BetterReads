import { configureStore } from '@reduxjs/toolkit';
import Booklist from '../redux/Booklist.jsx';
import userReducer, {guestUser} from '../redux/UserSlice.js';

// Load user state from localStorage

const loadUserFromLocalStorage = () => {
    try {
        const serialized = localStorage.getItem('userState');
        if (serialized) return JSON.parse(serialized);
        return { user: guestUser, status: 'idle', error: null };
    } catch (err) {
        return { user: guestUser, status: 'idle', error: null };
    }
};


// Save user state to localStorage
const saveUserToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('userState', serializedState);
    } catch (err) {
        console.error('Error saving user state to localStorage:', err);
    }
};

// Load initial user state (preloading just that slice)
const preloadedUserState = loadUserFromLocalStorage();

const store = configureStore({
    reducer: {
        booklist: Booklist,
        user: userReducer,
    },
    preloadedState: {
        user: preloadedUserState,
    },
});

//  Subscribe to store updates and persist user state only
store.subscribe(() => {
    const { user } = store.getState();
    saveUserToLocalStorage(user);
});

export default store;
