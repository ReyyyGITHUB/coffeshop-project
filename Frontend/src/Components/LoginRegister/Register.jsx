import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password does not match confirmation.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Registration failed");
      }

      setSuccessMessage("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
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
        <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="bg-black/60 border border-gray-600 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#b87346]"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="bg-black/60 border border-gray-600 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#b87346]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="bg-black/60 border border-gray-600 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#b87346]"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="bg-black/60 border border-gray-600 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#b87346]"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#b87346] hover:bg-[#a1623f] disabled:bg-[#b87346]/60 text-white py-3 rounded-xl font-semibold transition mt-2"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        {errorMessage && (
          <p className="mt-4 text-center text-sm text-red-400">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="mt-4 text-center text-sm text-green-400">
            {successMessage}
          </p>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-[#b87346] font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
