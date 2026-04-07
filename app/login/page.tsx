"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const data = await res.json();
    if (res.ok) { router.push("/"); router.refresh(); }
    else setError(data.error || "Authentication failed");
    setLoading(false);
  }

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <h1>D4TW Wiki</h1>
        <p className="sub">Brand intelligence base — authorized access only</p>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
        <button type="submit" disabled={loading}>{loading ? "Checking..." : "Enter"}</button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
}
