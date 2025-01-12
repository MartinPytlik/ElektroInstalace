import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Prosím vyplňte uživatelské jméno i heslo.");
      return;
    }

    if (username === "admin" && password === "1582") {
      setError("");
      localStorage.setItem("isAuthenticated", "true"); // Uloží stav přihlášení
      navigate("/adminPage");
    } else {
      setError("Nesprávné uživatelské jméno nebo heslo.");
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <h2 className="login-title">Přihlášení</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Uživatelské jméno:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Heslo:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Přihlásit se
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
