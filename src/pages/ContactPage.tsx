import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { sendContactMessage } from '../services/api';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const res = await sendContactMessage({ name, email, phone, subject, message });
      setSuccessMsg(res.message);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#F47721]">
          Support &amp; Feedback
        </span>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#17613A]">
          Contact Us
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#303030]/85 max-w-2xl">
          Have a suggestion to improve scheme listings or agriculture guides? Send us a message using the form below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#17613A]">
              Project Contact Details (Placeholder)
            </h2>
            <div className="flex items-start gap-3 text-sm text-[#303030]">
              <Phone className="w-4 h-4 text-[#17613A] shrink-0 mt-1" />
              <div>
                <div className="font-semibold">Helpline (Sample)</div>
                <div className="tabular-nums text-[#303030]/80">+91 80000 00000</div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm text-[#303030]">
              <Mail className="w-4 h-4 text-[#17613A] shrink-0 mt-1" />
              <div>
                <div className="font-semibold">Email (Placeholder)</div>
                <div className="text-[#303030]/80">support@farmerschemeportal.edu.in</div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm text-[#303030]">
              <MapPin className="w-4 h-4 text-[#17613A] shrink-0 mt-1" />
              <div>
                <div className="font-semibold">Academic Campus</div>
                <div className="text-[#303030]/80">
                  Department of Computer Science &amp; Engineering, Karnataka, India (Placeholder)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#E5E7EB] rounded-md p-6 space-y-4"
          >
            <h2 className="text-lg font-bold text-[#17613A]">Send a Message</h2>

            {successMsg && (
              <div className="bg-[#F5F8F5] border border-[#207747]/40 text-[#17613A] text-sm rounded p-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#17613A] mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17613A] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#17613A] mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17613A] mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Question about PM-KISAN"
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17613A] mb-1">
                Message *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your question or feedback..."
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#F47721] hover:bg-[#d96312] disabled:opacity-60 text-white text-sm font-semibold rounded transition-colors"
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
