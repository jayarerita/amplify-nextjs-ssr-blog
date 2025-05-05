import { Metadata } from 'next';
import AboutContent from './about-content';

export const metadata: Metadata = {
  title: 'About Me | Your Name',
  description: 'Full-stack developer passionate about building products that make a difference. Learn more about my journey, skills, and current projects.',
  openGraph: {
    title: 'About Me | Your Name',
    description: 'Full-stack developer passionate about building products that make a difference. Learn more about my journey, skills, and current projects.',
    type: 'profile',
  },
};

export default function AboutPage() {
  return <AboutContent />;
} 