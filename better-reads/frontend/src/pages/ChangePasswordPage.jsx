import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import UserUtils from "../utils/UserUtils.js";

const ChangePasswordPage = () => {
    useEffect(() => {
        // Disable scrolling when the component mounts
        document.body.style.overflow = 'hidden';

        // Re-enable scrolling when the component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    // Add this state for password validation
    const [passwordError, setPasswordError] = useState('');

    const checkPasswordStrength = (password) => {
        const minLength = 12;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);

        if (password.length < minLength) {
            setPasswordError('Password must be at least 12 characters long');
            return false;
        } else if (!hasUpper) {
            setPasswordError('Password must include at least one uppercase letter');
            return false;
        } else if (!hasLower) {
            setPasswordError('Password must include at least one lowercase letter');
            return false;
        } else if (!hasDigit) {
            setPasswordError('Password must include at least one number');
            return false;
        } else if (!hasSymbol) {
            setPasswordError('Password must include at least one special character');
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate password first
        if (!checkPasswordStrength(newPassword)) {
            return; // Stop submission if password is invalid
        }

        try {
            await UserUtils.changeUserPassword(user.username, oldPassword, newPassword);
            navigate('/search');
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-information">
                    <h1>
                        <span className="better">Better</span>
                        <span className="reads">Reads</span>
                    </h1>
                    <h2 className="tagline">
                        Change Password for {user?.username || 'user'}
                    </h2>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <label htmlFor="old-password">Old Password</label>
                            <input
                                id="old-password"
                                name="old-password"
                                type="password"
                                placeholder="Enter your old password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <label htmlFor="new-password">New Password</label>
                            <input
                                id="new-password"
                                name="new-password"
                                type="password"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="password-error" style={{ color: 'red', fontSize: '0.8rem', marginTop: '10px', textAlign: 'center', padding: '5px', backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: '4px' }}>
                                {error}
                            </div>
                        )}

                        {passwordError && (
                            <div className="password-error" style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px', textAlign: 'center' }}>
                                {passwordError}
                            </div>
                        )}
                        <div className="button-row">
                            <button type="submit">Change Password</button>
                            <button type="button" onClick={() => navigate(-1)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
