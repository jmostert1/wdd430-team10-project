"use client";

import { useState } from "react";

export default function ImportUsersPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/import-users", {
        method: "POST",
      });
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Import Users to MongoDB</h1>
      <p>Click the button below to import users with hashed passwords into your MongoDB database.</p>
      
      <button
        onClick={handleImport}
        disabled={loading}
        style={{
          padding: "12px 24px",
          background: "#E27130",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "16px",
          fontWeight: "600"
        }}
      >
        {loading ? "Importing..." : "Import Users"}
      </button>

      {result && (
        <div style={{
          marginTop: "20px",
          padding: "20px",
          background: result.error ? "#fee" : "#efe",
          borderRadius: "8px"
        }}>
          <h3>{result.error ? "Error" : "Success"}</h3>
          <pre style={{ fontSize: "14px" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {result && result.success && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>You can now log in with these credentials:</strong></p>
          <ul>
            <li>Email: mira.halden@email.com / Password: SecurePass123!</li>
            <li>Email: elias.renford@email.com / Password: MyPassword456#</li>
            <li>Email: hana.lior@email.com / Password: StrongPass789$</li>
          </ul>
          <a href="/login" style={{ color: "#E27130", fontWeight: "600" }}>Go to Login Page</a>
        </div>
      )}
    </div>
  );
}
