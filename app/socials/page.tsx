import { Metadata } from 'next';
import { SocialsContent } from './socials-content';

export const metadata: Metadata = {
  title: 'Connect With Me | Social Links',
  description: 'Find and connect with me across various social media platforms including X (Twitter), LinkedIn, and Bluesky.',
  openGraph: {
    title: 'Connect With Me | Social Links',
    description: 'Find and connect with me across various social media platforms including X (Twitter), LinkedIn, and Bluesky.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Connect With Me | Social Links',
    description: 'Find and connect with me across various social media platforms including X (Twitter), LinkedIn, and Bluesky.',
  },
};

export default function SocialsPage() {
  return <SocialsContent />;
} 