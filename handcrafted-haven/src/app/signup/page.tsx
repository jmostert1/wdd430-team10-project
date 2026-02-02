"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import "../login/login.css";
import { count } from "console";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    bio: "",
    password: "",
    confirmPassword: "",
    seller: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          country: formData.country,
          bio: formData.bio,
          seller: formData.seller,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to login page with success message
      router.push("/login?success=Account created successfully! Please sign in.");
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
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
              <h1 className="login-title">Create Account</h1>
              <p className="login-subtitle">Join Handcrafted Haven today</p>

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
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

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
                  <label htmlFor="country" className="form-label">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    className="form-input"
                    placeholder="United States"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio" className="form-label">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-input"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
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
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={formData.seller}
                    onChange={(e) =>
                      setFormData({ ...formData, seller: e.target.checked })
                    }
                  />
                  <span>I want to sell products (Seller account)</span>
                </label>

                <button
                  type="submit"
                  className="btn btn--primary btn--full"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="login-divider">
                <span>or</span>
              </div>

              <p className="signup-prompt">
                Already have an account?{" "}
                <a href="/login" className="signup-link">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
