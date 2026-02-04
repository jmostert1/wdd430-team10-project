"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import "../profile.css";

interface Profile {
  _id: string;
  userId: string;
  name: string;
  email: string;
  location: string;
  bio: string;
  createdAt: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    location: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token) {
          router.push("/login");
          return;
        }

        if (userData) {
          const user = JSON.parse(userData);
          if (!user.seller) {
            router.push("/");
            return;
          }
        }

        const response = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch profile");
        }

        setProfile(data.profile);
        setFormData({
          location: data.profile.location || "",
          bio: data.profile.bio || "",
        });
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="page">
        <Header />
        <section className="profile">
          <div className="container">
            <div className="profile__panel">
              <p>Loading profile...</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="page">
        <Header />
        <section className="profile">
          <div className="container">
            <div className="profile__panel">
              <p style={{ color: "#c33" }}>Profile not found</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <Header />
      <section className="profile">
        <div className="container">
          <div className="profile__panel">
            <h1 style={{ marginBottom: "20px", fontSize: "32px" }}>Edit Profile</h1>

            {error && (
              <div
                style={{
                  background: "#fee",
                  color: "#c33",
                  padding: "12px",
                  borderRadius: "6px",
                  marginBottom: "20px",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                style={{
                  background: "#efe",
                  color: "#3c3",
                  padding: "12px",
                  borderRadius: "6px",
                  marginBottom: "20px",
                  fontSize: "14px",
                }}
              >
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="name"
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={profile.name}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "#f5f5f5",
                    cursor: "not-allowed",
                  }}
                />
                <small style={{ color: "#666", fontSize: "12px" }}>
                  Name cannot be changed
                </small>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile.email}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "#f5f5f5",
                    cursor: "not-allowed",
                  }}
                />
                <small style={{ color: "#666", fontSize: "12px" }}>
                  Email cannot be changed
                </small>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="location"
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="City, Country"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="bio"
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself and your work..."
                  rows={6}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={saving}
                  style={{ flex: 1 }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => router.push("/profile")}
                  disabled={saving}
                  style={{
                    flex: 1,
                    background: "#fff",
                    color: "#333",
                    border: "1px solid #ddd",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
