"use client";
import React, { useState } from 'react';
import Layout from './Layout';

interface FormData {
  name: string;
  email: string;
  phone: string;
  university: string;
  studyProgram: string;
  interests: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

export default function JoinPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    university: '',
    studyProgram: '',
    interests: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          university: '',
          studyProgram: '',
          interests: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-4 bg-turkish-red text-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
              🇹🇷 Join Our Community
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Become a Member
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Join TSA TWENTE and be part of our vibrant Turkish community at the University of Twente
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 px-4 bg-section-alt">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-turkish-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎉</span>
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">Exclusive Events</h3>
                <p className="text-neutral-600 text-sm">
                  Access to member-only events and early registration for all activities
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-turkish-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">Community</h3>
                <p className="text-neutral-600 text-sm">
                  Connect with fellow Turkish students and culture enthusiasts
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-turkish-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💫</span>
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">Opportunities</h3>
                <p className="text-neutral-600 text-sm">
                  Networking, leadership roles, and personal development
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Membership Application
              </h2>
              <p className="text-neutral-600">
                Fill out the form below and we&apos;ll get back to you soon!
              </p>
            </div>

            {submitStatus === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
                <p className="text-green-700 mb-6">
                  Your membership request has been submitted successfully. 
                  We&apos;ll be in touch with you soon!
                </p>
                <p className="text-green-600 text-sm">
                  Hoşgeldiniz - Welcome to TSA TWENTE! 🇹🇷
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name <span className="text-turkish-red">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-neutral-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address <span className="text-turkish-red">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-neutral-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg transition-colors"
                    placeholder="+31 6 12345678"
                  />
                </div>

                {/* University */}
                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-neutral-700 mb-2">
                    University / School
                  </label>
                  <select
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg transition-colors bg-white"
                  >
                    <option value="">Select your institution</option>
                    <option value="University of Twente">University of Twente</option>
                    <option value="Saxion University">Saxion University of Applied Sciences</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Study Program */}
                <div>
                  <label htmlFor="studyProgram" className="block text-sm font-medium text-neutral-700 mb-2">
                    Study Program
                  </label>
                  <input
                    type="text"
                    id="studyProgram"
                    name="studyProgram"
                    value={formData.studyProgram}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg transition-colors"
                    placeholder="e.g., Computer Science, Business Administration"
                  />
                </div>

                {/* Interests */}
                <div>
                  <label htmlFor="interests" className="block text-sm font-medium text-neutral-700 mb-2">
                    Why do you want to join TSA TWENTE?
                  </label>
                  <textarea
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg transition-colors resize-none"
                    placeholder="Tell us about your interests and what you hope to get from joining TSA TWENTE..."
                  />
                </div>

                {/* Submit Error */}
                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    Something went wrong. Please try again later or contact us directly.
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <>
                      Submit Application
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-center text-neutral-500 text-sm">
                  By submitting, you agree to receive communications from TSA TWENTE
                </p>
              </form>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
