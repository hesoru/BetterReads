import { configureStore } from '@reduxjs/toolkit';
import booklistReducer from '../redux/Booklist.js';
import userReducer, {guestUser} from '../redux/UserSlice.js';


const loadAppStateFromLocalStorage = () => {
    try {
        const serialized = localStorage.getItem('appState');
        if (serialized) return JSON.parse(serialized);
        return {
            userInfo: { user: guestUser, status: 'idle', error: null, isGuest: true },
            booklist: { items: [] }
        };
    } catch (err) {
        return {
            userInfo: { user: guestUser, status: 'idle', error: null, isGuest: true },
            booklist: { items: [] }
        };
    }
};

const saveAppStateToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('appState', serializedState);
    } catch (err) {
        console.error('Error saving app state to localStorage:', err);
    }
};

const preloadedState = loadAppStateFromLocalStorage();

const store = configureStore({
    reducer: {
        booklist: booklistReducer,
        user: userReducer,
    },
    preloadedState
});

store.subscribe(() => {
    const { user, booklist } = store.getState();
    saveAppStateToLocalStorage({ user, booklist });
});

export default store;
