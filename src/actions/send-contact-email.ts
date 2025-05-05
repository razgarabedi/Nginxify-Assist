
'use server';

/**
 * @fileOverview Server action for sending contact form submissions via email.
 */

import nodemailer from 'nodemailer';
import type { SMTPTransport } from 'nodemailer/lib/smtp-transport'; // Import specific type
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
if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.warn(
        "WARNUNG: SMTP-Umgebungsvariablen (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) sind nicht vollständig konfiguriert. " +
        "Der E-Mail-Versand über das Kontaktformular wird wahrscheinlich fehlschlagen. " +
        "Bitte stellen Sie sicher, dass diese in Ihrer .env.local-Datei oder Umgebung korrekt gesetzt sind."
    );
} else {
    console.log("SERVER-INFO: SMTP-Konfiguration in Umgebungsvariablen gefunden. Nodemailer-Transporter wird konfiguriert.");
}

// Configure the Nodemailer transporter using environment variables.
const transporterOptions: SMTPTransport.Options = {
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
  // Optional: Add debugging for Nodemailer connection issues (Uncomment for detailed logs)
  // logger: true,
  // debug: true, // Set to true for very detailed SMTP logs
};

const transporter = nodemailer.createTransport(transporterOptions);

/**
 * Sends the contact form data as an email.
 *
 * @param data The validated contact form data.
 * @returns A promise that resolves to an object indicating success or failure, with a user-friendly message.
 */
export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  // Runtime check for essential configuration before attempting to send
  // Moved outside the try block to fail fast if config is missing
  if (!smtpHost || !smtpUser || !smtpPass || !smtpPort) {
      console.error("SERVER-FEHLER: E-Mail-Versand aufgrund unvollständiger SMTP-Konfiguration fehlgeschlagen. Überprüfen Sie die Umgebungsvariablen (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).");
      // Do not expose internal configuration details to the client
      return { success: false, message: 'Server configuration error. Could not send email. / Fehler bei der Serverkonfiguration. E-Mail konnte nicht gesendet werden.' };
  }

  try {
    // Validate the input data against the schema
    const validatedData = ContactFormSchema.parse(data);


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

    console.log(`SERVER-INFO: Versuche E-Mail zu senden an ${mailOptions.to} von ${mailOptions.from}...`);
    console.log(`SERVER-INFO: Verwende SMTP Host: ${smtpHost}, Port: ${smtpPort}, Secure: ${transporterOptions.secure}`); // Log config being used

    // --- DEBUGGING TIP ---
    // Uncomment the following block to verify the SMTP connection details
    // *before* attempting to send the email. This helps isolate connection/auth issues.
    /*
    try {
        await transporter.verify();
        console.log("SERVER-INFO: SMTP-Verbindung erfolgreich verifiziert. Konfiguration scheint korrekt.");
    } catch (verifyError) {
        console.error("SERVER-FEHLER: SMTP-Verbindung konnte nicht verifiziert werden. Überprüfen Sie Host, Port, SSL/TLS-Einstellungen und Zugangsdaten.", verifyError);
        // Provide a specific client message for verification failure
        return { success: false, message: 'Connection to email server failed during verification. / Fehler bei der Verbindung zum E-Mail-Server während der Überprüfung.' };
    }
    */
    // --- END DEBUGGING TIP ---


    const info = await transporter.sendMail(mailOptions);

    console.log('SERVER-INFO: Kontakt-E-Mail erfolgreich gesendet! Nachrichten-ID:', info.messageId);
    return { success: true, message: 'Email sent successfully! / E-Mail erfolgreich gesendet!' }; // Success message for client

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('SERVER-FEHLER: Formularvalidierung fehlgeschlagen:', error.errors);
      // Provide a generic validation error message
      return { success: false, message: 'Invalid form data. Please check your input. / Ungültige Formulardaten. Bitte überprüfen Sie Ihre Eingaben.' };
    }

    // Log the detailed error to the server console for debugging
    console.error('SERVER-FEHLER: Fehler beim Senden der Kontakt-E-Mail. Fehlerdetails:', error);

    let clientErrorMessage = 'Failed to send Email.'; // Default generic message (English)
    let clientErrorMessageDe = 'Fehler beim Senden der E-Mail.'; // Default generic message (German)

    // Check if it's a Nodemailer specific error for more context on the SERVER log
    if (error && typeof error === 'object' && 'code' in error) {
      const code = (error as any).code;
      const command = (error as any).command; // e.g., 'AUTH', 'CONN'
      const response = (error as any).response; // SMTP server response text
      const responseCode = (error as any).responseCode; // SMTP response code (e.g., 535)

      console.error(`SERVER-FEHLER: Nodemailer Fehler Code: ${code}, Befehl: ${command}, SMTP-Antwort-Code: ${responseCode}, SMTP-Antwort: ${response}`);

       // Customize client message slightly based on common *general* categories, still avoiding specifics
      if (code === 'EAUTH') {
           clientErrorMessage = 'Authentication with the email server failed.';
           clientErrorMessageDe = 'Authentifizierung beim E-Mail-Server fehlgeschlagen.';
      } else if (code === 'ECONNREFUSED' || code === 'ETIMEDOUT' || code === 'ENOTFOUND' || code === 'ECONNECTION') {
          clientErrorMessage = 'Connection to the email server failed.';
          clientErrorMessageDe = 'Verbindung zum E-Mail-Server fehlgeschlagen.';
      }
      // Potential future mappings:
      // else if (code === 'EENVELOPE') { // Problem with sender/recipient addresses
      //    clientErrorMessage = 'Problem with email addresses (sender or recipient).';
      //    clientErrorMessageDe = 'Problem mit E-Mail-Adressen (Absender oder Empfänger).';
      // }
      // else if (code === 'EMESSAGE') { // Problem with the message format/size
      //     clientErrorMessage = 'There was a problem formatting the email message.';
      //     clientErrorMessageDe = 'Problem beim Formatieren der E-Mail-Nachricht.';
      // }
    } else {
        console.error('SERVER-FEHLER: Ein unerwarteter Fehler ist beim E-Mail-Versand aufgetreten (kein spezifischer Nodemailer-Code).');
    }

    // Provide a (potentially more specific) generic error message to the client for security
    // The message includes both English and German. The frontend should ideally pick the correct one based on context.
    return { success: false, message: `${clientErrorMessage} / ${clientErrorMessageDe}` };
  }
}
