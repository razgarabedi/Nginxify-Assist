
import { Code, ShieldCheck, MonitorSmartphone, LifeBuoy, type LucideProps } from 'lucide-react';
import type React from 'react';

export interface Service {
  slug: string;
  category: 'club' | 'individual';
  icon: React.ReactElement<LucideProps>;
  titleDe: string;
  titleEn: string;
  descriptionDe: string;
  descriptionEn: string;
  detailedDescriptionDe: string; // New field for detailed explanation
  detailedDescriptionEn: string; // New field for detailed explanation
  imageUrl: string;
  imageHint: string;
}

export const allServices: Service[] = [
  // For Clubs & Organizations
  {
    slug: 'website-creation-basic',
    category: 'club',
    icon: <Code className="text-primary h-5 w-5 md:h-6 md:w-6" />, // Changed color to primary
    titleDe: 'Website-Erstellung (Basis)',
    titleEn: 'Website Creation (Basic)',
    descriptionDe: 'Hilfe bei der Einrichtung einfacher Webseiten zur Vorstellung Ihres Vereins.',
    descriptionEn: 'Help setting up simple websites to present your club.',
    detailedDescriptionDe: `
      Wir unterstützen Sie bei den ersten Schritten zur eigenen Vereins-Webseite. Dies umfasst:
      <ul>
        <li>Beratung bei der Auswahl des richtigen Systems (z.B. Website-Baukasten wie Wix/Jimdo oder Content-Management-System wie WordPress).</li>
        <li>Hilfe bei der grundlegenden Einrichtung und Konfiguration.</li>
        <li>Unterstützung beim Erstellen der grundlegenden Struktur (Startseite, Über Uns, Kontakt).</li>
        <li>Einführung in die Pflege von Inhalten.</li>
      </ul>
      <strong>Hinweis:</strong> Wir erstellen keine komplexen Designs oder programmieren individuelle Funktionen. Der Fokus liegt auf einer einfachen, funktionalen Präsenz.
    `,
    detailedDescriptionEn: `
      We support you in the first steps towards your own club website. This includes:
      <ul>
        <li>Advice on choosing the right system (e.g., website builders like Wix/Jimdo or content management systems like WordPress).</li>
        <li>Help with basic setup and configuration.</li>
        <li>Support in creating the basic structure (Homepage, About Us, Contact).</li>
        <li>Introduction to content maintenance.</li>
      </ul>
      <strong>Note:</strong> We do not create complex designs or program custom features. The focus is on a simple, functional presence.
    `,
    imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzEzMjR8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwZGVzaWdufGVufDB8fHx8MTcyMzcwMzM2N3ww&ixlib=rb-4.0.3&q=80&w=1080",
    imageHint: "website design",
  },
  {
    slug: 'online-tools-setup',
    category: 'club',
    icon: <MonitorSmartphone className="text-primary h-5 w-5 md:h-6 md:w-6" />, // Changed color to primary
    titleDe: 'Einrichtung von Online-Tools',
    titleEn: 'Setting up Online Tools',
    descriptionDe: 'Unterstützung bei Auswahl und Einrichtung von Tools für Kommunikation oder Organisation.',
    descriptionEn: 'Support in selecting and setting up tools for communication or organization.',
    detailedDescriptionDe: `
      Die digitale Zusammenarbeit kann herausfordernd sein. Wir helfen bei:
      <ul>
        <li>Beratung zu passenden Online-Werkzeugen für Ihre Bedürfnisse (z.B. für Videokonferenzen, gemeinsame Dokumentenablage, Projektmanagement, Mitgliederverwaltung).</li>
        <li>Unterstützung bei der grundlegenden Einrichtung eines ausgewählten Tools.</li>
        <li>Erklärung der Basisfunktionen und erster Schritte.</li>
      </ul>
      <strong>Hinweis:</strong> Wir bieten keine umfassenden Schulungen oder tiefgehende Integrationen in bestehende Systeme.
    `,
    detailedDescriptionEn: `
      Digital collaboration can be challenging. We help with:
      <ul>
        <li>Advice on suitable online tools for your needs (e.g., for video conferencing, shared document storage, project management, member management).</li>
        <li>Support with the basic setup of a selected tool.</li>
        <li>Explanation of basic functions and first steps.</li>
      </ul>
      <strong>Note:</strong> We do not offer comprehensive training or deep integrations into existing systems.
    `,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzEzMjR8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdG9vbHMlMjBjb2xsYWJvcmF0aW9ufGVufDB8fHx8MTcyMzcwMzQxMnww&ixlib=rb-4.0.3&q=80&w=1080", // Changed image
    imageHint: "digital tools collaboration dashboard", // Updated hint
  },
  {
    slug: 'it-security-consultation',
    category: 'club',
    icon: <ShieldCheck className="text-primary h-5 w-5 md:h-6 md:w-6" />, // Changed color to primary
    titleDe: 'IT-Sicherheitsberatung',
    titleEn: 'IT Security Consultation',
    descriptionDe: 'Grundlegende Tipps und Hinweise zur Verbesserung der IT-Sicherheit Ihrer Organisation.',
    descriptionEn: 'Basic tips and advice on improving the IT security of your organization.',
    detailedDescriptionDe: `
      IT-Sicherheit ist auch für Vereine wichtig. Wir bieten grundlegende Beratung zu Themen wie:
      <ul>
        <li>Sichere Passwörter und Passwort-Management.</li>
        <li>Grundlagen der Datensicherung (Backup).</li>
        <li>Erkennung von Phishing-E-Mails und anderen Bedrohungen.</li>
        <li>Wichtigkeit von Software-Updates.</li>
        <li>Tipps zum sicheren Umgang mit Mitgliederdaten (im Rahmen allgemeiner Hinweise, keine Rechtsberatung).</li>
      </ul>
      <strong>Hinweis:</strong> Wir führen keine Sicherheitsaudits durch und übernehmen keine Haftung. Es handelt sich um allgemeine Empfehlungen.
    `,
    detailedDescriptionEn: `
      IT security is also important for clubs. We offer basic advice on topics such as:
      <ul>
        <li>Secure passwords and password management.</li>
        <li>Basics of data backup.</li>
        <li>Recognizing phishing emails and other threats.</li>
        <li>Importance of software updates.</li>
        <li>Tips for securely handling member data (within the scope of general advice, not legal advice).</li>
      </ul>
      <strong>Note:</strong> We do not conduct security audits and assume no liability. These are general recommendations.
    `,
    imageUrl: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzEzMjR8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwbG9ja3xlbnwwfHx8fDE3MjM3MDM0NDV8MA&ixlib=rb-4.0.3&q=80&w=1080", // Changed image
    imageHint: "cybersecurity lock", // Updated hint
  },
  {
    slug: 'general-it-questions-club',
    category: 'club',
    icon: <LifeBuoy className="text-primary h-5 w-5 md:h-6 md:w-6" />, // Changed color to primary
    titleDe: 'Allgemeine IT-Fragen (Verein)',
    titleEn: 'General IT Questions (Club)',
    descriptionDe: 'Beratung und Hilfe bei allgemeinen technischen Fragen im Rahmen unserer Kapazitäten.',
    descriptionEn: 'Advice and help with general technical questions within our capacity.',
    detailedDescriptionDe: `
      Haben Sie allgemeine Fragen zur IT im Vereinskontext, die nicht in die anderen Kategorien passen? Zum Beispiel:
      <ul>
        <li>Fragen zur Auswahl von Hardware (z.B. Drucker, Laptop für den Vorstand).</li>
        <li>Verständnisfragen zu Cloud-Diensten.</li>
        <li>Einfache Probleme mit Standardsoftware (z.B. Office-Programme).</li>
      </ul>
      Wir versuchen, Ihnen im Rahmen unseres Wissens und unserer ehrenamtlichen Zeit weiterzuhelfen oder Sie an geeignete Ressourcen zu verweisen.
      <strong>Hinweis:</strong> Die Hilfe ist auf grundlegende Fragen beschränkt.
    `,
    detailedDescriptionEn: `
      Do you have general questions about IT in the club context that don't fit into the other categories? For example:
      <ul>
        <li>Questions about selecting hardware (e.g., printer, laptop for the board).</li>
        <li>Understanding questions about cloud services.</li>
        <li>Simple problems with standard software (e.g., Office programs).</li>
      </ul>
      We try to help you within the scope of our knowledge and volunteer time or refer you to appropriate resources.
      <strong>Note:</strong> Help is limited to basic questions.
    `,
    imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzEzMjR8MHwxfHNlYXJjaHwxfHxpdCUyMHN1cHBvcnQlMjBtZWV0aW5nfGVufDB8fHx8MTcyMzcwMzQ3NXww&ixlib=rb-4.0.3&q=80&w=1080",
    imageHint: "it support meeting",
  },
  // For Individuals
  {
    slug: 'computer-smartphone-help',
    category: 'individual',
    icon: <MonitorSmartphone className="text-primary h-5 w-5 md:h-6 md:w-6" />, // Changed color to primary
    titleDe: 'Computer- & Smartphone-Hilfe',
    titleEn: 'Computer & Smartphone Help',
    descriptionDe: 'Unterstützung bei einfachen Problemen mit PC, Laptop oder Smartphone.',
    descriptionEn: 'Support with simple problems on your PC, laptop, or smartphone.',
    detailedDescriptionDe: `
      Wir helfen Ihnen bei grundlegenden Problemen und Fragen zu Ihren Alltagsgeräten:
      <ul>
        <li>Einfache Einrichtungsfragen (z.B. WLAN verbinden, E-Mail-Konto hinzufügen).</li>
        <li>Verständnisfragen zur Bedienung von Standard-Apps oder Betriebssystemfunktionen.</li>
        <li>Hilfe bei der Installation einfacher Software oder Apps.</li>
        <li>Grundlegende Problemlösung (z.B. "Mein Drucker druckt nicht", "Ich kann keine E-Mails senden").</li>
      </ul>
      <strong>Hinweis:</strong> Wir führen keine Hardware-Reparaturen durch und können keine komplexen Softwareprobleme lösen. Bei schwerwiegenden Problemen empfehlen wir professionelle Hilfe.
    `,
    detailedDescriptionEn: `
      We help you with basic problems and questions about your everyday devices:
      <ul>
        <li>Simple setup questions (e.g., connecting to Wi-Fi, adding an email account).</li>
        <li>Understanding questions about operating standard apps or operating system functions.</li>
        <li>Help with installing simple software or apps.</li>
        <li>Basic troubleshooting (e.g., "My printer isn't printing," "I can't send emails").</li>
      </ul>
      <strong>Note:</strong> We do not perform hardware repairs and cannot solve complex software problems. For serious issues, we recommend professional help.
    `,
    imageUrl: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzEzMjR8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHNtYXJ0cGhvbmUlMjBoZWxwfGVufDB8fHx8MTcyMzcwMzUwMnww&ixlib=rb-4.0.3&q=80&w=1080", // Changed image
    imageHint: "computer smartphone help desk", // Updated hint
  },
  {
    slug: 'online-security-tips',
    category: 'individual',
    icon: <ShieldCheck className="text-primary h-5 w-5 md:h-6 md:w-6" />, // Changed color to primary
    titleDe: 'Online-Sicherheitstipps',
    titleEn: 'Online Security Tips',
    descriptionDe: 'Beratung zu sicherem Surfen, Passwörtern und Schutz vor Online-Bedrohungen.',
    descriptionEn: 'Advice on safe browsing, passwords, and protection against online threats.',
    detailedDescriptionDe: `
      Das Internet sicher zu nutzen ist wichtig. Wir geben Ihnen grundlegende Tipps zu:
      <ul>
        <li>Wie erkenne ich unsichere Webseiten?</li>
        <li>Was macht ein sicheres Passwort aus und wie verwalte ich Passwörter?</li>
        <li>Wie erkenne ich Phishing-Versuche per E-Mail oder auf Webseiten?</li>
        <li>Warum sind Updates für mein Betriebssystem und meine Apps wichtig?</li>
        <li>Grundlagen zum Schutz vor Viren und Malware.</li>
      </ul>
      <strong>Hinweis:</strong> Dies ist eine allgemeine Beratung und ersetzt keine professionelle Sicherheitsanalyse oder Virenentfernung.
    `,
    detailedDescriptionEn: `
      Using the internet safely is important. We provide basic tips on:
      <ul>
        <li>How do I recognize unsafe websites?</li>
        <li>What makes a strong password and how do I manage passwords?</li>
        <li>How do I recognize phishing attempts via email or on websites?</li>
        <li>Why are updates for my operating system and apps important?</li>
        <li>Basics of protecting against viruses and malware.</li>
      </ul>
      <strong>Note:</strong> This is general advice and does not replace professional security analysis or virus removal.
    `,
    imageUrl: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzEzMjR8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBzZWN1cml0eSUyMHBhc3N3b3JkfGVufDB8fHx8MTcyMzcwMzUzMHww&ixlib=rb-4.0.3&q=80&w=1080",
    imageHint: "online security password",
  },
  {
    slug: 'website-understanding',
    category: 'individual',
    icon: <Code className="text-primary h-5 w-5 md:h-6 md:w-6" />, // Changed color to primary
    titleDe: 'Webseiten-Verständnis',
    titleEn: 'Website Understanding',
    descriptionDe: 'Erklärung grundlegender Funktionen von Webseiten oder Online-Diensten.',
    descriptionEn: 'Explanation of basic functions of websites or online services.',
    detailedDescriptionDe: `
      Manchmal sind Online-Dienste oder Webseiten verwirrend. Wir helfen Ihnen zu verstehen:
      <ul>
        <li>Wie navigiere ich auf einer Webseite?</li>
        <li>Was bedeuten bestimmte Symbole oder Begriffe (z.B. Login, Warenkorb, Cookie-Banner)?</li>
        <li>Wie funktionieren grundlegende Abläufe (z.B. Online-Bestellung, Registrierung)?</li>
        <li>Unterschied zwischen Browser und Suchmaschine.</li>
      </ul>
      <strong>Hinweis:</strong> Wir können keine spezifischen Inhalte oder AGBs von Webseiten erklären. Der Fokus liegt auf der allgemeinen Bedienung.
    `,
    detailedDescriptionEn: `
      Sometimes online services or websites are confusing. We help you understand:
      <ul>
        <li>How do I navigate a website?</li>
        <li>What do certain symbols or terms mean (e.g., login, shopping cart, cookie banner)?</li>
        <li>How do basic processes work (e.g., online ordering, registration)?</li>
        <li>Difference between a browser and a search engine.</li>
      </ul>
      <strong>Note:</strong> We cannot explain specific content or terms and conditions of websites. The focus is on general operation.
    `,
    imageUrl: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzEzMjR8MHwxfHNlYXJjaHwxfHx1c2luZyUyMHdlYnNpdGUlMjBsYXB0b3B8ZW58MHx8fHwxNzIzNzAzNTUxfDA&ixlib=rb-4.0.3&q=80&w=1080",
    imageHint: "using website laptop",
  },
  {
    slug: 'general-tech-questions-individual',
    category: 'individual',
    icon: <LifeBuoy className="text-primary h-5 w-5 md:h-6 md:w-6" />, // Changed color to primary
    titleDe: 'Allgemeine Technikfragen (Privat)',
    titleEn: 'General Tech Questions (Individual)',
    descriptionDe: 'Hilfestellung bei einfachen technischen Fragen im Alltag.',
    descriptionEn: 'Assistance with simple technical questions in everyday life.',
    detailedDescriptionDe: `
      Haben Sie eine allgemeine technische Frage, die Sie sich schon immer gestellt haben? Zum Beispiel:
      <ul>
        <li>Wie funktioniert eigentlich Bluetooth?</li>
        <li>Was ist der Unterschied zwischen MB und GB?</li>
        <li>Wie mache ich einen Screenshot?</li>
        <li>Einfache Fragen zur Nutzung von Social Media oder Messenger-Diensten.</li>
      </ul>
      Wir versuchen, einfache technische Konzepte verständlich zu erklären oder Ihnen bei grundlegenden Bedienungsfragen zu helfen, soweit es unsere ehrenamtlichen Möglichkeiten zulassen.
    `,
    detailedDescriptionEn: `
      Do you have a general technical question you've always wondered about? For example:
      <ul>
        <li>How does Bluetooth actually work?</li>
        <li>What is the difference between MB and GB?</li>
        <li>How do I take a screenshot?</li>
        <li>Simple questions about using social media or messenger services.</li>
      </ul>
      We try to explain simple technical concepts understandably or help you with basic operational questions, as far as our volunteer possibilities allow.
    `,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzEzMjR8MHwxfHNlYXJjaHwxfHxxdWVzdGlvbiUyMGFib3V0JTIwdGVjaG5vbG9neXxlbnwwfHx8fDE3MjM3MDM1NzV8MA&ixlib=rb-4.0.3&q=80&w=1080", // Corrected URL
    imageHint: "question about technology computer", // Corrected hint
  },
];
