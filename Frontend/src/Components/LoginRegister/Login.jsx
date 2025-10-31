import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Login failed");
      }

      localStorage.setItem("user", JSON.stringify(payload));
      navigate("/home", { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Unexpected error, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full bg-black text-white flex flex-col justify-center items-center px-6">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/name_img.png"
          alt="coffee background"
          className="h-full w-full object-cover opacity-80"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="bg-black/60 border border-gray-600 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#b87346]"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="bg-black/60 border border-gray-600 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#b87346]"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#b87346] hover:bg-[#a1623f] disabled:bg-[#b87346]/60 text-white py-3 rounded-xl font-semibold transition mt-2"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        {errorMessage && (
          <p className="mt-4 text-center text-sm text-red-400">{errorMessage}</p>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-[#b87346] font-semibold">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
