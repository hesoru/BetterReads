import BookUtils from "./BookUtils.js";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const UserUtils = {
    async changeUserPassword(username, oldPassword, newPassword) {
        try {
            const res = await fetch(`${BASE_URL}/users/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // You can also include Authorization headers here if needed
                },
                body: JSON.stringify({
                    username,
                    currentPassword: oldPassword,
                    newPassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            return data;
        } catch (err) {
            console.error('Change password error:', err.message);
            throw err;
        }
    }
}

export default UserUtils;