import type { Metadata } from 'next';
import UploadClient from './UploadClient';

export const metadata: Metadata = {
  title: 'Upload',
  description: 'Upload new photographs to your portfolio.',
};

export default function UploadPage() {
  return <UploadClient />;
}
