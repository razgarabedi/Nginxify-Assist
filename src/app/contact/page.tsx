
'use client';

import { useEffect, useState } from 'react'; // Combined imports
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
import { Mail, Info, Send } from 'lucide-react'; // Added Send icon
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from '@/context/language-context';
import { sendContactEmail } from '@/actions/send-contact-email'; // Import the server action

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
  const formSchema = getFormSchema(language);
  const [isSubmitting, setIsSubmitting] = useState(false); // State for submission status

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      technicalDetails: '',
    },
  });

  // Re-initialize form on language change to update validation messages
   useEffect(() => {
    // Reset form schema validation rules when language changes
    form.reset(form.getValues(), { keepValues: true }); // Keep entered values
    // We need a way to re-trigger validation based on the new schema rules
    // This could involve manually triggering validation or restructuring
  }, [language, form]); // Add form to dependencies

  // Handle form submission using the server action
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true); // Set submitting state
    try {
      // Re-validate before submitting, especially if language changed
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

      const result = await sendContactEmail(values);

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
        // Display the specific error message from the server action
        // Server action now returns a message like "English Message / German Message"
        const messages = result.message.split(' / ');
        const displayMessage = language === 'en' ? messages[0] : messages[1] || messages[0]; // Fallback to English if German is missing

        toast({
          title: language === 'en' ? 'Error Sending Message' : 'Fehler beim Senden',
          description: displayMessage || (language === 'en' // Fallback just in case message format is unexpected
            ? 'Could not send your message. Please try again later.'
            : 'Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.'),
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

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{language === 'en' ? 'Contact Us' : 'Kontaktieren Sie Uns'}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {language === 'en'
            ? 'Have a question or need IT support? Fill out the form or send us an email.'
            : 'Haben Sie eine Frage oder benötigen Sie IT-Unterstützung? Füllen Sie das Formular aus oder schreiben Sie uns eine E-Mail.'}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="space-y-6">
           <h2 className="text-2xl font-semibold">{language === 'en' ? 'Inquiry Form' : 'Anfrageformular'}</h2>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>{language === 'en' ? 'Important Information for Your Request' : 'Wichtige Informationen für Ihre Anfrage'}</AlertTitle>
              <AlertDescription>
                {language === 'en'
                  ? 'To help us assist you best, please describe your problem in as much detail as possible. For technical issues, please also provide information about your device (e.g., operating system, model) if relevant.'
                  : 'Um Ihnen bestmöglich helfen zu können, beschreiben Sie Ihr Problem bitte so detailliert wie möglich. Geben Sie bei technischen Problemen bitte auch Informationen zu Ihrem Gerät (z.B. Betriebssystem, Modell) an, falls relevant.'}
              </AlertDescription>
            </Alert>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'en' ? 'Name' : 'Name'}</FormLabel>
                      <FormControl>
                        <Input placeholder={language === 'en' ? 'Your Name' : 'Ihr Name'} {...field} />
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
                      <FormLabel>{language === 'en' ? 'Email' : 'E-Mail'}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={language === 'en' ? 'your@email.com' : 'ihre@email.de'} {...field} />
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
                    <FormLabel>{language === 'en' ? 'Subject' : 'Betreff'}</FormLabel>
                    <FormControl>
                      <Input placeholder={language === 'en' ? 'What is it about?' : 'Worum geht es?'} {...field} />
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
                    <FormLabel>{language === 'en' ? 'Your Message / Problem Description' : 'Ihre Nachricht / Problembeschreibung'}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={language === 'en' ? 'Describe your concern...' : 'Beschreiben Sie Ihr Anliegen...'}
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                        {language === 'en' ? 'The more detailed, the better we can help.' : 'Je detaillierter, desto besser können wir helfen.'}
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
                    <FormLabel>{language === 'en' ? 'Technical Details (Optional)' : 'Technische Details (Optional)'}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={language === 'en' ? 'e.g., Operating system, device model, software used...' : 'z.B. Betriebssystem, Gerätemodell, verwendete Software...'}
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                        {language === 'en' ? 'If relevant to your problem.' : 'Falls relevant für Ihr Problem.'}
                     </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {isSubmitting ? (
                   language === 'en' ? 'Sending...' : 'Sende...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> {/* Added icon */}
                    {language === 'en' ? 'Send Request' : 'Anfrage Senden'}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">{language === 'en' ? 'Direct Contact' : 'Direkter Kontakt'}</h2>
          <div className="flex items-start gap-4">
            <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">{language === 'en' ? 'Email' : 'E-Mail'}</h3>
              <p className="text-muted-foreground">
                {language === 'en'
                  ? 'You can also email us directly:'
                  : 'Sie können uns auch direkt eine E-Mail schreiben:'}
              </p>
              <a href="mailto:hilfe@nginxify.com" className="text-primary hover:underline break-all">
                hilfe@nginxify.com
              </a>
               <p className="text-sm text-muted-foreground mt-2">
                {language === 'en'
                  ? 'Please provide as many details as possible about your concern here as well.'
                  : 'Bitte geben Sie auch hier möglichst viele Details zu Ihrem Anliegen an.'}
               </p>
            </div>
          </div>
           {/* Optional: Add other contact methods like phone if applicable */}
        </div>
      </section>
    </div>
  );
}
