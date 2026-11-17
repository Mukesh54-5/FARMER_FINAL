import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { registerWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Password and Confirm Password must match.');
      return;
    }
    setSubmitting(true);
    try {
      await registerWithEmail({
        fullName,
        email,
        mobileNumber,
        password,
        confirmPassword,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
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

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-[#E5E7EB] rounded-md p-6 sm:p-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#F47721]">
          Create Farmer Account
        </span>
        <h1 className="mt-1 text-2xl font-extrabold text-[#17613A]">
          Farmer Registration
        </h1>
        <p className="mt-1.5 text-sm text-[#303030]/80">
          Register to save your farm profile, check eligibility, and view tailored government scheme recommendations.
        </p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded p-3">
            {error}
          </div>
        )}

        <button
          type="button"
          disabled={submitting}
          onClick={handleGoogleSignUp}
          className="mt-5 w-full py-2.5 px-4 border border-[#E5E7EB] hover:bg-[#F5F8F5] text-[#303030] text-sm font-semibold rounded flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.6-5.5 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-2H12z"
            />
          </svg>
          <span>Sign Up with Google</span>
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-[#303030]/60">
          <div className="flex-1 h-px bg-[#E5E7EB]" />
          <span>OR REGISTER WITH DETAILS</span>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#17613A] mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g., Ramesh Kumar"
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded focus:outline-none focus:border-[#17613A]"
            />
          </div>

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
            <label className="block text-xs font-semibold text-[#17613A] mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              required
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded focus:outline-none focus:border-[#17613A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17613A] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded focus:outline-none focus:border-[#17613A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17613A] mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded focus:outline-none focus:border-[#17613A]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-[#F47721] hover:bg-[#d96312] disabled:opacity-60 text-white text-sm font-semibold rounded transition-colors"
          >
            {submitting ? 'Creating Account...' : 'Create Farmer Account'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-[#303030]/80">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-[#17613A] hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};
