import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, consent, source } = body;

    // 1. Basic Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (consent !== true) {
      return NextResponse.json({ error: 'GDPR consent is required' }, { status: 400 });
    }

    // Get IP Address (Next.js specific way)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';

    const subscribersRef = collection(db, 'subscribers');

    // 2. Check for Duplicates in Firebase
    const q = query(subscribersRef, where('email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // 3. Log the attempt in Firebase (Status: Pending)
      await addDoc(subscribersRef, {
        email: email.toLowerCase(),
        consent: true,
        status: "pending",
        source: source || 'Unknown',
        ipAddress: ip,
        subscribedAt: serverTimestamp(),
      });
    }

    // 4. Send to Brevo API (Double Opt-In Flow)
    // You will add these keys to your .env.local file later!
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID || "0");
    const BREVO_TEMPLATE_ID = parseInt(process.env.BREVO_DOI_TEMPLATE_ID || "0");
    const REDIRECTION_URL = "https://foursix46.com/confirmed";

    if (BREVO_API_KEY && BREVO_LIST_ID && BREVO_TEMPLATE_ID) {
      const brevoResponse = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          includeListIds: [BREVO_LIST_ID],
          templateId: BREVO_TEMPLATE_ID,
          redirectionUrl: REDIRECTION_URL
        })
      });

      if (!brevoResponse.ok) {
        const errorData = await brevoResponse.json();
        console.error("Brevo Error:", errorData);
        // We still return 200 to the user so the UI shows success, but log the error
      }
    } else {
      console.warn("Brevo API keys missing. Logged to Firebase only.");
    }

    return NextResponse.json({ message: 'Please check your email to confirm subscription.' }, { status: 200 });

  } catch (error) {
    console.error('Subscription Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}