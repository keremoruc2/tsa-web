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
  gallery?: string | null; // Comma-separated gallery image URLs
};

export type EventsApiResponse = {
  ok: boolean;
  upcoming: Event[];
  past: Event[];
};
