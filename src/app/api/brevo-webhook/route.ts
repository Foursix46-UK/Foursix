import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: Request) {
  try {
    // 1. Read the hidden message Brevo sends us
    const payload = await req.json();
    const email = payload.email;

    if (!email) {
      return NextResponse.json({ error: 'No email provided in payload' }, { status: 400 });
    }

    // 2. Find this specific user in your Firebase database
    const subscribersRef = collection(db, 'subscribers');
    const q = query(subscribersRef, where('email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // 3. Change their status from "pending" to "active"
      const updatePromises = snapshot.docs.map(doc => 
        updateDoc(doc.ref, { status: 'active' })
      );
      await Promise.all(updatePromises);
      
      console.log(`Webhook Success: Updated ${email} to active!`);
    } else {
      console.warn(`Webhook Warning: Received confirmation for ${email}, but they are not in Firebase.`);
    }

    // Always send a 200 OK back to Brevo so they know we received it
    return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}