import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      navigate("/feed");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1 className="logo">Mock LinkedIn</h1>
        <p className="login-sub">Sign in to see recruiter posts</p>
        <form onSubmit={handleLogin}>
          <input id="email" name="email" type="email" placeholder="Email"
            className="input" value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <input id="password" name="password" type="password" placeholder="Password"
            className="input" value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <button id="login-btn" type="submit" className="btn">Sign in</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="hint">Demo platform with dummy data</p>
      </div>
    </div>
  );
}