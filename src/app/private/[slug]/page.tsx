import type { Metadata } from 'next';
import PrivateAlbumClient from './PrivateAlbumClient';

export const metadata: Metadata = {
  title: 'Private Album',
  description: 'Password-protected private photography album.',
  robots: { index: false, follow: false },
};

export default function PrivateAlbumPage({ params }: { params: { slug: string } }) {
  return <PrivateAlbumClient slug={params.slug} />;
}
