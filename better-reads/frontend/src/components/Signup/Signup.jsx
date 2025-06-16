import React from "react";
import "../../styles/signup.css";
import GenreDropDown from "./GenreDropDown";
import { useNavigate, Link } from "react-router-dom";
import { useState } from 'react';

//TODO: ORE WAS HERE:
const Signup = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [favoriteGenres, setFavoriteGenres] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/signup`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username,
					password,
					favoriteGenres,
				})
			});

			if (!res.ok) {
				const error = await res.json();
				alert(`Signup failed: ${error.message || error.error}`);
				return;
			}

			const data = await res.json();
			console.log('User created:', data);
			//TODO: update redux state so that user is no longer guest
			navigate('/search');
		} catch (err) {
			console.error('Signup error:', err);
			alert('Something went wrong. Please try again.');
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
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						{/* Genre dropdown should update setFavoriteGenres */}
						<GenreDropDown onSelectGenres={setFavoriteGenres} />

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
