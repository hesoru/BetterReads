import React from "react";
import "../../styles/signup.css";
import GenreDropDown from "./GenreDropDown";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
	const navigate = useNavigate();
	return (
		<div className="signup-container">
			<div className="signup-information">
				<h2>
					Join us to get ...
				</h2>
				<h1>
					<span className="better">Better</span>
					<span className="reads">Reads</span>
				</h1>
				<h2 className="tagline">
					Let's get you sign up
				</h2>

				<form className="signup-form">
					<div className="form-row">
						<label className="usernname">Username</label>
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
			
				<GenreDropDown/>
				
				<div className="button-row">
					<button className="register-button" onClick={() => {navigate("/search")}}>Register</button>
				</div>
				<p className="form-footer">
					Already have a account? <Link to="/">Login</Link>
				</p>
			</div>
		</div>
	);
};

export default Signup;
