import React from 'react';
import { ChatbotWidget } from '../components/ChatbotWidget';

export const ChatbotPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#F47721]">
          Verified Knowledge Assistant
        </span>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#17613A]">
          Ask Our Farmer Assistant
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#303030]/85 max-w-3xl">
          Ask questions about Central and Karnataka government schemes, eligibility rules, required documents, crops, soils, or irrigation technologies. Responses are grounded strictly in the platform&apos;s verified records; if something cannot be verified, the assistant directs you to official government portals.
        </p>
      </div>

      <ChatbotWidget embedded />
    </div>
  );
};
