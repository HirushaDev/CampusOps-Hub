// Auth.js
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FiArrowLeft, FiHome, FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import assets from "./assets/assets";
import { useNavigate } from "react-router-dom";
import API, { loginUser, registerUser } from "../api";
import toast from "react-hot-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const isSubmitDisabled = () => {
    if (!form.email.trim() || !form.password.trim()) return true;
    if (!isLogin) {
      if (!form.name.trim()) return true;
      if (form.password !== form.confirmPassword) return true;
      if (form.password.length < 6) return true;
    }
    return false;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const getErrorMessage = (err, fallback) => {
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.response?.data?.error) return err.response.data.error;
    if (typeof err?.response?.data === "string") return err.response.data;
    if (err?.message) return err.message;
    return fallback;
  };

  const resolveEmailVerified = (data) => {
    const value = data?.emailVerified ?? data?.isEmailVerified ?? data?.verified ?? 
                  data?.isVerified ?? data?.isAccountVerified ?? data?.accountVerified;
    return value === true || value === "true";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        // Login flow
        const { data } = await loginUser({
          email: form.email.trim(),
          password: form.password,
        });

        let isEmailVerified = resolveEmailVerified(data);

        const loggedInUser = {
          id: data?.id,
          email: data?.email || form.email.trim(),
          token: data?.token,
          name: data?.name || data?.firstName,
          role: data?.role || "USER",
          provider: data?.provider || "LOCAL",
          emailVerified: isEmailVerified,
        };

        localStorage.setItem("user", JSON.stringify(loggedInUser));
        
        // Set authorization header for subsequent requests
        API.defaults.headers.common['Authorization'] = `Bearer ${data?.token}`;

        // Try to get fresh profile data
        try {
          const profileRes = await API.get("/api/users/profile");
          const isVerified = resolveEmailVerified(profileRes.data);
          const syncedUser = { ...loggedInUser, ...profileRes.data, emailVerified: isVerified };
          localStorage.setItem("user", JSON.stringify(syncedUser));
          isEmailVerified = isVerified;
        } catch (profileError) {
          console.warn("Profile sync failed:", profileError);
        }

        if (!isEmailVerified) {
          toast.success("Please verify your email using the OTP sent to your inbox.");
          navigate("/verify-email", { replace: true });
          return;
        }

        toast.success(`Welcome back, ${loggedInUser.name || 'User'}!`);
        
        // Redirect based on role
        if (loggedInUser.role === "ADMIN") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
        return;
      }

      // Registration flow
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }

      if (form.password.length < 6) {
        setError("Password must be at least 6 characters");
        toast.error("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      const successMessage = "Registration successful! Please check your email to verify your account.";
      setSuccess(successMessage);
      toast.success(successMessage);
      
      // Reset form and switch to login
      setIsLogin(true);
      setForm({ name: "", email: form.email, password: "", confirmPassword: "" });
    } catch (err) {
      const errorMessage = getErrorMessage(
        err,
        isLogin ? "Login failed. Please try again." : "Registration failed. Please try again."
      );
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/reset-password");
  };

  const handleGoogleLogin = () => {
    const googleLoginUrl = `${API.defaults.baseURL}/oauth2/authorization/google`;
    window.location.href = googleLoginUrl;
  };

  const handleGithubLogin = () => {
    const githubLoginUrl = `${API.defaults.baseURL}/oauth2/authorization/github`;
    window.location.href = githubLoginUrl;
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
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60"></div>

      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:scale-105 sm:left-8 sm:top-8"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      {/* Form Container */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 animate-fade-in-up">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <img src={assets.logo} alt="Logo" className="h-10 w-auto brightness-0 invert" />
          </div>
        </div>

        {/* Badge */}
        <div className="mb-4 inline-flex w-full items-center justify-center gap-2">
          <div className="rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-semibold text-cyan-700 flex items-center gap-1">
            <FiHome className="h-3.5 w-3.5" />
            Secure Access Portal
          </div>
        </div>

        {/* Form Title */}
        <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="mb-6 text-center text-sm text-slate-500">
          {isLogin
            ? "Sign in to access your dashboard"
            : "Fill in your details to get started"}
        </p>

        {/* Form */}
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-sm font-medium text-emerald-700">{success}</p>
            </div>
          )}

          {!isLogin && (
            <div className="relative">
              <FiUser className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
              required
            />
          </div>
          
          <div className="relative">
            <FiLock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>

          {!isLogin && (
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                minLength={6}
                required={!isLogin}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
          )}

          {/* Forgot Password Link */}
          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-cyan-700 hover:text-cyan-800 hover:underline transition-all"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitDisabled() || loading}
            className={`mt-2 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-300 transform ${
              isSubmitDisabled() || loading
                ? "cursor-not-allowed bg-slate-300"
                : isLogin
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 hover:scale-105 hover:shadow-lg"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:scale-105 hover:shadow-lg"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{isLogin ? "Signing In..." : "Creating Account..."}</span>
              </div>
            ) : (
              <span>{isLogin ? "Sign In" : "Create Account"}</span>
            )}
          </button>
        </form>

        {/* Toggle between Login/Signup */}
        <p className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
              setForm({ name: "", email: "", password: "", confirmPassword: "" });
            }}
            className="font-semibold text-cyan-700 hover:text-cyan-800 hover:underline transition-all"
          >
            {isLogin ? "Create Account" : "Sign In"}
          </button>
        </p>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-400">Or continue with</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="inline-flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-slate-50"
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleGithubLogin}
            className="inline-flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-slate-50"
          >
            <FaGithub className="h-5 w-5" />
            Continue with GitHub
          </button>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Auth;