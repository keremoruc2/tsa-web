"use client";
import React, { useState } from 'react';
import Layout from './Layout';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Failed to send message');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Failed to send message. Please try again.');
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              We&apos;d love to hear from you! Get in touch with the TSA TWENTE team.
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Details */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">
                  Get in Touch
                </h2>
                <p className="text-neutral-600 mb-8">
                  Have questions about TSA TWENTE, our events, or membership? We&apos;re here to help!
                  Reach out through any of the channels below.
                </p>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-turkish-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-turkish-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Email</h3>
                      <a 
                        href="mailto:tsatwente@gmail.com" 
                        className="text-turkish-red hover:underline"
                      >
                        tsatwente@gmail.com
                      </a>
                      <p className="text-neutral-500 text-sm mt-1">
                        We typically respond within 24-48 hours
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-turkish-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-turkish-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Location</h3>
                      <p className="text-neutral-600">
                        University of Twente<br />
                        Drienerlolaan 5<br />
                        7522 NB Enschede<br />
                        Netherlands
                      </p>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-turkish-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-turkish-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Office Hours</h3>
                      <p className="text-neutral-600">
                        We&apos;re a student organization, so our availability varies.
                        Best to reach us via email!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">
                  Send a Message
                </h2>

                {status === 'success' ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-xl text-center">
                    <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p>Thank you for reaching out. We&apos;ll get back to you soon!</p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-4 text-green-600 underline hover:no-underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {status === 'error' && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {errorMsg}
                      </div>
                    )}

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-turkish-red focus:border-transparent transition-all"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-turkish-red focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-turkish-red focus:border-transparent transition-all"
                        placeholder="What is this about?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-turkish-red focus:border-transparent transition-all resize-none"
                        placeholder="Your message..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full bg-turkish-red text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {status === 'sending' ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-16">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6 text-center">
                Follow Us
              </h2>
              <p className="text-neutral-600 mb-8 text-center max-w-xl mx-auto">
                Stay updated with our latest events, news, and community activities 
                by following us on Instagram.
              </p>

              <div className="flex justify-center">
                  {/* Instagram */}
                  <a
                    href="https://instagram.com/tsatwente"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-neutral-50 rounded-xl hover:bg-turkish-red/5 transition-colors group max-w-sm w-full"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.227-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-neutral-900 group-hover:text-turkish-red transition-colors">
                        Instagram
                      </h3>
                      <p className="text-neutral-500 text-sm">@tsatwente</p>
                    </div>
                    <svg className="w-5 h-5 text-neutral-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-section-alt">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-turkish-red font-semibold uppercase tracking-wider text-sm">FAQ</span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Do I need to be Turkish to join TSA TWENTE?
                </h3>
                <p className="text-neutral-600">
                  Not at all! TSA TWENTE welcomes everyone who is interested in Turkish culture, 
                  wants to make new friends, or simply wants to be part of our community.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  How can I join the team?
                </h3>
                <p className="text-neutral-600">
                  Visit our Join page and apply to join the team! We&apos;re always looking for 
                  enthusiastic people to help organize events, manage social media, and contribute 
                  to our community.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  What kind of events do you organize?
                </h3>
                <p className="text-neutral-600">
                  We organize a variety of events including cultural celebrations, social gatherings, 
                  networking events, and fun activities throughout the year. Follow us on Instagram 
                  to stay updated!
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  What do I get from joining the team?
                </h3>
                <p className="text-neutral-600">
                  You&apos;ll gain valuable experience in event organization, build leadership skills, 
                  expand your network, and have the opportunity to become a future board member. 
                  Plus, you&apos;ll be part of an amazing community!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 px-4 bg-turkish-red text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join?
            </h2>
            <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
              Become part of our team and help shape the TSA TWENTE community!
            </p>
            <a
              href="/join"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-turkish-red font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-100 transition-all duration-300"
            >
              Join the Team
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}
