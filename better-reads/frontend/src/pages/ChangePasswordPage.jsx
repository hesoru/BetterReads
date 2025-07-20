import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Backend logic to be implemented later
        console.log('Password change submitted');
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
                            <div className="signup-error" style={{ color: 'red', fontSize: '0.8rem', marginTop: '10px', textAlign: 'center', padding: '5px', backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: '4px' }}>
                                Error: {error}
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
