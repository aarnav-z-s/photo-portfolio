export interface PhotoMetadata {
  camera?: string;
  lens?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
  location?: string;
  date?: string;
  thoughts?: string;
}

export interface Photo {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  src: string;
  thumbnail?: string;
  placeholder?: string; // CSS color for placeholder
  width: number;
  height: number;
  aspectRatio?: number;
  category: 'projects' | 'experimental' | 'bw' | 'essays';
  featured?: boolean;
  featured_order?: number;
  metadata?: PhotoMetadata;
  essay?: EssayContent;
  tags?: string[];
  private?: boolean;
  albumSlug?: string;
}

export interface EssayContent {
  title: string;
  intro: string;
  sections: {
    heading?: string;
    body: string;
    photo?: Photo;
  }[];
}

export interface Album {
  slug: string;
  title: string;
  description?: string;
  coverPhoto?: Photo;
  photos: Photo[];
  private: boolean;
  passwordHash?: string;
  createdAt: string;
}

export interface GallerySection {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  photos: Photo[];
  layout?: 'masonry' | 'grid' | 'editorial' | 'stack';
}

export type ViewMode = 'grid' | 'list' | 'story';
export type CategorySlug = 'projects' | 'experimental' | 'bw' | 'essays';
