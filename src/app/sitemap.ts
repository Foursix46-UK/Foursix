import { MetadataRoute } from 'next';
import { collection, getDocs } from 'firebase/firestore/lite';
import { db } from '@/lib/firebase-lite'; // Adjust this path to your firebase config

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://foursix46.com';

  // 1. Core Static Pages
  const staticRoutes = ['', '/about', '/ventures', '/global', '/leadership', '/magazines', '/newsroom', '/careers', '/contact', '/privacy', '/terms', '/cookies'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    // 2. Fetch Dynamic Ventures
    const venturesSnap = await getDocs(collection(db, 'ventures'));
    const dynamicVentures = venturesSnap.docs.map((doc) => ({
      url: `${baseUrl}/ventures/${doc.data().ventureSlug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }));

    // 3. Fetch Dynamic News
    const newsSnap = await getDocs(collection(db, 'news'));
    const dynamicNews = newsSnap.docs.map((doc) => ({
      url: `${baseUrl}/newsroom/${doc.data().slug}`,
      lastModified: new Date(doc.data().publishDate?.toDate() || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...dynamicVentures, ...dynamicNews];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticRoutes; // Fallback to just static if DB fails
  }
}