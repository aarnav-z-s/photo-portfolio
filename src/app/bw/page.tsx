import type { Metadata } from 'next';
import BWClient from './BWClient';

export const metadata: Metadata = {
  title: 'Black & White',
  description: 'Black and white film photography by AZ — silver gelatin aesthetics in the tradition of documentary photography.',
};

export default function BWPage() {
  return <BWClient />;
}
