
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