// Upcoming events
export type Event = {
  id: number;
  title: string;
  date: string; // date-only string YYYY-MM-DD
  time?: string | null;
  dateTBA?: boolean;
  venue?: string | null;
  location?: string | null;
  description?: string | null;
  image?: string | null;
  hidden?: boolean;
};

// Past events
export type PastEvent = {
  id: number;
  title: string;
  date: string; // date-only string YYYY-MM-DD
  venue?: string | null;
  location?: string | null;
  image?: string | null;
  gallery?: string | null; // Comma-separated gallery image URLs
  description?: string | null;
  hidden?: boolean;
};

export type EventsApiResponse = {
  ok: boolean;
  upcoming: Event[];
  past: PastEvent[];
};
