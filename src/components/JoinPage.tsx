"use client";
import React, { useState } from 'react';
import Layout from './Layout';

interface FormData {
  name: string;
  email: string;
  phone: string;
  university: string;
  studyProgram: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

function TeamApplicationModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    university: '',
    studyProgram: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'TEAM' }),
      });

      const result = await response.json();

      if (result.ok) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Join the Team</h2>
            <p className="text-sm text-gray-500">Apply to help organize TSA TWENTE</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {submitStatus === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Application Submitted!</h3>
              <p className="text-green-700 mb-6">
                Thank you for your interest in joining our team. We&apos;ll review your application and get back to you soon!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-turkish-red text-white rounded-lg hover:bg-turkish-red-dark transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name <span className="text-turkish-red">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg transition-colors ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-neutral-300'
                  }`}
                  placeholder="Your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address <span className="text-turkish-red">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg transition-colors ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-neutral-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg"
                  placeholder="+31 6 12345678"
                />
              </div>

              {/* Study Program */}
              <div>
                <label htmlFor="studyProgram" className="block text-sm font-medium text-neutral-700 mb-1">
                  Study Program
                </label>
                <input
                  type="text"
                  id="studyProgram"
                  name="studyProgram"
                  value={formData.studyProgram}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg"
                  placeholder="e.g., Computer Science"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                  Why do you want to join the team?
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg resize-none"
                  placeholder="Tell us about yourself and what you'd like to contribute..."
                />
              </div>

              {/* Error */}
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-turkish-red text-white font-semibold rounded-lg hover:bg-turkish-red-dark transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  const [showTeamModal, setShowTeamModal] = useState(false);

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 px-4 bg-turkish-red text-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Join TSA TWENTE
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Be part of our vibrant Turkish student community in Twente
            </p>
          </div>
        </section>

        {/* Two Options Section */}
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
                Choose How to Join
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Whether you want to actively contribute or enjoy member benefits, there&apos;s a place for you
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Join the Team Card */}
              <div 
                onClick={() => setShowTeamModal(true)}
                className="group cursor-pointer bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:border-turkish-red hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-turkish-red/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-8 h-8 text-turkish-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">Join the Team</h3>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  Become an active part of TSA TWENTE! Help organize events, manage communications, 
                  and shape the future of our community. Great for building leadership skills and 
                  making a real impact.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-neutral-600">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-turkish-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Organize events and activities
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-turkish-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Build leadership experience
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-turkish-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Path to future board positions
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-turkish-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Networking with like-minded students
                  </li>
                </ul>
                <div className="flex items-center text-turkish-red font-semibold group-hover:gap-2 transition-all">
                  Apply Now
                  <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Become a Member Card - Coming Soon */}
              <div className="relative bg-neutral-50 border-2 border-neutral-200 rounded-2xl p-8 opacity-75">
                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-neutral-200 text-neutral-600 text-xs font-semibold rounded-full uppercase tracking-wider">
                  Coming Soon
                </div>
                
                <div className="w-16 h-16 bg-neutral-200 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-500 mb-3">Become a Member</h3>
                <p className="text-neutral-500 mb-6 leading-relaxed">
                  Get exclusive access to member-only benefits! Enjoy discounts at partner businesses, 
                  early access to event tickets, and special member-only events throughout the year.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-neutral-500">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Exclusive member discounts
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Early access to events
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Member-only events
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Support TSA TWENTE&apos;s mission
                  </li>
                </ul>
                <div className="flex items-center text-neutral-400 font-semibold">
                  Available Soon
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-16 px-4 bg-section-alt">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
                Why Join TSA TWENTE?
              </h2>
              <p className="text-neutral-600">
                Be part of a community that celebrates Turkish culture
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-turkish-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎉</span>
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">Events & Activities</h3>
                <p className="text-neutral-600 text-sm">
                  Cultural celebrations, social gatherings, and fun activities throughout the year
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-turkish-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">Community</h3>
                <p className="text-neutral-600 text-sm">
                  Connect with fellow Turkish students and culture enthusiasts in Twente
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-turkish-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💫</span>
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">Growth</h3>
                <p className="text-neutral-600 text-sm">
                  Networking opportunities, leadership development, and personal growth
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Team Application Modal */}
      {showTeamModal && <TeamApplicationModal onClose={() => setShowTeamModal(false)} />}
    </Layout>
  );
}
