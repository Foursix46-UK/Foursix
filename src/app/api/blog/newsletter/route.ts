// app/api/blog/newsletter/route.ts
import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore/lite';
import { db } from '@/lib/firebase-lite';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, sourcePage } = body;

    // 1. Basic Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // 2. Check for Duplicates
    const subscribersRef = collection(db, 'blog_newsletter_signups');
    const q = query(subscribersRef, where('email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);

    // 3. Save to Firebase if they aren't already subscribed
    if (snapshot.empty) {
      await addDoc(subscribersRef, {
        email: email.toLowerCase(),
        consentGiven: true, 
        sourcePage: sourcePage || '/blog',
        signupDate: serverTimestamp(),
      });
    }

    // 4. Return success to the frontend immediately!
    return NextResponse.json({ message: 'Subscribed successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Subscription Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}