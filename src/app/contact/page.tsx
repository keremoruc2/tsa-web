import ContactPage from "@/components/ContactPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with TSA TWENTE at University of Twente. Contact us for questions about membership, events, collaborations, or anything else. We'd love to hear from you!",
  openGraph: {
    title: "Contact TSA TWENTE",
    description: "Get in touch with the Turkish Student Association at University of Twente. We'd love to hear from you!",
    url: "/contact",
  },
  twitter: {
    title: "Contact TSA TWENTE",
    description: "Get in touch with the Turkish Student Association at University of Twente.",
  },
};

export default function Page() {
  return <ContactPage />;
}
