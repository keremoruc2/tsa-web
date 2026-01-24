"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import type { EventsApiResponse, Event } from '@/types/events';
import { formatDateOnlyHuman } from '@/utils/date';
import ScrollableEventGrid from './ScrollableEventGrid';
import Layout from './Layout';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function EventCard({ event, isPast = false }: { event: Event; isPast?: boolean }) {
  const formatTime = (time?: string | null) => {
    if (!time) return '';
    return time;
  };

  return (
    <div className="card rounded-xl overflow-hidden flex-shrink-0 w-80 md:w-96 snap-start group">
      <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-turkish-red to-red-700 flex items-center justify-center">
            <span className="text-5xl">🇹🇷</span>
          </div>
        )}
        {isPast && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-neutral-900/80 text-white text-xs font-medium rounded-full">
            Past Event
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-turkish-red font-medium mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>
            {event.dateTBA ? 'Date TBA' : formatDateOnlyHuman(event.date)}
            {event.time && !event.dateTBA && ` at ${formatTime(event.time)}`}
          </span>
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-turkish-red transition-colors">
          {event.title}
        </h3>
        {event.location && (
          <p className="text-sm text-neutral-500 flex items-center space-x-1 mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>{event.location}</span>
          </p>
        )}
        {event.description && (
          <p className="text-neutral-600 text-sm line-clamp-2 mb-4">
            {event.description}
          </p>
        )}
        {event.gallery && isPast && (
          <p className="text-turkish-red text-sm font-medium">
            📸 Gallery available
          </p>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const { data, isLoading } = useSWR<EventsApiResponse>("/api/events", fetcher);

  const upcomingEvents = data?.upcoming || [];
  const pastEvents = data?.past || [];
  const nextEvent = upcomingEvents[0];
  const otherUpcomingEvents = upcomingEvents.slice(1);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-turkish-red border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-4 bg-gradient-to-br from-turkish-red via-red-600 to-red-700 text-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Events
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Discover our upcoming events and relive past memories
            </p>
          </div>
        </section>

        {/* Next Event - Featured */}
        {nextEvent && (
          <section className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-turkish-red font-semibold uppercase tracking-wider text-sm">Up Next</span>
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
                  Featured Event
                </h2>
              </div>

              <div className="card rounded-2xl overflow-hidden max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-square md:aspect-auto bg-neutral-100">
                    {nextEvent.image ? (
                      <Image
                        src={nextEvent.image}
                        alt={nextEvent.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-turkish-red to-red-700 flex items-center justify-center">
                        <span className="text-8xl">🇹🇷</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="inline-flex items-center space-x-2 text-turkish-red font-medium mb-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-lg">
                        {nextEvent.dateTBA ? 'Date TBA' : formatDateOnlyHuman(nextEvent.date)}
                        {nextEvent.time && !nextEvent.dateTBA && ` at ${nextEvent.time}`}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                      {nextEvent.title}
                    </h3>
                    {nextEvent.location && (
                      <p className="text-neutral-500 flex items-center space-x-2 mb-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>{nextEvent.location}</span>
                      </p>
                    )}
                    {nextEvent.description && (
                      <p className="text-neutral-600 leading-relaxed mb-6">
                        {nextEvent.description}
                      </p>
                    )}
                    <Link
                      href="/join"
                      className="btn-primary inline-flex items-center justify-center rounded-lg w-full md:w-auto"
                    >
                      Join Us to Attend
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Other Upcoming Events */}
        {otherUpcomingEvents.length > 0 && (
          <section className="py-16 px-4 bg-section-alt">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-turkish-red font-semibold uppercase tracking-wider text-sm">Coming Soon</span>
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
                  More Upcoming Events
                </h2>
              </div>

              <ScrollableEventGrid>
                {otherUpcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </ScrollableEventGrid>
            </div>
          </section>
        )}

        {/* No Upcoming Events */}
        {!nextEvent && (
          <section className="py-20 px-4 bg-white">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                No Upcoming Events
              </h2>
              <p className="text-neutral-600 mb-8">
                Stay tuned! We&apos;re planning exciting events for the community. 
                Join us to be the first to know when new events are announced.
              </p>
              <Link
                href="/join"
                className="btn-primary inline-flex items-center rounded-lg"
              >
                Join TAUT
              </Link>
            </div>
          </section>
        )}

        {/* Past Events / Gallery */}
        {pastEvents.length > 0 && (
          <section className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-turkish-red font-semibold uppercase tracking-wider text-sm">Gallery</span>
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
                  Past Events
                </h2>
                <p className="text-neutral-600 mt-3 max-w-2xl mx-auto">
                  Relive the memories from our previous events
                </p>
              </div>

              <ScrollableEventGrid>
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} isPast />
                ))}
              </ScrollableEventGrid>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 px-4 bg-neutral-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Don&apos;t Miss Out!
            </h2>
            <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
              Become a TAUT member to get early access to events and stay updated 
              on all our activities.
            </p>
            <Link
              href="/join"
              className="inline-flex items-center justify-center px-8 py-4 bg-turkish-red text-white font-bold uppercase tracking-wider rounded-lg hover:bg-turkish-red-dark transition-all duration-300"
            >
              Become a Member
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
