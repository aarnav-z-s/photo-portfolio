import type { Metadata } from 'next';
import ExperimentalClient from './ExperimentalClient';

export const metadata: Metadata = {
  title: 'Experimental',
  description: 'Alternative process and experimental photography by AZ — double exposures, chemigrammes, pinhole, and darkroom experimentation.',
};

export default function ExperimentalPage() {
  return <ExperimentalClient />;
}
