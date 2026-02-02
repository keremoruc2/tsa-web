import JoinPage from "@/components/JoinPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Us",
  description: "Become a member of TSA TWENTE at University of Twente. Join our vibrant Turkish student community, attend exclusive events, and connect with fellow students in Enschede.",
  openGraph: {
    title: "Join TSA TWENTE - Become a Member",
    description: "Become a member of the Turkish Student Association at University of Twente. Join our vibrant community and attend exclusive events!",
    url: "/join",
  },
  twitter: {
    title: "Join TSA TWENTE",
    description: "Become a member of the Turkish Student Association at University of Twente.",
  },
};

export default function Page() {
  return <JoinPage />;
}
