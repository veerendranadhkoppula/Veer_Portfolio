import type { Metadata } from 'next'
import React from 'react'
import './styles.css'

export const metadata: Metadata = {
  title: 'Veerendranadh Koppula | Full-Stack Engineer — Web & App Development',
  description:
    'Full-stack engineer building websites, mobile apps, e-commerce stores, and sales pages — from emailer development to full campaign execution. Next.js, React, Shopify, WordPress, Ionic, Payload CMS.',
  keywords: [
    'Veerendranadh Koppula',
    'full stack engineer',
    'full stack developer India',
    'web developer India',
    'app developer India',
    'freelance web developer',
    'Next.js developer',
    'React developer',
    'Shopify developer',
    'WordPress developer',
    'Ionic developer',
    'mobile app developer',
    'Payload CMS developer',
    'emailer development',
    'Mailchimp developer',
    'email campaign developer',
    'sales page developer',
    'e-commerce developer',
    'web developer for hire',
    'full stack engineer for hire',
  ],
  metadataBase: new URL('https://www.veerendranadh.com'),
  openGraph: {
    title: 'Veerendranadh Koppula | Full-Stack Engineer — Web & App Development',
    description:
      'Full-stack engineer building websites, mobile apps, e-commerce stores, and sales pages — from emailer development to full campaign execution. Next.js, React, Shopify, WordPress, Ionic, Payload CMS.',
    url: 'https://www.veerendranadh.com',
    siteName: 'Veerendranadh Koppula',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Veerendranadh Koppula | Full-Stack Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veerendranadh Koppula | Full-Stack Engineer — Web & App Development',
    description:
      'Full-stack engineer building websites, mobile apps, e-commerce stores, and sales pages — from emailer development to full campaign execution. Next.js, React, Shopify, WordPress, Ionic, Payload CMS.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}