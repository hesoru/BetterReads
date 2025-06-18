const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const BookUtils = {
    // Get a single book by ID
    async getBookById(bookId) {
        const res = await fetch(`${BASE_URL}/books/${bookId}`);
        if (!res.ok) throw new Error('Failed to fetch book');
        return res.json();
    },

    // Search for books by query (title, author, genre, etc.)
    async searchBooks(params = {}) {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${BASE_URL}/books/search?${query}`);
        if (!res.ok) throw new Error('Failed to search books');
        return res.json();
    },

    async updateWishlist(bookId, userId, operation) {
        const res = await fetch(`${BASE_URL}/users/update-wishlist/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId, operation }),
        });

        if (!res.ok) throw new Error(`Failed to ${operation} wishlist`);
        return res.json();
    },

    // // Add a book to the user's wishlist
    // async addToWishlist(bookId, userId) {
    //     const res = await fetch(`${BASE_URL}/books/${bookId}/wishlist`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ userId }),
    //     });
    //     if (!res.ok) throw new Error('Failed to add to wishlist');
    //     return res.json();
    // },
    //
    // // Remove a book from the user's wishlist
    // async removeFromWishlist(bookId, userId) {
    //     const res = await fetch(`${BASE_URL}/books/${bookId}/wishlist`, {
    //         method: 'DELETE',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ userId }),
    //     });
    //     if (!res.ok) throw new Error('Failed to remove from wishlist');
    //     return res.json();
    // },

    // Get all reviews for a book
    async getBookReviews(bookId) {
        const res = await fetch(`${BASE_URL}/books/${bookId}/reviews`);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        return res.json();
    },

    // Get avatarUrl from username
    async getUserAvatar(username) {
        const res = await fetch(`${BASE_URL}/users/avatarUrl/${username}`);
        //console.log("avatarurl", res);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        return res.json();
    },

    // Get a single user's review for a book
    async getUserReview(bookId, userId) {
        try {
            const res = await fetch(`${BASE_URL}/reviews/user-review?bookId=${bookId}&userId=${userId}`);
            if (!res.ok) throw new Error('Failed to fetch user review');
            return await res.json(); // could be null if no review
        } catch (err) {
            console.error('Error fetching user review:', err);
            return null;
        }
    },

    // Create or update a user's review for a book
    async upsertReview(bookId, userId, { rating, description }) {
        //console.log(bookId, userId, { rating, description });
        const res = await fetch(`${BASE_URL}/books/${bookId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, rating, description }),
        });
        if (!res.ok) throw new Error('Failed to submit review');
        return res.json();
    }
};

export default BookUtils;
