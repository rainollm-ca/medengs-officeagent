import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'MedEngs OfficeAgent for Dental',
  description: 'AI office agent for dental clinic forms, PDFs, patient links, cloud files, and follow-ups.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
