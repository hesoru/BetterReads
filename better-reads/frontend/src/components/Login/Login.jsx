import React from "react";
import "../../styles/login.css";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
	const navigate = useNavigate();
	return (
		<div className="login-container">
			<div className="login-information">
				<h1>
					<span className="better">Better</span>
					<span className="reads">Reads</span>
				</h1>
				<h2 className="tagline">
					Reading is good for you. But we can make it better
				</h2>

				<form className="login-form">
					<div className="form-row">
						<label className="username">Username</label>
						<input
							id="username"
							name="username"
							type="text"
							placeholder="Enter your username"
							// value={username}
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
							// value={password}
							required
						/>
					</div>
				</form>
				<div className="button-row">
					<button className="login-button" onClick={() => {navigate("/search")}}>Log in</button>
					<button className="guest-button" onClick={() => {navigate("/search")}}>Enter as a Guest</button>
				</div>
				<p className="form-footer">
					Don't have an account? <Link to="/signup">Signup</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
