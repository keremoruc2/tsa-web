'use client';

import Image from 'next/image';
import Link from 'next/link';
import Layout from './Layout';
import { useEffect, useState } from 'react';

type BoardMember = {
  id: string;
  name: string;
  role: string;
  roles?: string | null;
  image?: string | null;
  order: number;
};

export default function AboutPage() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [loadingBoard, setLoadingBoard] = useState(true);

  useEffect(() => {
    fetch('/api/board')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setBoardMembers(data.members);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingBoard(false));
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 px-4 bg-turkish-red text-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About TSA TWENTE
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Turkish Student Association at University of Twente - where culture, 
              community, and connection come together.
            </p>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <span className="text-turkish-red font-semibold uppercase tracking-wider text-sm">Our Mission</span>
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2 mb-6">
                  Celebrating Turkish Culture in the Netherlands
                </h2>
                <div className="space-y-4 text-neutral-600 leading-relaxed">
                  <p>
                    TSA TWENTE (Turkish Student Association at University of Twente) was founded with a simple but 
                    powerful mission: to bring Turkish culture to life in the heart of the Netherlands 
                    while creating a home away from home for Turkish students and those interested in 
                    Turkish culture.
                  </p>
                  <p>
                    We believe that cultural exchange enriches everyone. Through our events, gatherings, 
                    and community activities, we create opportunities for people from all backgrounds to 
                    experience the warmth, hospitality, and rich traditions of Turkey.
                  </p>
                  <p>
                    Whether you&apos;re a Turkish student looking for familiar faces, an international 
                    student curious about Turkish culture, or anyone seeking a welcoming community, 
                    TSA TWENTE opens its doors to you.
                  </p>
                </div>
              </div>
              <div className="order-1 md:order-2 relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80"
                    alt="Community gathering"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-turkish-red/10 rounded-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-20 px-4 bg-section-alt">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-turkish-red font-semibold uppercase tracking-wider text-sm">Our Values</span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
                What Drives Us
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Community */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
                <div className="w-12 h-12 bg-turkish-red/10 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Community</h3>
                <p className="text-neutral-600 text-sm">
                  Building a supportive network where everyone feels welcome and valued.
                </p>
              </div>

              {/* Culture */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
                <div className="w-12 h-12 bg-turkish-red/10 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🎭</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Culture</h3>
                <p className="text-neutral-600 text-sm">
                  Preserving and sharing the rich heritage of Turkish traditions.
                </p>
              </div>

              {/* Inclusivity */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
                <div className="w-12 h-12 bg-turkish-red/10 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Inclusivity</h3>
                <p className="text-neutral-600 text-sm">
                  Welcoming people from all backgrounds to experience Turkish culture.
                </p>
              </div>

              {/* Excellence */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
                <div className="w-12 h-12 bg-turkish-red/10 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Excellence</h3>
                <p className="text-neutral-600 text-sm">
                  Striving to create memorable experiences in everything we do.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-turkish-red font-semibold uppercase tracking-wider text-sm">What We Offer</span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
                Our Activities
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-turkish-red rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-turkish-red/30">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Cultural Events</h3>
                <p className="text-neutral-600">
                  From traditional Turkish nights to national holiday celebrations, we organize 
                  events that bring our culture to life.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-turkish-red rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-turkish-red/30">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Networking</h3>
                <p className="text-neutral-600">
                  Connect with professionals, alumni, and fellow students to build 
                  valuable relationships for your future career.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-turkish-red rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-turkish-red/30">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Social Gatherings</h3>
                <p className="text-neutral-600">
                  Regular meetups, dinners, and social events where friendships flourish 
                  and memories are made.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Our Board Section */}
        <section className="py-16 md:py-20 px-4 bg-section-alt">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-turkish-red font-semibold uppercase tracking-wider text-sm">Our Team</span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
                Meet Our Board
              </h2>
              <p className="text-neutral-600 mt-4 max-w-2xl mx-auto">
                The dedicated team behind TSA TWENTE, working to bring you the best experiences and community.
              </p>
            </div>

            {loadingBoard ? (
              <div className="flex justify-center">
                <div className="animate-pulse flex gap-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : boardMembers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {boardMembers.map((member) => (
                  <div key={member.id} className="text-center group">
                    <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40 mb-4">
                      <div className="absolute inset-0 bg-turkish-red/20 rounded-full transform group-hover:scale-105 transition-transform duration-300"></div>
                      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-4xl text-gray-400">👤</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="font-bold text-neutral-900 text-lg">{member.name}</h3>
                    <p className="text-turkish-red font-medium text-sm">{member.role}</p>
                    {member.roles && (
                      <p className="text-neutral-500 text-xs mt-1">{member.roles}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-neutral-500">
                Board members coming soon.
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 px-4 bg-neutral-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Want to Be Part of Our Story?
            </h2>
            <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
              Join TSA TWENTE and become part of a vibrant community that celebrates culture, 
              friendship, and connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/join"
                className="inline-flex items-center justify-center px-8 py-4 bg-turkish-red text-white font-bold uppercase tracking-wider rounded-lg hover:bg-turkish-red-dark transition-all duration-300"
              >
                Join Us Today
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold uppercase tracking-wider rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                See Our Events
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
