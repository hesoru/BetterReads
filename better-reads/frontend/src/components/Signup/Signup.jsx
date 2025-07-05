import React from "react";
import "../../styles/signup.css";
import GenreDropDown from "./GenreDropDown";
import { useNavigate, Link } from "react-router-dom";
import { useState } from 'react';
import {useDispatch} from "react-redux";
import { signupUser} from "../../redux/UserThunks";

//TODO: ORE WAS HERE:
const Signup = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [favoriteGenres, setFavoriteGenres] = useState([]);
	const [loading, setLoading] = useState(false);
	// Add this state for password validation
	const [passwordError, setPasswordError] = useState('');
	// Add state for signup error
	const [signupError, setSignupError] = useState('');

	// Add this function to check password strength
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

		if (loading) return; // prevent duplicate calls

		// Clear previous errors
		setSignupError('');

		// Validate password first
		if (!checkPasswordStrength(password)) {
			return; // Stop submission if password is invalid
		}

		// Ensure favoriteGenres is not empty
		const genresToSubmit = favoriteGenres.length > 0 ? favoriteGenres : ['Fiction']; // Default to Fiction if no genres selected

		setLoading(true);

		try {

			const result = await dispatch(signupUser({ username, password, favoriteGenres: genresToSubmit}));

			if (signupUser.fulfilled.match(result)) {
				navigate('/search');
			} else {
				setSignupError(result.payload);
			}
		} catch (err) {
			alert('Unexpected signup error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="signup-page">
			<div className="signup-container">
				<div className="signup-information">
					<h2>Join us to get ...</h2>
					<h1><span className="better">Better</span><span className="reads">Reads</span></h1>
					<h2 className="tagline">Let's get you sign up</h2>

					<form className="signup-form" onSubmit={handleSubmit}>
						<div className="form-row">
							<label className="username">Username</label>
							<input
								id="username"
								name="username"
								type="text"
								placeholder="Enter your username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>
						<div className="form-row">
							<label className="password">Password</label>
							<input
								id="password"
								name="password"
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => {
								  setPassword(e.target.value);
								  checkPasswordStrength(e.target.value);
								}}
								required
							/>
						</div>
						
						{/* Genre dropdown should update setFavoriteGenres */}
						<div className="genre-dropdown-container">
							<GenreDropDown onSelectGenres={setFavoriteGenres} />
						</div>

						{passwordError && (
							<div className="password-error" style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px', textAlign: 'center' }}>
							  {passwordError}
							</div>
						)}
						<div className="password-requirements" style={{ fontSize: '0.8rem', marginTop: '5px', textAlign: 'center' }}>
							Password must be at least 12 characters and include uppercase, lowercase, number, and symbol.
						</div>
						
						{signupError && (
							<div className="signup-error" style={{ color: 'red', fontSize: '0.8rem', marginTop: '10px', textAlign: 'center', padding: '5px', backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: '4px' }}>
								Error: {signupError}
							</div>
						)}

						<div className="button-row">
							<button type="submit" className="register-button">Register</button>
						</div>
					</form>

					<p className="form-footer">
						Already have an account? <Link to="/">Login</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

// const Signup = () => {
// 	const navigate = useNavigate();
// 	return (
// 		<div className="signup-page">
// 			<div className="signup-container">
// 			<div className="signup-information">
// 				<h2>
// 					Join us to get ...
// 				</h2>
// 				<h1>
// 					<span className="better">Better</span>
// 					<span className="reads">Reads</span>
// 				</h1>
// 				<h2 className="tagline">
// 					Let's get you sign up
// 				</h2>
//
// 				<form className="signup-form">
// 					<div className="form-row">
// 						<label className="usernname">Username</label>
// 						<input
// 							id="username"
// 							name="username"
// 							type="text"
// 							placeholder="Enter your username"
// 							// value={username}
// 							required
// 						/>
// 					</div>
// 					<div className="form-row">
// 						<label className="password">Password</label>
// 						<input
// 							id="password"
// 							name="password"
// 							type="password"
// 							placeholder="Enter your password"
// 							// value={password}
// 							required
// 						/>
// 					</div>
// 				</form>
//
// 				<GenreDropDown/>
//
// 				<div className="button-row">
// 					<button className="register-button" onClick={() => {navigate("/search")}}>Register</button>
// 				</div>
// 				<p className="form-footer">
// 					Already have a account? <Link to="/">Login</Link>
// 				</p>
// 			</div>
// 			</div>
// 		</div>
// 	);
// };

export default Signup;