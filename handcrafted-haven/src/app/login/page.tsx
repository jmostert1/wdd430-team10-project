"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import "./login.css";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const successMessage = searchParams.get("success");
    if (successMessage) {
      setSuccess(successMessage);
      // Clear the success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to home page with welcome message
      router.push("/?success=Welcome back, " + data.user.name + "!");
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <Header />

      <section className="login-section">
        <div className="container">
          <div className="login-wrapper">
            <div className="login-card">
              <h1 className="login-title">Welcome Back</h1>
              <p className="login-subtitle">Sign in to your account</p>

              {success && (
                <div style={{
                  background: "#d4edda",
                  color: "#155724",
                  padding: "12px",
                  borderRadius: "6px",
                  marginBottom: "20px",
                  fontSize: "14px",
                  border: "1px solid #c3e6cb"
                }}>
                  {success}
                </div>
              )}

              {error && (
                <div style={{
                  background: "#fee",
                  color: "#c33",
                  padding: "12px",
                  borderRadius: "6px",
                  marginBottom: "20px",
                  fontSize: "14px"
                }}>
                  {error}
                </div>
              )}

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn--primary btn--full"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <div className="login-divider">
                <span>or</span>
              </div>

              <p className="signup-prompt">
                Don't have an account?{" "}
                <Link href="/signup" className="signup-link">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
