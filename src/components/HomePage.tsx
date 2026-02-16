"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import Layout from './Layout';
import type { EventsApiResponse } from '@/types/events';
import { formatDateOnlyHuman } from '@/utils/date';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface FormData {
  name: string;
  email: string;
  phone: string;
  studyProgram: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

function JoinTeamForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    studyProgram: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        setFormData({ name: '', email: '', phone: '', studyProgram: '', message: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Something went wrong.');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-green-800 mb-2">Application Submitted!</h3>
        <p className="text-green-700 text-sm mb-4">
          We&apos;ll review your application and get back to you soon.
        </p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="text-turkish-red font-semibold hover:underline text-sm"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 border rounded-lg text-sm ${
            errors.name ? 'border-red-400 bg-red-50' : 'border-neutral-300'
          }`}
          placeholder="Full Name *"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 border rounded-lg text-sm ${
            errors.email ? 'border-red-400 bg-red-50' : 'border-neutral-300'
          }`}
          placeholder="Email Address *"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm"
          placeholder="Phone (optional)"
        />
        <input
          type="text"
          name="studyProgram"
          value={formData.studyProgram}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm"
          placeholder="Study Program"
        />
      </div>

      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        rows={2}
        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm resize-none"
        placeholder="Why do you want to join? (optional)"
      />

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-700 text-xs">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-turkish-red text-white font-semibold rounded-lg hover:bg-turkish-red-dark transition-colors disabled:opacity-50 flex items-center justify-center text-sm"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          'Join the Team'
        )}
      </button>
    </form>
  );
}

export default function HomePage() {
  const { data } = useSWR<EventsApiResponse>("/api/events", fetcher);
  const upcomingEvents = data?.upcoming?.slice(0, 3) || [];

  return (
    <Layout>
      {/* Hero Section - Split Layout on Desktop */}
      <section className="relative min-h-[85vh] lg:min-h-[80vh] bg-turkish-red overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 lg:py-16 min-h-[85vh] lg:min-h-[80vh] flex items-center">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
            {/* Left - Hero Content */}
            <div className="text-white text-center lg:text-left">
              {/* Logo */}
              <div className="mb-6 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-full shadow-2xl overflow-hidden">
                  <Image
                    src="/images/logo.jpg"
                    alt="TSA TWENTE Logo"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 animate-fade-in">
                Hoşgeldiniz!
              </h1>
              <p className="text-xl md:text-2xl font-light mb-3 opacity-90 animate-fade-in">
                Welcome to TSA TWENTE
              </p>
              <p className="text-base md:text-lg max-w-xl mx-auto lg:mx-0 mb-8 opacity-80 font-light animate-fade-in leading-relaxed">
                Turkish Student Association at University of Twente. Celebrating Turkish culture, 
                building friendships, and creating unforgettable memories.
              </p>

              {/* Mobile only - Join Button */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-in lg:hidden">
                <Link
                  href="/join"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-turkish-red font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-100 transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                >
                  Join Us
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white font-bold uppercase tracking-wider rounded-lg hover:bg-white/10 transition-all duration-300 text-sm"
                >
                  Upcoming Events
                </Link>
              </div>

              {/* Desktop - Quick Links */}
              <div className="hidden lg:flex flex-wrap gap-4 animate-fade-in">
                <Link
                  href="/events"
                  className="inline-flex items-center px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  View Events
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About Us
                </Link>
                <a
                  href="https://instagram.com/tsatwente"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.227-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                  </svg>
                  @tsatwente
                </a>
              </div>
            </div>

            {/* Right - Join Form (Desktop Only) */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md ml-auto animate-fade-in">
                <div className="text-center mb-5">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-turkish-red/10 rounded-full mb-3">
                    <svg className="w-6 h-6 text-turkish-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900">Join the Team</h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    Help us organize events and build our community
                  </p>
                </div>
                <JoinTeamForm />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-turkish-red font-semibold uppercase tracking-wider text-sm">About Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2 mb-6">
                Building Bridges Between Cultures
              </h2>
              <p className="text-neutral-600 mb-6 leading-relaxed">
                TSA TWENTE is the official Turkish Student Association at the University of Twente. Founded by students 
                who wanted to share the richness of Turkish culture with the university community, we&apos;ve 
                grown into a vibrant organization that welcomes everyone.
              </p>
              <p className="text-neutral-600 mb-8 leading-relaxed">
                Whether you&apos;re Turkish, have Turkish roots, or simply curious about Turkish culture, 
                you&apos;ll find a warm community here. We organize cultural events, networking opportunities, 
                and social gatherings throughout the academic year.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center text-turkish-red font-semibold hover:underline"
              >
                Learn more about us
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80"
                  alt="Istanbul cityscape with Turkish culture"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-turkish-red/10 rounded-2xl -z-10"></div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-turkish-red/5 rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 px-4 bg-section-alt">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-turkish-red font-semibold uppercase tracking-wider text-sm">What We Do</span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
              Experience Turkish Culture
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Cultural Events */}
            <div className="card rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-turkish-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-turkish-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Cultural Events</h3>
              <p className="text-neutral-600">
                From traditional celebrations to modern gatherings, experience the 
                richness of Turkish culture through our diverse events.
              </p>
            </div>

            {/* Networking */}
            <div className="card rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-turkish-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-turkish-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Networking</h3>
              <p className="text-neutral-600">
                Connect with fellow students, professionals, and community members 
                who share your interest in Turkish culture.
              </p>
            </div>

            {/* Community */}
            <div className="card rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-turkish-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-turkish-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Community</h3>
              <p className="text-neutral-600">
                Be part of a welcoming community that feels like family. 
                Make lifelong friendships and create lasting memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-turkish-red font-semibold uppercase tracking-wider text-sm">Events</span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
                Upcoming Events
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="card rounded-xl overflow-hidden">
                  <div className="relative aspect-[16/10] bg-neutral-100">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-turkish-red to-red-700 flex items-center justify-center">
                        <span className="text-4xl">🇹🇷</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-turkish-red font-medium mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{event.dateTBA ? 'Date TBA' : formatDateOnlyHuman(event.date)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2">{event.title}</h3>
                    {event.location && (
                      <p className="text-sm text-neutral-500 flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>{event.location}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/events"
                className="btn-primary inline-flex items-center rounded-lg"
              >
                View All Events
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 px-4 bg-turkish-red">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Become a member of TSA TWENTE and be part of a vibrant community that celebrates 
            Turkish culture at the University of Twente.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-turkish-red font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-100 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Become a Member
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
