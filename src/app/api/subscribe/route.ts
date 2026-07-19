import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore/lite';
import { db } from '@/lib/firebase-lite';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, consent, source } = body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    // 1. Basic Validation
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (consent !== true) {
      return NextResponse.json({ error: 'GDPR consent is required' }, { status: 400 });
    }

    // Get IP Address (Next.js specific way)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';

    // 2. Best-effort logging in Firebase (should not block subscription UX)
    let firebaseLogged = false;
    try {
      const subscribersRef = collection(db, 'subscribers');
      const q = query(subscribersRef, where('email', '==', normalizedEmail));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        await addDoc(subscribersRef, {
          email: normalizedEmail,
          consent: true,
          status: "pending",
          source: source || 'Unknown',
          ipAddress: ip,
          subscribedAt: serverTimestamp(),
        });
      }
      firebaseLogged = true;
    } catch (firebaseError) {
      console.warn('Subscription Firebase logging failed:', firebaseError);
    }

    // 4. Send to Brevo API (Double Opt-In Flow)
    // You will add these keys to your .env.local file later!
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID || "0");
    const BREVO_TEMPLATE_ID = parseInt(process.env.BREVO_DOI_TEMPLATE_ID || "0");
    const REDIRECTION_URL = process.env.BREVO_REDIRECT_URL || "https://foursix46.com/subscribed";

    let brevoAccepted = false;
    if (BREVO_API_KEY && BREVO_LIST_ID && BREVO_TEMPLATE_ID) {
      const brevoResponse = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY
        },
        body: JSON.stringify({
          email: normalizedEmail,
          includeListIds: [BREVO_LIST_ID],
          templateId: BREVO_TEMPLATE_ID,
          redirectionUrl: REDIRECTION_URL
        })
      });

      if (!brevoResponse.ok) {
        const errorText = await brevoResponse.text();
        let errorData: unknown = errorText;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          // Keep raw response text if Brevo didn't return JSON.
        }
        console.error("Brevo Error:", errorData);
      } else {
        brevoAccepted = true;
      }
    } else {
      console.warn("Brevo API keys missing. Logged to Firebase only.");
    }

    if (brevoAccepted) {
      return NextResponse.json({ message: 'Please check your email to confirm subscription.' }, { status: 200 });
    }

    if (firebaseLogged) {
      return NextResponse.json({ message: 'Subscription received. Confirmation email service is currently unavailable.' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Subscription request received. Please try again shortly for email confirmation.' }, { status: 200 });

  } catch (error) {
    console.error('Subscription Error:', error);
    return NextResponse.json({ error: 'Unable to process subscription at the moment. Please try again.' }, { status: 503 });
  }
}