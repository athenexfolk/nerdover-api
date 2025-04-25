export interface Menu {
  name: string;
  slug: string;
  lessons: { slug: string; title: string }[];
}
