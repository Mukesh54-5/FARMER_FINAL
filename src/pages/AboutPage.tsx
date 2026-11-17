import React from 'react';
import { CheckCircle2, Users, Target, BookOpen } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const objectives = [
    'Centralize verified Central and Karnataka government agricultural schemes into a single easy-to-navigate portal.',
    'Simplify eligibility assessment so farmers understand preliminary criteria and required documents before visiting offices.',
    'Provide personalized scheme recommendations based on state, farmer category, crop, landholding, and irrigation type.',
    'Deliver agricultural literacy covering crops, soils, livestock, organic farming, balanced fertilizers, and modern irrigation.',
    'Ensure inclusive accessibility across English, Hindi, and Kannada with an interactive AI assistant grounded in verified data.',
  ];

  const teamMembers = [
    {
      role: 'Full-Stack Architecture & Database Design',
      desc: 'PostgreSQL schema modeling, Drizzle ORM integration, and REST API endpoints.',
    },
    {
      role: 'UI/UX Design & Multilingual Frontend',
      desc: 'Responsive layout, agricultural branding, and English/Hindi/Kannada i18next localization.',
    },
    {
      role: 'Scheme Research & Eligibility Engine',
      desc: 'Verification of Central & Karnataka scheme records, document checklists, and rule logic.',
    },
    {
      role: 'AI Chatbot & Knowledge Grounding',
      desc: 'Server-side Gemini API integration grounded strictly in verified agricultural records.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <section className="bg-white border border-[#E5E7EB] rounded-md p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F47721]">
          <BookOpen className="w-4 h-4" />
          <span>College Mini Project</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#17613A]">
          About the Farmer Scheme Assistance &amp; Information Platform
        </h1>
        <p className="mt-4 text-base text-[#303030] leading-relaxed">
          Farmers often struggle to discover relevant government welfare schemes because guidelines, document lists, and application portals are scattered across multiple websites and technical PDFs. This independent student informational platform bridges that gap by presenting verified scheme overviews, direct official portal links, preliminary eligibility tools, and practical farming guides in one accessible interface.
        </p>
        <p className="mt-3 text-sm text-[#303030]/80">
          Note: This is an independent educational project, not an official government portal. Every scheme links directly to its authoritative government portal for final verification and submission.
        </p>
      </section>

      <section id="objectives" className="bg-white border border-[#E5E7EB] rounded-md p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-[#17613A]" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#17613A]">
            Project Objectives
          </h2>
        </div>
        <ul className="space-y-3">
          {objectives.map((obj) => (
            <li key={obj} className="flex items-start gap-2.5 text-sm sm:text-base text-[#303030]">
              <CheckCircle2 className="w-5 h-5 text-[#207747] shrink-0 mt-0.5" />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="team" className="bg-white border border-[#E5E7EB] rounded-md p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-[#17613A]" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#17613A]">
            Project Modules &amp; Team Contributions
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map((m) => (
            <div
              key={m.role}
              className="border border-[#E5E7EB] rounded p-4 bg-[#F5F8F5]"
            >
              <h3 className="text-base font-bold text-[#17613A]">{m.role}</h3>
              <p className="mt-1.5 text-sm text-[#303030]/90">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
