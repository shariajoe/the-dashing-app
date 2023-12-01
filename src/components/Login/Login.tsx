import React, { useState } from 'react';
import './Login.scss';
import { UserRole } from '../../enums/UserRole';
import config from '../../config/config';

interface LoginState {
    email: string;
    password: string;
    passwordValid: boolean;
    loginError: boolean;
}

const Login: React.FC<{ onLoginSuccess: (role: UserRole) => void }> = ({ onLoginSuccess }) => {
    const [state, setState] = useState<LoginState>({
        email: '',
        password: '',
        passwordValid: true,
        loginError: false,
    });

    const simulateLogin = (email: string) => {
        // Simulate a login process
        // Determine the user's role based on the email
        const role = email !== config.testCredentials.email ? UserRole.Editor : UserRole.Viewer;
        onLoginSuccess(role);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setState(prevState => ({ ...prevState, [name]: value }));
    };

    const validatePassword = (password: string): boolean => {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
        return regex.test(password);
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            const response = await fetch(`${config.reqres.baseUrl}${config.reqres.endpoints.login}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                setState(prevState => ({ ...prevState, loginError: false }));
                // Proceed with further actions after successful login
                simulateLogin(email);
            } else {
                setState(prevState => ({ ...prevState, loginError: true }));
            }
        } catch (error) {
            setState(prevState => ({ ...prevState, loginError: true }));
        }
    };


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const isValid = validatePassword(state.password);
        setState(prevState => ({ ...prevState, passwordValid: isValid }));

        if (isValid) {
            // Proceed with login
            handleLogin(state.email, state.password);
        } else {
            console.log('Password does not meet requirements');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email ID"
                            value={state.email}
                            onChange={handleChange}
                            required
                        />
                        <span className="input-icon">@</span>
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={state.password}
                            onChange={handleChange}
                            required
                        />
                        <span className="input-icon">&#128274;</span>
                    </div>
                    {!state.passwordValid && (
                        <div className="error-message">
                            Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
                        </div>
                    )}
                    {state.loginError && (
                        <div className="error-message">
                            Invalid username or password.
                        </div>
                    )}
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;