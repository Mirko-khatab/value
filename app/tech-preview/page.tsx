import TechComingSoon from '@/app/ui/tech-coming-soon';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VALUE TECH - Coming Soon',
  description: 'Constructing the Future of Architecture - VALUE TECH is coming soon',
};

/**
 * Demo page for VALUE TECH Coming Soon
 * 
 * Visit: http://localhost:3000/tech-preview
 * 
 * This page demonstrates the full-screen coming soon component
 * designed for tech.valuearch.com subdomain
 */

export default function TechPreviewPage() {
  return <TechComingSoon />;
}
