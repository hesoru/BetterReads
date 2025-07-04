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

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (loading) return; // prevent duplicate calls
		setLoading(true);

		try {

			const result = await dispatch(signupUser({ username, password, favoriteGenres}));

			if (signupUser.fulfilled.match(result)) {
				navigate('/search');
			} else {
				alert(`Signup failed: ${result.payload}`);
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
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						{/* Genre dropdown should update setFavoriteGenres */}
						<div className="genre-dropdown-container">
							<GenreDropDown onSelectGenres={setFavoriteGenres} />
						</div>

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