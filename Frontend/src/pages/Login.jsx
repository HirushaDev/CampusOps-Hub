import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FiArrowLeft, FiHome, FiMail, FiLock, FiUser } from "react-icons/fi";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const isSubmitDisabled =
    !form.email.trim() ||
    !form.password.trim() ||
    (!isLogin && !form.name.trim());

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isLogin ? "Login clicked" : "Register clicked");
  };

  const handleForgotPassword = () => {
    alert("Redirect to Forgot Password page");
    // Example: navigate("/forgot-password");
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-6"
      style={{
        backgroundImage: `url(${assets.logo_back})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/25 sm:left-8 sm:top-8"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      {/* Form Container */}
      <div className="relative w-full max-w-sm rounded-3xl border border-white/70 bg-white/95 p-6 sm:p-7 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-md flex flex-col items-center">
        {/* Logo on top */}
        <img src={assets.logo} alt="Logo" className="mb-4 h-14 w-auto" />

        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-semibold text-cyan-700">
          <FiHome className="h-3.5 w-3.5" />
          Secure Access Portal
        </div>

        {/* Form Title */}
        <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-1.5">
          {isLogin ? "Sign In" : "Sign Up"}
        </h2>
        <p className="mb-5 text-center text-xs text-slate-500">
          {isLogin
            ? "Welcome back. Enter your details to continue."
            : "Create your account to access the dashboard."}
        </p>

        {/* Form */}
        <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="relative">
              <FiUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200"
                required={!isLogin}
              />
            </div>
          )}
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200"
              required
            />
          </div>
          <div className="relative">
            <FiLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200"
              minLength={6}
              required
            />
          </div>

          {/* Forgot Password (Login only) */}
          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-medium text-cyan-700 hover:text-cyan-800 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`mt-1 rounded-lg p-2.5 text-sm text-white font-semibold transition ${
              isSubmitDisabled
                ? "cursor-not-allowed bg-slate-300"
                : isLogin
                ? "bg-cyan-700 hover:bg-cyan-600"
                : "bg-green-600 hover:bg-green-500"
            }`}
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {/* Toggle */}
        <p className="mt-4 text-center text-xs text-gray-500">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-cyan-700 font-semibold hover:underline"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>

       {/* Social Buttons */}
<div className="mt-5 flex w-full flex-col gap-2.5">
  <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:-translate-y-0.5 hover:bg-gray-100 shadow-sm hover:shadow-md duration-300">
    <FcGoogle className="h-4.5 w-4.5 text-red-500" />
    Continue with Google
  </button>

  <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:-translate-y-0.5 hover:bg-gray-200 shadow-sm hover:shadow-md duration-300">
    <FaGithub className="h-4.5 w-4.5" />
    Continue with GitHub
  </button>
</div>

      </div>
    </div>
  );
};

export default Auth;
