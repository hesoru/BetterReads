import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import UserUtils from "../utils/UserUtils.js";
import { sanitizeContent } from '../utils/sanitize.js';

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validate old password input
    const validateOldPassword = (password) => {
        const sanitized = sanitizeContent(password);
        
        if (!sanitized) {
            setOldPasswordError('Old password is required');
            return false;
        }
        
        if (sanitized.length < 12) {
            setOldPasswordError('Old password must be at least 12 characters long');
            return false;
        }
        
        if (sanitized.length > 128) {
            setOldPasswordError('Old password is too long');
            return false;
        }
        
        // Check for suspicious patterns
        if (/[<>"'&]/.test(sanitized)) {
            setOldPasswordError('Old password contains invalid characters');
            return false;
        }
        
        setOldPasswordError('');
        return true;
    };

    const checkPasswordStrength = (password) => {
        const sanitized = sanitizeContent(password);
        const minLength = 12;
        const maxLength = 128;
        
        // Basic validation
        if (!sanitized) {
            setPasswordError('New password is required');
            return false;
        }
        
        if (sanitized.length < minLength) {
            setPasswordError('Password must be at least 12 characters long');
            return false;
        }
        
        if (sanitized.length > maxLength) {
            setPasswordError('Password must be less than 128 characters');
            return false;
        }
        
        // Check for suspicious patterns
        if (/[<>"'&]/.test(sanitized)) {
            setPasswordError('Password contains invalid characters');
            return false;
        }
        
        // Password strength requirements
        const hasUpper = /[A-Z]/.test(sanitized);
        const hasLower = /[a-z]/.test(sanitized);
        const hasDigit = /[0-9]/.test(sanitized);
        const hasSymbol = /[^A-Za-z0-9]/.test(sanitized);
        
        if (!hasUpper) {
            setPasswordError('Password must include at least one uppercase letter');
            return false;
        }
        
        if (!hasLower) {
            setPasswordError('Password must include at least one lowercase letter');
            return false;
        }
        
        if (!hasDigit) {
            setPasswordError('Password must include at least one number');
            return false;
        }
        
        if (!hasSymbol) {
            setPasswordError('Password must include at least one special character');
            return false;
        }
        
        // Check if new password is same as old password
        if (sanitized === sanitizeContent(oldPassword)) {
            setPasswordError('New password must be different from old password');
            return false;
        }
        
        // Check for common weak patterns
        const weakPatterns = [
            /123456/,
            /password/i,
            /qwerty/i,
            /admin/i,
            /(.)\1{3,}/ // repeated characters
        ];
        
        for (const pattern of weakPatterns) {
            if (pattern.test(sanitized)) {
                setPasswordError('Password contains common weak patterns');
                return false;
            }
        }
        
        setPasswordError('');
        return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setPasswordError('');
        setOldPasswordError('');
        
        // Prevent double submission
        if (isSubmitting) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Validate old password
            if (!validateOldPassword(oldPassword)) {
                setIsSubmitting(false);
                return;
            }
            
            // Validate new password
            if (!checkPasswordStrength(newPassword)) {
                setIsSubmitting(false);
                return;
            }
            
            // Sanitize inputs before sending
            const sanitizedOldPassword = sanitizeContent(oldPassword);
            const sanitizedNewPassword = sanitizeContent(newPassword);
            
            // Additional security check
            if (!sanitizedOldPassword || !sanitizedNewPassword) {
                setError('Invalid input detected. Please try again.');
                setIsSubmitting(false);
                return;
            }
            
            await UserUtils.changeUserPassword(user.username, sanitizedOldPassword, sanitizedNewPassword);
            navigate('/search');
        } catch (err) {
            setError(err.message || 'An error occurred while changing password');
            console.error('Password change error:', err);
        } finally {
            setIsSubmitting(false);
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
                                onChange={(e) => {
                                    const sanitized = sanitizeContent(e.target.value);
                                    setOldPassword(sanitized);
                                    if (oldPasswordError) {
                                        validateOldPassword(sanitized);
                                    }
                                }}
                                onBlur={(e) => validateOldPassword(e.target.value)}
                                maxLength={128}
                                autoComplete="current-password"
                                required
                            />
                            {oldPasswordError && (
                                <div className="password-error" style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px', textAlign: 'left' }}>
                                    {oldPasswordError}
                                </div>
                            )}
                        </div>
                        <div className="form-row">
                            <label htmlFor="new-password">New Password</label>
                            <input
                                id="new-password"
                                name="new-password"
                                type="password"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) => {
                                    const sanitized = sanitizeContent(e.target.value);
                                    setNewPassword(sanitized);
                                    if (passwordError) {
                                        checkPasswordStrength(sanitized);
                                    }
                                }}
                                onBlur={(e) => checkPasswordStrength(e.target.value)}
                                maxLength={128}
                                autoComplete="new-password"
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
                            <button 
                                type="submit" 
                                disabled={isSubmitting || !!passwordError || !!oldPasswordError}
                                style={{ 
                                    opacity: (isSubmitting || !!passwordError || !!oldPasswordError) ? 0.6 : 1,
                                    cursor: (isSubmitting || !!passwordError || !!oldPasswordError) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isSubmitting ? 'Changing Password...' : 'Change Password'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => navigate(-1)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
