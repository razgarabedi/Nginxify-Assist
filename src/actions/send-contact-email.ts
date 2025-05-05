
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

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS; // Don't log this!

// Check for essential SMTP environment variables during server startup or first call
// This provides an early warning if the configuration is missing.
if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.warn(
        "WARNUNG: SMTP-Umgebungsvariablen (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) sind nicht vollständig konfiguriert. " +
        "Der E-Mail-Versand über das Kontaktformular wird wahrscheinlich fehlschlagen. " +
        "Bitte stellen Sie sicher, dass diese in Ihrer .env.local-Datei oder Umgebung korrekt gesetzt sind."
    );
    // Depending on requirements, you might want to throw an error here
    // if email functionality is absolutely critical and must be configured.
    // throw new Error("Kritische SMTP-Konfiguration fehlt in Umgebungsvariablen.");
} else {
    console.log("SMTP-Konfiguration in Umgebungsvariablen gefunden. Nodemailer-Transporter wird konfiguriert.");
}

// Configure the Nodemailer transporter using environment variables.
// It's crucial to set these variables in your deployment environment (e.g., .env.local).
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: parseInt(smtpPort || '587', 10), // Default to standard TLS port 587
  // Use `secure: true` if your SMTP provider uses port 465 (SSL)
  secure: parseInt(smtpPort || '587', 10) === 465,
  auth: {
    // It's highly recommended to use dedicated app passwords or API keys
    // rather than your primary email password.
    user: smtpUser,
    pass: smtpPass, // Use the password from env
  },
  // Optional: Add debugging for Nodemailer connection issues
  // logger: true,
  // debug: true, // Set to true for very detailed SMTP logs
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
    if (!smtpHost || !smtpUser || !smtpPass || !smtpPort) {
        console.error("E-Mail-Versand aufgrund unvollständiger SMTP-Konfiguration fehlgeschlagen. Überprüfen Sie die Umgebungsvariablen.");
        // Do not expose internal configuration details to the client
        return { success: false, message: 'Fehler bei der Serverkonfiguration. E-Mail konnte nicht gesendet werden.' };
    }

    const mailOptions = {
      from: `"Nginxify Assist Kontakt" <${smtpUser}>`, // Sender address (must be authenticated user)
      replyTo: validatedData.email, // Set reply-to to the submitter's email
      to: 'hilfe@nginxify.com', // Recipient address - CONFIRMED
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

    console.log(`Versuche E-Mail zu senden an ${mailOptions.to} von ${mailOptions.from}...`);
    console.log(`Verwende SMTP Host: ${smtpHost}, Port: ${smtpPort}, Secure: ${parseInt(smtpPort || '587', 10) === 465}`); // Log config being used

    const info = await transporter.sendMail(mailOptions);

    console.log('Kontakt-E-Mail erfolgreich gesendet! Nachrichten-ID:', info.messageId);
    return { success: true, message: 'E-Mail erfolgreich gesendet!' }; // Success message for client

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Formularvalidierung fehlgeschlagen:', error.errors);
      // Provide a generic validation error message
      return { success: false, message: 'Ungültige Formulardaten. Bitte überprüfen Sie Ihre Eingaben.' };
    }

    // Log the detailed error to the server console for debugging
    console.error('Fehler beim Senden der Kontakt-E-Mail. Fehlerdetails:', error);

    let clientErrorMessage = 'E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.';

    // Check if it's a Nodemailer specific error for more context (optional, but can be helpful for server logs)
    if (error && typeof error === 'object') {
      const code = (error as any).code;
      const command = (error as any).command;
      const response = (error as any).response; // SMTP server response
      console.error(`Nodemailer Fehler Code: ${code}, Befehl: ${command}, Antwort: ${response}`);

      // Optionally customize the client message based on common codes, but keep it general
      // Example: if (code === 'EAUTH') clientErrorMessage = 'Authentifizierung fehlgeschlagen. Bitte überprüfen Sie die SMTP-Zugangsdaten.';
      // Example: if (code === 'ECONNREFUSED') clientErrorMessage = 'Verbindung zum E-Mail-Server fehlgeschlagen. Bitte überprüfen Sie Host/Port.';
    }

    // Provide a generic error message to the client for security
    // IMPORTANT: The message "Failed to send Email." comes from this return statement.
    return { success: false, message: 'Failed to send Email.' }; // Keeping the original generic error message as requested by user observation
  }
}
