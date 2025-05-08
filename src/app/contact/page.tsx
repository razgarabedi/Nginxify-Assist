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
import { Mail, Info, Send, Loader2, Phone } from 'lucide-react'; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from '@/context/language-context';
import { sendContactEmail } from '@/actions/send-contact-email';
import React from 'react'; 
import { getContent } from '@/actions/content-actions';
import type { ContactContentData } from '@/lib/content-types';
import { Skeleton } from '@/components/ui/skeleton';


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
  technicalDetails: z.string().optional(), 
});

export default function ContactPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [formSchema, setFormSchema] = useState(() => getFormSchema(language)); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [content, setContent] = useState<ContactContentData | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), 
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      technicalDetails: '',
    },
    mode: 'onBlur', 
  });

  useEffect(() => {
    async function loadPageContent() {
      setIsLoadingContent(true);
      try {
        const allContent = await getContent();
        setContent(allContent.contact);
      } catch (error) {
        console.error("Failed to load contact page content:", error);
      } finally {
        setIsLoadingContent(false);
      }
    }
    loadPageContent();
  }, []);

   React.useEffect(() => {
    const newSchema = getFormSchema(language);
    setFormSchema(newSchema);
    (form as any)._resolver = zodResolver(newSchema);
    Object.keys(form.formState.touchedFields).forEach(fieldName => {
        form.trigger(fieldName as keyof z.infer<typeof formSchema>);
    });
   }, [language, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true); 
    try {
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

      console.log("CLIENT-INFO: Sending data to server action:", values); 
      const result = await sendContactEmail(values);
      console.log("CLIENT-INFO: Received result from server action:", result); 

      if (result.success) {
        toast({
          title: language === 'en' ? 'Message Sent!' : 'Nachricht gesendet!',
          description: language === 'en'
            ? 'Thank you for your inquiry. We will get back to you soon.'
            : 'Vielen Dank für Ihre Anfrage. Wir werden uns bald bei Ihnen melden.',
          variant: 'default', 
        });
        form.reset(); 
      } else {
        const messages = result.message.split(' / ');
        const displayMessage = language === 'en' ? messages[0] : (messages[1] || messages[0]); 

        toast({
          title: language === 'en' ? 'Error Sending Message' : 'Fehler beim Senden',
          description: displayMessage || (language === 'en'
            ? 'Could not send your message. Please try again later or check server logs.' 
            : 'Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut oder prüfen Sie die Server-Logs.'), 
          variant: 'destructive',
        });
        console.error("Server Action Error:", result.message);
      }
    } catch (error) {
      console.error("Unexpected error during form submission:", error);
      toast({
        title: language === 'en' ? 'Unexpected Error' : 'Unerwarteter Fehler',
        description: language === 'en'
          ? 'An unexpected error occurred. Please try again.'
          : 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false); 
    }
  }

  if (isLoadingContent || !content) {
    return (
      <div className="space-y-10 md:space-y-12 lg:space-y-16">
        <section className="text-center px-4">
          <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
          <Skeleton className="h-6 w-3/4 mx-auto" />
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 px-4 xl:px-0">
          <div className="space-y-6 order-2 lg:order-1">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Alert>
              <Skeleton className="h-5 w-5 mt-1 flex-shrink-0" />
              <Skeleton className="h-6 w-1/2 mb-1" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </Alert>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div><Skeleton className="h-6 w-1/4 mb-1" /><Skeleton className="h-10 w-full" /></div>
                <div><Skeleton className="h-6 w-1/4 mb-1" /><Skeleton className="h-10 w-full" /></div>
              </div>
              <div><Skeleton className="h-6 w-1/4 mb-1" /><Skeleton className="h-10 w-full" /></div>
              <div><Skeleton className="h-6 w-1/4 mb-1" /><Skeleton className="h-24 w-full" /><Skeleton className="h-4 w-1/2 mt-1" /></div>
              <div><Skeleton className="h-6 w-1/4 mb-1" /><Skeleton className="h-16 w-full" /><Skeleton className="h-4 w-1/2 mt-1" /></div>
              <Skeleton className="h-11 w-36" />
            </div>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <div className="flex items-start gap-4 p-4 border rounded-lg bg-card">
              <Skeleton className="h-6 w-6 mt-1 flex-shrink-0" />
              <div className="w-full"><Skeleton className="h-5 w-1/4 mb-1" /><Skeleton className="h-4 w-3/4 mb-1" /><Skeleton className="h-4 w-1/2 mb-2" /><Skeleton className="h-3 w-5/6" /></div>
            </div>
            <div className="flex items-start gap-4 p-4 border rounded-lg bg-card">
              <Skeleton className="h-6 w-6 mt-1 flex-shrink-0" />
              <div className="w-full"><Skeleton className="h-5 w-1/4 mb-1" /><Skeleton className="h-4 w-3/4 mb-1" /><Skeleton className="h-4 w-1/2" /></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const translations = {
    pageTitle: language === 'en' ? content.pageTitle_en : content.pageTitle_de,
    pageDescription: language === 'en' ? content.pageDescription_en : content.pageDescription_de,
    formTitle: language === 'en' ? content.formTitle_en : content.formTitle_de,
    alertTitle: language === 'en' ? content.alertTitle_en : content.alertTitle_de,
    alertDescription: language === 'en' ? content.alertDescription_en : content.alertDescription_de,
    nameLabel: language === 'en' ? content.nameLabel_en : content.nameLabel_de,
    namePlaceholder: language === 'en' ? content.namePlaceholder_en : content.namePlaceholder_de,
    emailLabel: language === 'en' ? content.emailLabel_en : content.emailLabel_de,
    emailPlaceholder: language === 'en' ? content.emailPlaceholder_en : content.emailPlaceholder_de,
    subjectLabel: language === 'en' ? content.subjectLabel_en : content.subjectLabel_de,
    subjectPlaceholder: language === 'en' ? content.subjectPlaceholder_en : content.subjectPlaceholder_de,
    messageLabel: language === 'en' ? content.messageLabel_en : content.messageLabel_de,
    messagePlaceholder: language === 'en' ? content.messagePlaceholder_en : content.messagePlaceholder_de,
    messageDescription: language === 'en' ? content.messageDescription_en : content.messageDescription_de,
    techDetailsLabel: language === 'en' ? content.techDetailsLabel_en : content.techDetailsLabel_de,
    techDetailsPlaceholder: language === 'en' ? content.techDetailsPlaceholder_en : content.techDetailsPlaceholder_de,
    techDetailsDescription: language === 'en' ? content.techDetailsDescription_en : content.techDetailsDescription_de,
    submitButton: language === 'en' ? content.submitButton_en : content.submitButton_de,
    submittingButton: language === 'en' ? 'Sending...' : 'Sende...',
    directContactTitle: language === 'en' ? content.directContactTitle_en : content.directContactTitle_de,
    emailInfoTitle: language === 'en' ? content.emailInfoTitle_en : content.emailInfoTitle_de,
    emailInfoText: language === 'en' ? content.emailInfoText_en : content.emailInfoText_de,
    emailInfoHint: language === 'en' ? content.emailInfoHint_en : content.emailInfoHint_de,
    phoneInfoTitle: language === 'en' ? content.phoneInfoTitle_en : content.phoneInfoTitle_de,
    phoneInfoText: language === 'en' ? content.phoneInfoText_en : content.phoneInfoText_de,
    phoneInfoNumber: content.phoneInfoNumber, // Single language for phone number
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
              <Info className="h-4 w-4 mt-1 flex-shrink-0" /> 
              <AlertTitle>{translations.alertTitle}</AlertTitle>
              <AlertDescription>
                {translations.alertDescription}
              </AlertDescription>
            </Alert>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"> 
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
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-primary hover:bg-primary/90"> 
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
          <div className="flex items-start gap-4 p-4 border rounded-lg bg-card"> 
            <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">{translations.emailInfoTitle}</h3>
              <p className="text-muted-foreground text-sm"> 
                {translations.emailInfoText}
              </p>
              <a href="mailto:hilfe@nginxify.com" className="text-primary hover:underline break-all font-medium">
                hilfe@nginxify.com
              </a>
               <p className="text-xs text-muted-foreground mt-2"> 
                {translations.emailInfoHint}
               </p>
            </div>
          </div>
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
