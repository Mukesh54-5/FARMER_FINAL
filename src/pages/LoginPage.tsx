import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google Sign-In failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setForgotMsg(null);
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setForgotMsg(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send recovery request.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-[#E5E7EB] rounded-md p-6 sm:p-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#F47721]">
          Farmer Portal Access
        </span>
        <h1 className="mt-1 text-2xl font-extrabold text-[#17613A]">
          {forgotMode ? 'Forgot Password' : 'Login to Your Account'}
        </h1>
        <p className="mt-1.5 text-sm text-[#303030]/80">
          {forgotMode
            ? 'Enter your registered email to request recovery guidance.'
            : 'Access your farmer profile, personalized scheme recommendations, and saved history.'}
        </p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded p-3">
            {error}
          </div>
        )}

        {forgotMsg && (
          <div className="mt-4 bg-[#F5F8F5] border border-[#207747]/40 text-[#17613A] text-xs rounded p-3">
            {forgotMsg}
          </div>
        )}

        {forgotMode ? (
          <form onSubmit={handleForgotSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#17613A] mb-1">
                Registered Email Address
              </label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="farmer@example.com"
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#17613A] hover:bg-[#207747] text-white text-sm font-semibold rounded"
            >
              Send Recovery Request
            </button>
            <button
              type="button"
              onClick={() => setForgotMode(false)}
              className="w-full text-center text-xs font-semibold text-[#F47721] hover:underline"
            >
              Back to Login
            </button>
          </form>
        ) : (
          <>
            <button
              type="button"
              disabled={submitting}
              onClick={handleGoogleSignIn}
              className="mt-5 w-full py-2.5 px-4 border border-[#E5E7EB] hover:bg-[#F5F8F5] text-[#303030] text-sm font-semibold rounded flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.6-5.5 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-2H12z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="my-5 flex items-center gap-3 text-xs text-[#303030]/60">
              <div className="flex-1 h-px bg-[#E5E7EB]" />
              <span>OR LOGIN WITH EMAIL</span>
              <div className="flex-1 h-px bg-[#E5E7EB]" />
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#17613A] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded focus:outline-none focus:border-[#17613A]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#17613A]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotMode(true)}
                    className="text-xs font-medium text-[#F47721] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded focus:outline-none focus:border-[#17613A]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-[#17613A] hover:bg-[#207747] disabled:opacity-60 text-white text-sm font-semibold rounded transition-colors"
              >
                {submitting ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-[#303030]/80">
              New farmer?{' '}
              <Link to="/register" className="font-bold text-[#F47721] hover:underline">
                Register here
              </Link>
            </p>

            <div className="mt-5 pt-4 border-t border-[#E5E7EB] text-[11px] text-[#303030]/75">
              <span className="font-semibold text-[#17613A]">Project Demo Admin:</span>{' '}
              <code>admin@farmerportal.edu</code> / <code>Admin@2026</code>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
