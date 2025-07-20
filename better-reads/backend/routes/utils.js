import jwt from 'jsonwebtoken';
/**
 * Sign up a new user
 * @param {string} pwd - { password}
 * @returns {boolean}
 */

export function isStrongPassword(pwd) {
    const minLength = 12;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasDigit = /[0-9]/.test(pwd);
    const hasSymbol = /[^A-Za-z0-9]/.test(pwd);
    return pwd.length >= minLength && hasUpper && hasLower && hasDigit && hasSymbol;
}

export function isValidUsername(username) {
  return /^[a-zA-Z0-9_.-]{3,20}$/.test(username);
}

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Missing token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};
