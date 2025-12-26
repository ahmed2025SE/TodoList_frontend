import { useState } from "react";
import { login } from "../api/auth";
import { Link } from "react-router-dom";    
import type { LoginRequest } from "../types/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const res = await login(form);
  
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    console.log("Login success");
    navigate("/home"); 

  } catch (err: any) {
    setError(err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <button disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    
      <p style={{ marginTop: "10px" }}>
        Don't have an account?{" "}
        <Link to="/signup">Sign up</Link>
      </p>
    </form>
  );
}