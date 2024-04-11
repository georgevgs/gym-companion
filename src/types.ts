export interface MetaSEO {
  title?: string;
  description?: string;
  image?: string;

  canonical?: string | URL;
  noindex?: boolean;
  nofollow?: boolean;

  ogTitle?: string;
  ogType?: string;
}

export interface ImageType {
  src: string;
  alt: string;
}

export interface CardData {
  link: string;
  image: { src: ImageMetadata; alt: string };
  title: string;
  subtitle: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: string;
}