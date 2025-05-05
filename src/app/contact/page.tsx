
'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Info, Send, Loader2, Phone } from 'lucide-react'; // Added Loader2, Phone
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from '@/context/language-context';
import { sendContactEmail } from '@/actions/send-contact-email';
import React from 'react'; // Import React

// Define Zod schema for form validation (with dynamic messages)
const getFormSchema = (language: 'de' | 'en') => z.object({
  name: z.string().min(2, {
    message: language === 'en' ? 'Name must be at least 2 characters long.' : 'Name muss mindestens 2 Zeichen lang sein.',
  }),
  email: z.string().email({
    message: language === 'en' ? 'Please enter a valid email address.' : 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
  }),
  subject: z.string().min(5, {
    message: language === 'en' ? 'Subject must be at least 5 characters long.' : 'Betreff muss mindestens 5 Zeichen lang sein.',
  }),
  message: z.string().min(10, {
    message: language === 'en' ? 'Message must be at least 10 characters long.' : 'Nachricht muss mindestens 10 Zeichen lang sein.',
  }),
  technicalDetails: z.string().optional(), // Optional field for technical details
});

export default function ContactPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [formSchema, setFormSchema] = useState(() => getFormSchema(language)); // Use state for dynamic schema
  const [isSubmitting, setIsSubmitting] = useState(false); // State for submission status

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Use the state-managed schema
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      technicalDetails: '',
    },
    mode: 'onBlur', // Validate on blur
  });

   // Re-initialize form on language change to update validation messages
   React.useEffect(() => {
    const newSchema = getFormSchema(language);
    setFormSchema(newSchema);
    // Reset form validation state and apply new resolver
    // Use 'any' temporarily if needed to update _resolver
    (form as any)._resolver = zodResolver(newSchema);
    // Re-validate fields based on the new language rules if they have been touched
    Object.keys(form.formState.touchedFields).forEach(fieldName => {
        form.trigger(fieldName as keyof z.infer<typeof formSchema>);
    });
   }, [language, form]);


  // Handle form submission using the server action
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true); // Set submitting state
    try {
      // Re-validate explicitly before submitting to catch any missed blur events
      const isValid = await form.trigger();
      if (!isValid) {
          toast({
            title: language === 'en' ? 'Validation Error' : 'Validierungsfehler',
            description: language === 'en' ? 'Please correct the errors in the form.' : 'Bitte korrigieren Sie die Fehler im Formular.',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
      }

      console.log("CLIENT-INFO: Sending data to server action:", values); // Log data being sent
      const result = await sendContactEmail(values);
      console.log("CLIENT-INFO: Received result from server action:", result); // Log result

      if (result.success) {
        toast({
          title: language === 'en' ? 'Message Sent!' : 'Nachricht gesendet!',
          description: language === 'en'
            ? 'Thank you for your inquiry. We will get back to you soon.'
            : 'Vielen Dank für Ihre Anfrage. Wir werden uns bald bei Ihnen melden.',
          variant: 'default', // Use 'success' if you add a success variant
        });
        form.reset(); // Reset form on success
      } else {
        // Display the specific *generic* error message from the server action
        const messages = result.message.split(' / ');
        const displayMessage = language === 'en' ? messages[0] : (messages[1] || messages[0]); // Fallback to English if German is missing

        toast({
          title: language === 'en' ? 'Error Sending Message' : 'Fehler beim Senden',
          description: displayMessage || (language === 'en'
            ? 'Could not send your message. Please try again later or check server logs.' // Added hint
            : 'Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut oder prüfen Sie die Server-Logs.'), // Added hint
          variant: 'destructive',
        });
        // Log the full server message to console for debugging if needed
        console.error("Server Action Error:", result.message);
      }
    } catch (error) {
      // Catch unexpected errors during the action call itself
      console.error("Unexpected error during form submission:", error);
      toast({
        title: language === 'en' ? 'Unexpected Error' : 'Unerwarteter Fehler',
        description: language === 'en'
          ? 'An unexpected error occurred. Please try again.'
          : 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  }

  const translations = {
    pageTitle: language === 'en' ? 'Contact Us' : 'Kontaktieren Sie Uns',
    pageDescription: language === 'en'
      ? 'Have a question or need IT support? Fill out the form or send us an email.'
      : 'Haben Sie eine Frage oder benötigen Sie IT-Unterstützung? Füllen Sie das Formular aus oder schreiben Sie uns eine E-Mail.',
    formTitle: language === 'en' ? 'Inquiry Form' : 'Anfrageformular',
    alertTitle: language === 'en' ? 'Important Information for Your Request' : 'Wichtige Informationen für Ihre Anfrage',
    alertDescription: language === 'en'
      ? 'To help us assist you best, please describe your problem in as much detail as possible. For technical issues, please also provide information about your device (e.g., operating system, model) if relevant.'
      : 'Um Ihnen bestmöglich helfen zu können, beschreiben Sie Ihr Problem bitte so detailliert wie möglich. Geben Sie bei technischen Problemen bitte auch Informationen zu Ihrem Gerät (z.B. Betriebssystem, Modell) an, falls relevant.',
    nameLabel: language === 'en' ? 'Name' : 'Name',
    namePlaceholder: language === 'en' ? 'Your Name' : 'Ihr Name',
    emailLabel: language === 'en' ? 'Email' : 'E-Mail',
    emailPlaceholder: language === 'en' ? 'your@email.com' : 'ihre@email.de',
    subjectLabel: language === 'en' ? 'Subject' : 'Betreff',
    subjectPlaceholder: language === 'en' ? 'What is it about?' : 'Worum geht es?',
    messageLabel: language === 'en' ? 'Your Message / Problem Description' : 'Ihre Nachricht / Problembeschreibung',
    messagePlaceholder: language === 'en' ? 'Describe your concern...' : 'Beschreiben Sie Ihr Anliegen...',
    messageDescription: language === 'en' ? 'The more detailed, the better we can help.' : 'Je detaillierter, desto besser können wir helfen.',
    techDetailsLabel: language === 'en' ? 'Technical Details (Optional)' : 'Technische Details (Optional)',
    techDetailsPlaceholder: language === 'en' ? 'e.g., Operating system, device model, software used...' : 'z.B. Betriebssystem, Gerätemodell, verwendete Software...',
    techDetailsDescription: language === 'en' ? 'If relevant to your problem.' : 'Falls relevant für Ihr Problem.',
    submitButton: language === 'en' ? 'Send Request' : 'Anfrage Senden',
    submittingButton: language === 'en' ? 'Sending...' : 'Sende...',
    directContactTitle: language === 'en' ? 'Direct Contact' : 'Direkter Kontakt',
    emailInfoTitle: language === 'en' ? 'Email' : 'E-Mail',
    emailInfoText: language === 'en' ? 'You can also email us directly:' : 'Sie können uns auch direkt eine E-Mail schreiben:',
    emailInfoHint: language === 'en'
      ? 'Please provide as many details as possible about your concern here as well.'
      : 'Bitte geben Sie auch hier möglichst viele Details zu Ihrem Anliegen an.',
    phoneInfoTitle: language === 'en' ? 'Phone' : 'Telefon', // Added Phone
    phoneInfoText: language === 'en' ? 'Reach us during business hours:' : 'Erreichen Sie uns während der Geschäftszeiten:', // Added Phone
    phoneInfoNumber: '+49 123 456789', // Added Example Phone number
  };

  return (
    <div className="space-y-10 md:space-y-12 lg:space-y-16"> {/* Increased spacing */}
      <section className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">{translations.pageTitle}</h1> {/* Responsive font size */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto"> {/* Responsive font size & max-width */}
          {translations.pageDescription}
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 px-4 xl:px-0"> {/* Adjusted padding and gap */}
        {/* Contact Form */}
        <div className="space-y-6 order-2 lg:order-1">
           <h2 className="text-2xl font-semibold">{translations.formTitle}</h2>
            <Alert>
              <Info className="h-4 w-4 mt-1 flex-shrink-0" /> {/* Ensure icon doesn't shrink */}
              <AlertTitle>{translations.alertTitle}</AlertTitle>
              <AlertDescription>
                {translations.alertDescription}
              </AlertDescription>
            </Alert>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Use grid for name/email on medium screens and up */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"> {/* Adjusted gap */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.nameLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder={translations.namePlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.emailLabel}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={translations.emailPlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.subjectLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={translations.subjectPlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.messageLabel}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={translations.messagePlaceholder}
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                        {translations.messageDescription}
                     </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="technicalDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.techDetailsLabel}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={translations.techDetailsPlaceholder}
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                        {translations.techDetailsDescription}
                     </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-primary hover:bg-primary/90"> {/* Use primary color */}
                {isSubmitting ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     {translations.submittingButton}
                   </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {translations.submitButton}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6 order-1 lg:order-2">
          <h2 className="text-2xl font-semibold">{translations.directContactTitle}</h2>
          <div className="flex items-start gap-4 p-4 border rounded-lg bg-card"> {/* Added card style */}
            <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">{translations.emailInfoTitle}</h3>
              <p className="text-muted-foreground text-sm"> {/* Adjusted size */}
                {translations.emailInfoText}
              </p>
              <a href="mailto:hilfe@nginxify.com" className="text-primary hover:underline break-all font-medium">
                hilfe@nginxify.com
              </a>
               <p className="text-xs text-muted-foreground mt-2"> {/* Adjusted size */}
                {translations.emailInfoHint}
               </p>
            </div>
          </div>
           {/* Optional: Add other contact methods like phone if applicable */}
           {/* Example: */}
           <div className="flex items-start gap-4 p-4 border rounded-lg bg-card">
             <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
             <div>
               <h3 className="font-medium">{translations.phoneInfoTitle}</h3>
               <p className="text-muted-foreground text-sm"> {translations.phoneInfoText}</p>
               <a href={`tel:${translations.phoneInfoNumber.replace(/\s/g, '')}`} className="text-primary hover:underline font-medium"> {translations.phoneInfoNumber}</a>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
