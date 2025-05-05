
'use server';

/**
 * @fileOverview Server action for sending contact form submissions via email.
 */

import nodemailer from 'nodemailer';
import { z } from 'zod';

// Schema matching the form
const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  subject: z.string().min(5, 'Subject must be at least 5 characters.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
  technicalDetails: z.string().optional(),
});
type ContactFormData = z.infer<typeof ContactFormSchema>;

// Check for essential SMTP environment variables during server startup or first call
// This provides an early warning if the configuration is missing.
if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(
        "WARNING: SMTP environment variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) are not fully configured. " +
        "Email sending via the contact form will likely fail. " +
        "Please ensure these are correctly set in your .env.local file or environment."
    );
    // Depending on requirements, you might want to throw an error here
    // if email functionality is absolutely critical and must be configured.
    // throw new Error("Critical SMTP configuration missing in environment variables.");
} else {
    console.log("SMTP configuration found in environment variables. Nodemailer transporter will be configured.");
}

// Configure the Nodemailer transporter using environment variables.
// It's crucial to set these variables in your deployment environment (e.g., .env.local).
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10), // Default to standard TLS port 587
  // Use `secure: true` if your SMTP provider uses port 465 (SSL)
  secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
  auth: {
    // It's highly recommended to use dedicated app passwords or API keys
    // rather than your primary email password.
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Optional: Add debugging for Nodemailer connection issues
  // logger: true,
  // debug: true,
});

/**
 * Sends the contact form data as an email.
 *
 * @param data The validated contact form data.
 * @returns A promise that resolves to an object indicating success or failure.
 */
export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  try {
    // Validate the input data against the schema
    const validatedData = ContactFormSchema.parse(data);

    // Runtime check for essential configuration before attempting to send
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_PORT) {
        console.error("Failed to send email due to incomplete SMTP configuration. Check environment variables.");
        throw new Error("SMTP configuration is incomplete. Cannot send email.");
    }

    const mailOptions = {
      from: `"Nginxify Assist Kontakt" <${process.env.SMTP_USER}>`, // Sender address (must be authenticated user)
      replyTo: validatedData.email, // Set reply-to to the submitter's email
      to: 'hilfe@nginxify.com', // Recipient address
      subject: `Neue Kontaktanfrage: ${validatedData.subject}`,
      text: `
        Neue Nachricht über das Kontaktformular erhalten:

        Name: ${validatedData.name}
        E-Mail: ${validatedData.email}
        Betreff: ${validatedData.subject}

        Nachricht:
        ${validatedData.message}

        ${validatedData.technicalDetails ? `Technische Details:\n${validatedData.technicalDetails}` : ''}
      `,
      html: `
        <h2>Neue Nachricht über das Kontaktformular</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>E-Mail:</strong> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
        <p><strong>Betreff:</strong> ${validatedData.subject}</p>
        <hr>
        <h3>Nachricht:</h3>
        <p style="white-space: pre-wrap;">${validatedData.message}</p>
        ${validatedData.technicalDetails ? `
          <hr>
          <h3>Technische Details:</h3>
          <p style="white-space: pre-wrap;">${validatedData.technicalDetails}</p>
        ` : ''}
      `,
    };

    console.log(`Attempting to send email to ${mailOptions.to} from ${mailOptions.from}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log('Contact email sent successfully! Message ID:', info.messageId);
    return { success: true, message: 'Email sent successfully!' };

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Form validation failed:', error.errors);
      return { success: false, message: 'Invalid form data.' };
    }

    // Log more specific Nodemailer/SMTP errors to the server console
    console.error('Failed to send contact email. Error details:', error);
    let errorMessage = 'Failed to send email. Please try again later or contact us directly.';

    // Check if it's a Nodemailer specific error for more context (optional, but can be helpful)
    if (error && typeof error === 'object') {
      // Nodemailer errors often have 'code', 'command', 'response' properties
      const code = (error as any).code;
      const command = (error as any).command;
      console.error(`Nodemailer Error Code: ${code}, Command: ${command}`);
      // You could potentially customize the client message based on the code, but keep it general
      // e.g., if (code === 'EAUTH') errorMessage = 'Authentication failed. Please check SMTP credentials.';
    }


    // Provide a generic error message to the client for security
    return { success: false, message: errorMessage };
  }
}
