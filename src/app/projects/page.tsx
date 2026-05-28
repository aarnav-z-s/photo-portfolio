import type { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Long-form documentary photography projects by AZ — multi-image narratives exploring place, time, and human presence.',
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
