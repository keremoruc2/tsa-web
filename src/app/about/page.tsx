import AboutPage from "@/components/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the Turkish Student Association at University of Twente. Discover our mission, values, board members, and the vibrant community we've built.",
  openGraph: {
    title: "About TSA TWENTE - Our Mission & Team",
    description: "Learn about the Turkish Student Association at University of Twente. Discover our mission, values, and meet our dedicated board members.",
    url: "/about",
  },
  twitter: {
    title: "About TSA TWENTE",
    description: "Learn about the Turkish Student Association at University of Twente.",
  },
};

export default function Page() {
  return <AboutPage />;
}
