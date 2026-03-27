import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { role, name, fullName, email, company, category, message } = await req.json();

    // 1. NORMALIZE DATA
    const full_name = fullName || name || "Website Visitor";
    const inquiry_type = category || role || "General Question";
    const company_name = company || "Not provided";
    const year = new Date().getFullYear();
    const timestamp = new Date().toLocaleString('en-GB', { 
      timeZone: 'Europe/London', 
      dateStyle: 'full', 
      timeStyle: 'long' 
    });

    // 2. EXACT ROUTING LOGIC BASED ON YOUR REQUIREMENTS
    let routeTo = "contact@foursix46.com"; 
    let departmentName = "General Inquiries";
    let senderAlias = `"FourSix46 Contact" <contact@foursix46.com>`;
    
    // Partnership / Investment -> partners@
    if (["Partnership Opportunity", "Partner", "Investment Inquiry", "Investor"].includes(inquiry_type)) {
      routeTo = "partners@foursix46.com"; 
      departmentName = "Strategic Partnerships";
      senderAlias = `"FourSix46 Partnerships" <partners@foursix46.com>`;
    } 
    // Media -> press@
    else if (["Media Inquiry", "Media"].includes(inquiry_type)) {
      routeTo = "press@foursix46.com";
      departmentName = "Media Relations";
      senderAlias = `"FourSix46 Press" <press@foursix46.com>`;
    } 
    // Careers -> careers@
    else if (["Career / Talent Inquiry", "Careers"].includes(inquiry_type)) {
      routeTo = "careers@foursix46.com";
      departmentName = "Talent & Careers";
      senderAlias = `"FourSix46 Careers" <careers@foursix46.com>`;
    }

    // 3. CONFIGURE SENDER (Authenticates via SMTP)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Operations identity for internal emails
    const opsIdentity = `"FourSix46 Operations" <operations@foursix46.com>`;

    // ==========================================
    // EMAIL 1: USER RECEIVES AFTER SUBMISSION
    // Sent FROM the specific department (careers@, press@, etc.)
    // ==========================================
    const userMailOptions = {
      from: senderAlias, 
      to: email,            // Sent TO the User
      replyTo: routeTo,     // Replies go back to the specific department
      subject: `We’ve Received Your Inquiry — FourSix46®`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <p>Dear ${full_name},</p>
          <p>Thank you for contacting FourSix46&reg;.</p>
          <p>We have successfully received your inquiry regarding:<br/>
          <strong>${inquiry_type}</strong></p>
          <p>Our strategic relations team will review your submission and respond within 24&ndash;48 hours where appropriate.</p>
          <p>If your request is time-sensitive, you may reach us directly at:<br/>
          <a href="mailto:contact@foursix46.com" style="color: #E31837; text-decoration: none;">contact@foursix46.com</a></p>

          <h3 style="margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 5px; color: #000;">Your Submission Summary</h3>
          <p style="margin: 0 0 5px 0;"><strong>Name:</strong> ${full_name}</p>
          <p style="margin: 0 0 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0 0 5px 0;"><strong>Company / Organisation:</strong> ${company_name}</p>
          <p style="margin: 0 0 15px 0;"><strong>Inquiry Type:</strong> ${inquiry_type}</p>
          <p style="margin: 0 0 5px 0;"><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-left: 3px solid #ddd; margin-top: 0;">${message}</p>

          <h3 style="margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 5px; color: #000;">About FourSix46&reg;</h3>
          <p>FourSix46 Global Ltd is a UK-based parent company building and scaling ventures across logistics, technology, media, and emerging industries.</p>

          <h3 style="margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 5px; color: #000;">Legal &amp; Compliance</h3>
          <p style="font-size: 11px; color: #666;">This email confirms receipt of your inquiry. Submission of this form does not constitute a contractual relationship, partnership agreement, or commitment of services.</p>
          <p style="font-size: 11px; color: #666;">Your information is processed in accordance with UK GDPR and our Privacy Policy. We retain and process submitted data solely for the purpose of responding to your inquiry and maintaining internal records.</p>
          
          <p style="font-size: 11px; color: #666; margin-top: 20px;">
            &copy; ${year} FourSix46 Global Ltd. All rights reserved.<br/>
            FourSix46&reg; is a registered trademark of FourSix46 Global Ltd.<br/><br/>
            <strong>Registered Office:</strong><br/>
            66 Paul Street, London, EC2A 4NA, United Kingdom<br/>
            <strong>Website:</strong> <a href="https://www.foursix46.com" style="color: #E31837; text-decoration: none;">https://www.foursix46.com</a>
          </p>
          
          <p style="font-size: 11px; color: #999; margin-top: 30px; font-style: italic;">If you did not submit this inquiry, please disregard this email.</p>
        </div>
      `,
    };

    // ==========================================
    // EMAIL 2: ADMIN RECEIVES
    // Sent FROM Operations TO the specific department
    // ==========================================
    const adminMailOptions = {
      from: opsIdentity, // Looks like Operations!
      to: routeTo,       // Sent TO the specific department alias (press@, partners@)
      replyTo: email,    // If admin hits reply, it goes to the user!
      subject: `New Inquiry Received — FourSix46® Contact Form`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <p>New inquiry submitted via FourSix46&reg; website.</p>

          <h3 style="margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 5px; color: #000;">Contact Details</h3>
          <p style="margin: 0 0 5px 0;"><strong>Name:</strong> ${full_name}</p>
          <p style="margin: 0 0 5px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #E31837;">${email}</a></p>
          <p style="margin: 0 0 5px 0;"><strong>Company / Organisation:</strong> ${company_name}</p>
          <p style="margin: 0 0 5px 0;"><strong>Inquiry Type:</strong> ${inquiry_type}</p>

          <h3 style="margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 5px; color: #000;">Message</h3>
          <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #E31837; margin-top: 0;">${message}</p>

          <h3 style="margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 5px; color: #000;">Submission Metadata</h3>
          <p><strong>Submitted At:</strong> ${timestamp}</p>
          <p><strong>Routed To:</strong> ${departmentName} (${routeTo})</p>

          <h3 style="margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 5px; color: #000;">Action Required</h3>
          <p style="color: #E31837; font-weight: bold;">Please review and respond within the defined SLA (24&ndash;48 hours).</p>

          <h3 style="margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 5px; color: #000;">System Notes</h3>
          <p style="font-size: 11px; color: #666;">This inquiry has been captured and stored in the system for internal tracking and compliance.</p>
          <p style="font-size: 11px; color: #666;">
            <strong>FourSix46 Global Ltd</strong><br/>
            Internal Notification System<br/>
            &copy; ${year} FourSix46 Global Ltd. All rights reserved.
          </p>
        </div>
      `,
    };

    // 4. EXECUTE BOTH EMAILS CONCURRENTLY
    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    return NextResponse.json({ message: 'Inquiry routed successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return NextResponse.json({ error: 'Failed to route inquiry.' }, { status: 500 });
  }
}