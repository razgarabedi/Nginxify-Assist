
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

// --- Configuration ---
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS; // DO NOT LOG THIS PASSWORD

// --- Configuration Check ---
// Logs a warning on the server if essential SMTP variables are missing.
if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.warn(
        "\n\n" +
        "**************************************************************************************\n" +
        "** WARNUNG: SMTP-UMGEBUNGSVARIABLEN UNVOLLSTÄNDIG!                                **\n" +
        "**------------------------------------------------------------------------------------**\n" +
        "** Mindestens eine der Variablen SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS ist       **\n" +
        "** nicht in Ihrer .env.local-Datei oder Umgebungsvariablen gesetzt.                 **\n" +
        "**                                                                                    **\n" +
        "** Der E-Mail-Versand über das Kontaktformular wird wahrscheinlich fehlschlagen.       **\n" +
        "**                                                                                    **\n" +
        "** -> Überprüfen Sie Ihre `.env.local`-Datei im Projektstammverzeichnis.             **\n" +
        "** -> Stellen Sie sicher, dass alle vier Variablen korrekt eingetragen sind.         **\n" +
        "**************************************************************************************\n\n"
    );
} else {
    console.log("SERVER-INFO: SMTP-Konfigurationsvariablen (HOST, PORT, USER, PASS) in Umgebung gefunden. Nodemailer wird konfiguriert.");
}

// Configure the Nodemailer transporter using environment variables.
const transporterOptions: SMTPTransport.Options = {
  host: smtpHost,
  port: parseInt(smtpPort || '587', 10), // Default to standard TLS port 587
  // `secure: true` für Port 465 (SSL), `secure: false` (mit STARTTLS) für Port 587.
  secure: parseInt(smtpPort || '587', 10) === 465,
  auth: {
    // Es wird dringend empfohlen, App-Passwörter oder API-Schlüssel anstelle
    // Ihres primären E-Mail-Passworts zu verwenden.
    user: smtpUser,
    pass: smtpPass, // Passwort aus der Umgebungsvariable
  },
  // --- DEBUGGING OPTIONEN (AUSKOMMENTIEREN ZUM AKTIVIEREN) ---
  // logger: true, // Loggt allgemeine Nodemailer-Aktivitäten
  // debug: true,  // Aktiviert sehr detaillierte SMTP-Kommunikationslogs
  // --- ENDE DEBUGGING OPTIONEN ---
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
  if (!smtpHost || !smtpUser || !smtpPass || !smtpPort) {
      console.error("SERVER-FEHLER: E-Mail-Versand FEHLGESCHLAGEN. SMTP-Konfiguration unvollständig. Überprüfen Sie .env.local (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).");
      // Do not expose internal configuration details to the client
      return { success: false, message: 'Server configuration error. Could not send email. / Fehler bei der Serverkonfiguration. E-Mail konnte nicht gesendet werden.' };
  }

  try {
    // Validate the input data against the schema
    const validatedData = ContactFormSchema.parse(data);


    const mailOptions = {
      from: `"Nginxify Assist Kontakt" <${smtpUser}>`, // Sender address (must be authenticated user)
      replyTo: validatedData.email, // Set reply-to to the submitter's email
      to: 'hilfe@nginxify.com', // <<<<< EMPFÄNGERADRESSE BESTÄTIGT >>>>>
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

    console.log(`SERVER-INFO: Versuche E-Mail zu senden AN: ${mailOptions.to} VON: ${mailOptions.from} (Reply-To: ${mailOptions.replyTo})`);
    console.log(`SERVER-INFO: Verwende SMTP Host: ${smtpHost}, Port: ${smtpPort}, Secure: ${transporterOptions.secure}, User: ${smtpUser}`); // Log config being used

    // --- SMTP VERBINDUNGSTEST (AUSKOMMENTIEREN ZUM TESTEN) ---
    // Dieser Block testet die Verbindung zum SMTP-Server und die Authentifizierung,
    // *bevor* versucht wird, die eigentliche E-Mail zu senden. Nützlich zur Fehlersuche!
    /*
    try {
        await transporter.verify();
        console.log("SERVER-INFO: SMTP-Verbindung erfolgreich verifiziert. Konfiguration scheint korrekt.");
    } catch (verifyError) {
        console.error("--------------------------------------------------------------------------");
        console.error("SERVER-FEHLER: SMTP-Verifizierung FEHLGESCHLAGEN!");
        console.error("GRUND:", verifyError); // Loggt den spezifischen Fehler
        console.error("MÖGLICHE URSACHEN:");
        console.error("  - Falsche SMTP_HOST oder SMTP_PORT in .env.local?");
        console.error("  - Falsche SMTP_USER oder SMTP_PASS in .env.local?");
        console.error("  - Falsche SSL/TLS-Einstellung (secure: true/false basierend auf Port)?");
        console.error("  - Firewall blockiert ausgehende Verbindung zum SMTP-Server?");
        console.error("  - E-Mail-Anbieter erfordert App-Passwort oder spezielle Sicherheitseinstellungen?");
        console.error("--------------------------------------------------------------------------");
        // Spezifische Client-Nachricht für Verifizierungsfehler
        return { success: false, message: 'Connection/Authentication test with email server failed. Check server logs for details. / Verbindungs-/Authentifizierungstest zum E-Mail-Server fehlgeschlagen. Server-Logs prüfen.' };
    }
    */
    // --- ENDE SMTP VERBINDUNGSTEST ---


    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log('SERVER-INFO: Kontakt-E-Mail erfolgreich gesendet! Nachrichten-ID:', info.messageId);
    return { success: true, message: 'Email sent successfully! / E-Mail erfolgreich gesendet!' }; // Success message for client

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('SERVER-FEHLER: Formularvalidierung fehlgeschlagen:', error.errors);
      // Provide a generic validation error message
      return { success: false, message: 'Invalid form data. Please check your input. / Ungültige Formulardaten. Bitte überprüfen Sie Ihre Eingaben.' };
    }

    // --- DETAILLIERTE FEHLERLOGGUNG AUF DEM SERVER ---
    // Der folgende Block loggt detaillierte Informationen zum Fehler auf der Serverkonsole.
    // DIES IST ENTSCHEIDEND FÜR DIE FEHLERSUCHE bei "Failed to send Email".
    console.error("\n\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.error("!! SERVER-FEHLER: FEHLER BEIM SENDEN DER KONTAKT-E-MAIL                   !!");
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.error("** FEHLERDETAILS:                                                       **");
    console.error(error); // Loggt das gesamte Fehlerobjekt
    console.error("**----------------------------------------------------------------------**");

    let clientErrorMessage = 'Failed to send Email.'; // Default generic message (English)
    let clientErrorMessageDe = 'Fehler beim Senden der E-Mail.'; // Default generic message (German)

    // Check if it's a Nodemailer specific error for more context on the SERVER log
    if (error && typeof error === 'object' && 'code' in error) {
      const code = (error as any).code; // e.g., 'EAUTH', 'ECONNREFUSED'
      const command = (error as any).command; // e.g., 'AUTH', 'CONN'
      const response = (error as any).response; // SMTP server response text
      const responseCode = (error as any).responseCode; // SMTP response code (e.g., 535)

      console.error("** NODEMAILER FEHLER-INFO:                                              **");
      console.error(`**   Code: ${code} | Befehl: ${command} | SMTP-Code: ${responseCode}`);
      console.error(`**   SMTP-Antwort: ${response}`);
      console.error("**                                                                      **");
      console.error("** MÖGLICHE URSACHEN (siehe auch verify() Test oben):                   **");
      if (code === 'EAUTH') {
           console.error("**   -> Authentifizierung fehlgeschlagen (falscher SMTP_USER/SMTP_PASS?) **");
           console.error("**   -> Benötigt der Provider ein App-Passwort?                        **");
           clientErrorMessage = 'Authentication with the email server failed.';
           clientErrorMessageDe = 'Authentifizierung beim E-Mail-Server fehlgeschlagen.';
      } else if (code === 'ECONNREFUSED' || code === 'ETIMEDOUT' || code === 'ENOTFOUND' || code === 'ECONNECTION') {
          console.error("**   -> Verbindung zum SMTP-Server fehlgeschlagen (falscher HOST/PORT?) **");
          console.error("**   -> Firewall blockiert die Verbindung?                            **");
          clientErrorMessage = 'Connection to the email server failed.';
          clientErrorMessageDe = 'Verbindung zum E-Mail-Server fehlgeschlagen.';
      } else {
          console.error("**   -> Anderer Nodemailer-Fehler - Details siehe oben.               **");
      }
       console.error("**   -> ÜBERPRÜFEN SIE DIE .env.local DATEI UND SERVER-LOGS!            **");

    } else {
        console.error('**   Ein unerwarteter Fehler ist aufgetreten (kein spezifischer Code). **');
        console.error("**   -> ÜBERPRÜFEN SIE DIE SERVER-LOGS FÜR MEHR DETAILS!                **");
    }
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n");


    // Provide a generic error message to the client for security.
    // The detailed error is only in the server logs.
    // The message includes both English and German. The frontend should pick the correct one.
    return { success: false, message: `${clientErrorMessage} / ${clientErrorMessageDe}` };
  }
}
