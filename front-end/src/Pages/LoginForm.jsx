import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NATURE from "../assets/nature1.jpg"; // Make sure this image exists

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login success:", data);
      navigate("/dashboard"); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-screen">
      <div className="left-panel">
        <div className="illustration">
          <h2>Welcome Back!</h2>
          <p>Please log in to access your dashboard.</p>
        </div>
      </div>

      <div className="right-panel">
        <div className="login-container">
          <h2>Login</h2>

          <img
            src={NATURE}
            alt="nature"
            style={{
              width: '70%',
              height: '150px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '15px'
            }}
          />

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

          <button onClick={() => navigate('/register')} className="btn-registration">
            New user? Register
          </button>
        </div>
      </div>
    </div>
  );
}
