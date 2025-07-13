const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const BookUtils = {
    // Get a single book by ID
    async getBookById(bookId) {
        const res = await fetch(`${BASE_URL}/books/${bookId}`);
        if (!res.ok) throw new Error('Failed to fetch book');
        return res.json();
    },

    // Search for books by query (title, author, genre, etc.)
    //TODO: decide on page/limit
    async searchBooks({ q = '', genres = [], page = 1, limit = 10 } = {}) {
        const params = new URLSearchParams();

        if (q.trim()) {
            params.append('q', q.trim());
        }

        if (Array.isArray(genres) && genres.length > 0) {
            params.append('genre', genres.join(','));
        }

        params.append('page', page);
        params.append('limit', limit);

        const queryString = params.toString();
        console.log("query: ", queryString);
        const res = await fetch(`${BASE_URL}/books/genre-search?${queryString}`);

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error?.error || 'Failed to search.py books');
        }

        const data = await res.json();

        return {
            results: data.results,
            page: data.page,
            totalPages: data.totalPages,
            totalResults: data.totalResults
        };
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

    // Get avatarUrl from username or userId
    async getUserAvatar(identifier) {
        try {
            const res = await fetch(`${BASE_URL}/users/details/${identifier}`);
            if (!res.ok) {
                // It's fine if a user isn't found (e.g., deleted), so just warn and return null.
                console.warn(`Could not fetch user details for identifier: ${identifier}. Status: ${res.status}`);
                return null;
            }
            const data = await res.json();
            return data.avatarUrl; // The new endpoint returns an object with user details
        } catch (err) {
            // Catch network errors and prevent the whole page from crashing.
            console.error(`Failed to fetch avatar for identifier ${identifier}:`, err);
            return null;
        }
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
    async upsertReview(bookId, username, { rating, description }) {
        //console.log(bookId, userId, { rating, description });
        const res = await fetch(`${BASE_URL}/books/${bookId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, rating, description }),
        });
        if (!res.ok) throw new Error('Failed to submit review');
        return res.json();
    }
};

export default BookUtils;
