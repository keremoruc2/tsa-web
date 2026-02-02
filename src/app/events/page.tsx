import EventsPage from "@/components/EventsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Discover upcoming cultural events, Turkish nights, networking gatherings, and social activities from TSA TWENTE at University of Twente in Enschede.",
  openGraph: {
    title: "Events - TSA TWENTE",
    description: "Discover upcoming cultural events, Turkish nights, and social gatherings from the Turkish Student Association at University of Twente.",
    url: "/events",
  },
  twitter: {
    title: "TSA TWENTE Events",
    description: "Discover upcoming events from the Turkish Student Association at University of Twente.",
  },
};

export default function Page() {
  return <EventsPage />;
}
