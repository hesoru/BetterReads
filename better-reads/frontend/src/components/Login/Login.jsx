import React, {useState} from "react";
import "../../styles/login.css";
import { useNavigate, Link } from "react-router-dom";
import {useDispatch} from "react-redux";
import { loginUser } from "../../redux/UserThunks";
import {clearUser} from "../../redux/UserSlice.js";
import {clearBooklist} from "../../redux/Booklist.js";

const Login = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			dispatch(loginUser({username, password}));

			navigate('/search');
		} catch (err) {
			console.error('Login error:', err);
			alert('Something went wrong. Please try again.');
		}
	};
	return (
		<div className="login-page">
			<div className="login-container">
			<div className="login-information">
				<h1>
					<span className="better">Better</span>
					<span className="reads">Reads</span>
				</h1>
				<h2 className="tagline">
					Reading is good for you. But we can make it better
				</h2>

				<form className="login-form" onSubmit={handleSubmit}>
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

					{/* Move this inside the form */}
					<div className="button-row">
						<button className="login-button" type="submit">Log in</button>
						<button
							className="guest-button"
							type="button"
							onClick={() => {
								dispatch(clearUser());
								dispatch(clearBooklist());
								navigate('/search');
								localStorage.removeItem('appState');

								navigate("/search"); }}
						>
							Enter as a Guest
						</button>
					</div>
				</form>
				<p className="form-footer">
					Don't have an account? <Link to="/signup">Signup</Link>
				</p>
			</div>
			</div>
		</div>
	);
};

export default Login;