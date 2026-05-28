import type { Metadata } from 'next';
import EssaysClient from './EssaysClient';

export const metadata: Metadata = {
  title: 'Visual Essays',
  description: 'Visual essays by AZ — photography as extended narrative, sequences that tell stories over time.',
};

export default function EssaysPage() {
  return <EssaysClient />;
}
