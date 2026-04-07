'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError('Wrong password');
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '2rem', width: 360 }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}>D4TW Wiki</h1>
        <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Authorized access only</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: 6, marginBottom: '0.75rem', boxSizing: 'border-box' }}
          autoFocus
        />
        {error && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{error}</p>}
        <button type="submit"
          style={{ width: '100%', padding: '0.6rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
          Enter
        </button>
      </form>
    </div>
  );
}
