'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(admin)/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogOut, Save, FileText, HomeIcon, SettingsIcon, MailIcon, Briefcase } from 'lucide-react';
import type { Service } from '@/lib/services-data';
import { allServices as initialAllServices } from '@/lib/services-data'; // Renamed to avoid conflict

// Helper function to create initial content structures
// In a real app, this would come from a CMS or database
const getInitialHomeContent = () => ({
  pageTitle_de: 'nginxify Hilfe: Ehrenamtliche IT-Unterstützung für Vereine & Einzelpersonen',
  pageTitle_en: 'Nginxify Help: Volunteer IT Support for Clubs & Individuals',
  pageDescription_de: 'Wir helfen digital – kostenlos oder gegen eine freiwillige Spende. Unsere Mission ist es, gemeinnützige Organisationen und Privatpersonen mit IT-Herausforderungen zu unterstützen.',
  pageDescription_en: 'We help digitally – free of charge or for a voluntary donation. Our mission is to support non-profit organizations and private individuals with IT challenges.',
  requestHelpButton_de: 'Hilfe Anfordern',
  requestHelpButton_en: 'Request Help',
  learnMoreButton_de: 'Mehr über unsere Leistungen',
  learnMoreButton_en: 'Learn More About Our Services',
  clubsTitle_de: 'Für Vereine & Organisationen',
  clubsTitle_en: 'For Clubs & Organizations',
  clubsDescription_de: 'Unterstützung für gemeinnützige Projekte.',
  clubsDescription_en: 'Support for non-profit projects.',
  clubsText_de: 'Wir bieten grundlegende Hilfe bei der Erstellung von Webseiten, der Einrichtung von Online-Tools, oder bei allgemeinen IT-Fragen, damit Sie sich auf Ihre Kernarbeit konzentrieren können.',
  clubsText_en: 'We offer basic help with website creation, setting up online tools, or general IT questions, so you can focus on your core work.',
  individualsTitle_de: 'Für Privatpersonen',
  individualsTitle_en: 'For Individuals',
  individualsDescription_de: 'Hilfe bei alltäglichen IT-Problemen.',
  individualsDescription_en: 'Help with everyday IT problems.',
  individualsText_de: 'Brauchen Sie Hilfe mit Ihrem Computer, Smartphone oder haben Sie Fragen zur Online-Sicherheit? Wir unterstützen Sie bei einfachen IT-Herausforderungen.',
  individualsText_en: 'Need help with your computer, smartphone, or have questions about online security? We support you with simple IT challenges.',
  viewDetailsButton_de: 'Details ansehen',
  viewDetailsButton_en: 'View Details',
  howItWorksTitle_de: 'Wie funktioniert unsere Hilfe?',
  howItWorksTitle_en: 'How does our help work?',
  howItWorksDescription_de: 'Unsere Unterstützung basiert auf ehrenamtlichem Engagement. Erfahren Sie mehr über den Prozess und wie Sie Hilfe anfordern können.',
  howItWorksDescription_en: 'Our support is based on volunteer work. Learn more about the process and how you can request help.',
  howItWorksButton_de: 'So Funktioniert\'s',
  howItWorksButton_en: 'How It Works',
});

const getInitialServicesPageContent = () => ({
  pageTitle_de: 'Unsere Leistungen',
  pageTitle_en: 'Our Services',
  pageDescription_de: 'Wir bieten ehrenamtliche IT-Unterstützung für gemeinnützige Organisationen und Privatpersonen. Unser Fokus liegt auf grundlegender Hilfe und Beratung.',
  pageDescription_en: 'We offer volunteer IT support for non-profit organizations and individuals. Our focus is on basic help and advice.',
  clubSectionTitle_de: 'Für Vereine & Organisationen',
  clubSectionTitle_en: 'For Clubs & Organizations',
  clubSectionDescription_de: 'Wir unterstützen gemeinnützige Vereine und Organisationen dabei, ihre digitale Präsenz aufzubauen und grundlegende IT-Herausforderungen zu meistern. Bitte beachten Sie, dass wir keine komplexen, professionellen Großprojekte übernehmen können.',
  clubSectionDescription_en: 'We support non-profit clubs and organizations in building their digital presence and overcoming basic IT challenges. Please note that we cannot take on complex, professional large-scale projects.',
  individualSectionTitle_de: 'Für Privatpersonen',
  individualSectionTitle_en: 'For Individuals',
  individualSectionDescription_de: 'Wir helfen Ihnen bei alltäglichen IT-Problemen und Fragen rund um Computer, Smartphone und Internet.',
  individualSectionDescription_en: 'We help you with everyday IT problems and questions about computers, smartphones, and the internet.',
});

const getInitialHowItWorksContent = () => ({
  pageTitle_de: 'So Funktioniert\'s',
  pageTitle_en: 'How It Works',
  pageDescription_de: 'Erfahren Sie mehr über unser ehrenamtliches Modell, wie Sie Hilfe anfordern können und was Sie erwarten können.',
  pageDescription_en: 'Learn more about our volunteer model, how to request help, and what to expect.',
  volunteerTitle_de: 'Ehrenamtliches Engagement',
  volunteerTitle_en: 'Volunteer Commitment',
  volunteerDescription_de: 'Unsere Hilfe wird von Freiwilligen geleistet, die ihre IT-Kenntnisse und Zeit zur Verfügung stellen, um anderen zu helfen. Wir sind eine Gemeinschaft von Technikbegeisterten, die Gutes tun wollen.',
  volunteerDescription_en: 'Our help is provided by volunteers who offer their IT skills and time to help others. We are a community of tech enthusiasts wanting to do good.',
  costTitle_de: 'Kostenlos & Spendenbasiert',
  costTitle_en: 'Free & Donation-Based',
  costDescription_de: 'Unsere grundlegende Unterstützung ist kostenlos. Freiwillige Spenden sind willkommen und helfen uns, eventuelle Kosten zu decken und die Initiative am Laufen zu halten. Es besteht jedoch keine Verpflichtung zur Spende.',
  costDescription_en: 'Our basic support is free. Voluntary donations are welcome and help us cover any costs and keep the initiative running. However, there is no obligation to donate.',
  requestTitle_de: 'Hilfe Anfordern',
  requestTitle_en: 'Requesting Help',
  requestDescriptionPart1_de: 'Der einfachste Weg, Unterstützung anzufragen, ist über unser ',
  requestDescriptionPart1_en: 'The easiest way to request support is via our ',
  requestDescriptionLink_de: 'Kontaktformular',
  requestDescriptionLink_en: 'Contact Form',
  requestDescriptionPart2_de: ' oder per E-Mail. Beschreiben Sie Ihr Anliegen möglichst genau, damit wir Ihre Anfrage besser einschätzen können.',
  requestDescriptionPart2_en: ' or by email. Please describe your issue as accurately as possible so we can better assess your request.',
  expectationTitle_de: 'Erwartungsmanagement',
  expectationTitle_en: 'Expectation Management',
  expectationDescription_de: 'Da wir ehrenamtlich tätig sind, erfolgt die Hilfe nach Verfügbarkeit unserer Freiwilligen. Wir bemühen uns, zeitnah zu antworten, bitten aber um Verständnis, wenn es manchmal etwas dauern kann. Wir können nicht garantieren, jedes Problem lösen zu können, geben aber unser Bestes.',
  expectationDescription_en: 'As we operate on a volunteer basis, help is provided based on the availability of our volunteers. We strive to respond promptly but ask for your understanding if it sometimes takes a little longer. We cannot guarantee to solve every problem, but we do our best.',
  whoTitle_de: 'Wer wir sind',
  whoTitle_en: 'Who We Are',
  whoDescription_de: 'Wir sind eine Gruppe von IT-interessierten Einzelpersonen, die ihre Fähigkeiten nutzen möchten, um gemeinnützigen Organisationen und Privatpersonen bei technischen Herausforderungen unter die Arme zu greifen.',
  whoDescription_en: 'We are a group of IT-interested individuals who want to use our skills to help non-profit organizations and individuals with technical challenges.',
  donationsTitle_de: 'Spendenverwendung (Optional)',
  donationsTitle_en: 'Use of Donations (Optional)',
  donationsDescription_de: 'Falls Spenden eingehen, werden diese transparent zur Deckung von Betriebskosten (z.B. Hosting der Webseite) oder zur Unterstützung spezifischer gemeinnütziger IT-Projekte verwendet.',
  donationsDescription_en: 'If donations are received, they will be used transparently to cover operating costs (e.g., website hosting) or to support specific non-profit IT projects.',
  ctaTitle_de: 'Bereit, Hilfe anzufragen?',
  ctaTitle_en: 'Ready to Request Help?',
  ctaDescription_de: 'Füllen Sie unser Kontaktformular aus oder schreiben Sie uns eine E-Mail. Wir freuen uns darauf, von Ihnen zu hören!',
  ctaDescription_en: 'Fill out our contact form or send us an email. We look forward to hearing from you!',
  ctaButton_de: 'Jetzt Kontakt aufnehmen',
  ctaButton_en: 'Contact Us Now',
});

const getInitialContactContent = () => ({
  pageTitle_de: 'Kontaktieren Sie Uns',
  pageTitle_en: 'Contact Us',
  pageDescription_de: 'Haben Sie eine Frage oder benötigen Sie IT-Unterstützung? Füllen Sie das Formular aus oder schreiben Sie uns eine E-Mail.',
  pageDescription_en: 'Have a question or need IT support? Fill out the form or send us an email.',
  formTitle_de: 'Anfrageformular',
  formTitle_en: 'Inquiry Form',
  alertTitle_de: 'Wichtige Informationen für Ihre Anfrage',
  alertTitle_en: 'Important Information for Your Request',
  alertDescription_de: 'Um Ihnen bestmöglich helfen zu können, beschreiben Sie Ihr Problem bitte so detailliert wie möglich. Geben Sie bei technischen Problemen bitte auch Informationen zu Ihrem Gerät (z.B. Betriebssystem, Modell) an, falls relevant.',
  alertDescription_en: 'To help us assist you best, please describe your problem in as much detail as possible. For technical issues, please also provide information about your device (e.g., operating system, model) if relevant.',
  nameLabel_de: 'Name',
  nameLabel_en: 'Name',
  namePlaceholder_de: 'Ihr Name',
  namePlaceholder_en: 'Your Name',
  emailLabel_de: 'E-Mail',
  emailLabel_en: 'Email',
  emailPlaceholder_de: 'ihre@email.de',
  emailPlaceholder_en: 'your@email.com',
  subjectLabel_de: 'Betreff',
  subjectLabel_en: 'Subject',
  subjectPlaceholder_de: 'Worum geht es?',
  subjectPlaceholder_en: 'What is it about?',
  messageLabel_de: 'Ihre Nachricht / Problembeschreibung',
  messageLabel_en: 'Your Message / Problem Description',
  messagePlaceholder_de: 'Beschreiben Sie Ihr Anliegen...',
  messagePlaceholder_en: 'Describe your concern...',
  messageDescription_de: 'Je detaillierter, desto besser können wir helfen.',
  messageDescription_en: 'The more detailed, the better we can help.',
  techDetailsLabel_de: 'Technische Details (Optional)',
  techDetailsLabel_en: 'Technical Details (Optional)',
  techDetailsPlaceholder_de: 'z.B. Betriebssystem, Gerätemodell, verwendete Software...',
  techDetailsPlaceholder_en: 'e.g., Operating system, device model, software used...',
  techDetailsDescription_de: 'Falls relevant für Ihr Problem.',
  techDetailsDescription_en: 'If relevant to your problem.',
  submitButton_de: 'Anfrage Senden',
  submitButton_en: 'Send Request',
  directContactTitle_de: 'Direkter Kontakt',
  directContactTitle_en: 'Direct Contact',
  emailInfoTitle_de: 'E-Mail',
  emailInfoTitle_en: 'Email',
  emailInfoText_de: 'Sie können uns auch direkt eine E-Mail schreiben:',
  emailInfoText_en: 'You can also email us directly:',
  emailInfoHint_de: 'Bitte geben Sie auch hier möglichst viele Details zu Ihrem Anliegen an.',
  emailInfoHint_en: 'Please provide as many details as possible about your concern here as well.',
  phoneInfoTitle_de: 'Telefon',
  phoneInfoTitle_en: 'Phone',
  phoneInfoText_de: 'Erreichen Sie uns während der Geschäftszeiten:',
  phoneInfoText_en: 'Reach us during business hours:',
  phoneInfoNumber: '+49 123 456789',
});


export default function AdminDashboardPage() {
  const { isAuthenticated, logout, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Content states for each page
  const [homeContent, setHomeContent] = useState(getInitialHomeContent);
  const [servicesPageContent, setServicesPageContent] = useState(getInitialServicesPageContent);
  const [editableServices, setEditableServices] = useState<Service[]>(() => JSON.parse(JSON.stringify(initialAllServices))); // Deep copy for editing
  const [howItWorksContent, setHowItWorksContent] = useState(getInitialHowItWorksContent);
  const [contactContent, setContactContent] = useState(getInitialContactContent);
  
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({}); // Saving state per tab

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.replace('/mngr/login');
    }
  }, [isAuthenticated, authIsLoading, router]);

  const handleContentChange = (page: string, field: string, value: string, lang?: 'de' | 'en', serviceIndex?: number, serviceField?: keyof Service) => {
    if (page === 'home') {
      setHomeContent(prev => ({ ...prev, [field + (lang ? `_${lang}` : '')]: value }));
    } else if (page === 'servicesPage') {
      setServicesPageContent(prev => ({ ...prev, [field + (lang ? `_${lang}` : '')]: value }));
    } else if (page === 'servicesItems' && typeof serviceIndex === 'number' && serviceField) {
      setEditableServices(prev => prev.map((service, idx) => 
        idx === serviceIndex ? { ...service, [serviceField]: value } : service
      ));
    } else if (page === 'howItWorks') {
      setHowItWorksContent(prev => ({ ...prev, [field + (lang ? `_${lang}` : '')]: value }));
    } else if (page === 'contact') {
      setContactContent(prev => ({ ...prev, [field + (lang ? `_${lang}` : '')]: value }));
    }
  };

  const handleSave = async (pageKey: string, dataToSave: any) => {
    setIsSaving(prev => ({...prev, [pageKey]: true}));
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    console.log(`Content for ${pageKey} saved:`, dataToSave);
    toast({
      title: `${pageKey.charAt(0).toUpperCase() + pageKey.slice(1)} Content Saved`,
      description: 'Your changes have been (simulated) saved.',
    });
    setIsSaving(prev => ({...prev, [pageKey]: false}));
  };
  
  const renderFormField = (page: string, fieldName: string, label: string, isTextarea = false, serviceIndex?: number, serviceField?: keyof Service) => (
    <div key={`${page}-${fieldName}-${serviceIndex || ''}`} className="space-y-4 py-2">
      <h4 className="font-medium col-span-full">{label}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <Label htmlFor={`${page}-${fieldName}-de`}>Deutsch</Label>
          {isTextarea ? (
            <Textarea
              id={`${page}-${fieldName}-de`}
              value={(page === 'servicesItems' && typeof serviceIndex === 'number' && serviceField) ? String(editableServices[serviceIndex][serviceField] || '') : (homeContent as any)[`${fieldName}_de`]}
              onChange={(e) => handleContentChange(page, fieldName, e.target.value, 'de', serviceIndex, serviceField)}
              rows={fieldName.toLowerCase().includes('description') ? 5 : 3}
              className="w-full mt-1"
            />
          ) : (
            <Input
              id={`${page}-${fieldName}-de`}
              value={(page === 'servicesItems' && typeof serviceIndex === 'number' && serviceField) ? String(editableServices[serviceIndex][serviceField] || '') : (homeContent as any)[`${fieldName}_de`]}
              onChange={(e) => handleContentChange(page, fieldName, e.target.value, 'de', serviceIndex, serviceField)}
              className="w-full mt-1"
            />
          )}
        </div>
        <div>
          <Label htmlFor={`${page}-${fieldName}-en`}>English</Label>
          {isTextarea ? (
            <Textarea
              id={`${page}-${fieldName}-en`}
              value={(page === 'servicesItems' && typeof serviceIndex === 'number' && serviceField) ? String(editableServices[serviceIndex][serviceField] || '') : (homeContent as any)[`${fieldName}_en`]}
              onChange={(e) => handleContentChange(page, fieldName, e.target.value, 'en', serviceIndex, serviceField)}
              rows={fieldName.toLowerCase().includes('description') ? 5 : 3}
              className="w-full mt-1"
            />
          ) : (
            <Input
              id={`${page}-${fieldName}-en`}
              value={(page === 'servicesItems' && typeof serviceIndex === 'number' && serviceField) ? String(editableServices[serviceIndex][serviceField] || '') : (homeContent as any)[`${fieldName}_en`]}
              onChange={(e) => handleContentChange(page, fieldName, e.target.value, 'en', serviceIndex, serviceField)}
              className="w-full mt-1"
            />
          )}
        </div>
      </div>
    </div>
  );

   const renderSingleField = (page: string, fieldName: string, label: string, isTextarea = false, serviceIndex?:number, serviceField?: keyof Service) => {
    let value;
    if (page === 'servicesItems' && typeof serviceIndex === 'number' && serviceField) {
        value = String(editableServices[serviceIndex][serviceField] || '');
    } else if (page === 'contact') {
        value = (contactContent as any)[fieldName];
    } // Add other pages if they have single language fields

    return (
        <div key={`${page}-${fieldName}-${serviceIndex || ''}`} className="space-y-2 py-2">
        <Label htmlFor={`${page}-${fieldName}`}>{label}</Label>
        {isTextarea ? (
            <Textarea
            id={`${page}-${fieldName}`}
            value={value}
            onChange={(e) => handleContentChange(page, fieldName, e.target.value, undefined, serviceIndex, serviceField)}
            rows={3}
            className="w-full mt-1"
            />
        ) : (
            <Input
            id={`${page}-${fieldName}`}
            value={value}
            onChange={(e) => handleContentChange(page, fieldName, e.target.value, undefined, serviceIndex, serviceField)}
            className="w-full mt-1"
            />
        )}
        </div>
    );
    };


  if (authIsLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <Button variant="outline" onClick={logout} size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
          <CardDescription>Edit website content below. Changes are simulated.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="home" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
              <TabsTrigger value="home"><HomeIcon className="mr-2 h-4 w-4"/>Home</TabsTrigger>
              <TabsTrigger value="services"><Briefcase className="mr-2 h-4 w-4"/>Services</TabsTrigger>
              <TabsTrigger value="how-it-works"><SettingsIcon className="mr-2 h-4 w-4"/>How It Works</TabsTrigger>
              <TabsTrigger value="contact"><MailIcon className="mr-2 h-4 w-4"/>Contact</TabsTrigger>
            </TabsList>

            {/* Home Page Tab */}
            <TabsContent value="home" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Home Page Content</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {renderFormField('home', 'pageTitle', 'Page Title')}
                  {renderFormField('home', 'pageDescription', 'Page Description', true)}
                  {renderFormField('home', 'requestHelpButton', 'Request Help Button')}
                  {renderFormField('home', 'learnMoreButton', 'Learn More Button')}
                  {renderFormField('home', 'clubsTitle', 'Clubs Title')}
                  {renderFormField('home', 'clubsDescription', 'Clubs Meta Description')}
                  {renderFormField('home', 'clubsText', 'Clubs Text', true)}
                  {renderFormField('home', 'individualsTitle', 'Individuals Title')}
                  {renderFormField('home', 'individualsDescription', 'Individuals Meta Description')}
                  {renderFormField('home', 'individualsText', 'Individuals Text', true)}
                  {renderFormField('home', 'viewDetailsButton', 'View Details Button')}
                  {renderFormField('home', 'howItWorksTitle', 'How It Works Title')}
                  {renderFormField('home', 'howItWorksDescription', 'How It Works Description', true)}
                  {renderFormField('home', 'howItWorksButton', 'How It Works Button')}
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSave('Home', homeContent)} disabled={isSaving['Home']}>
                    {isSaving['Home'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Home Content
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Services Page Tab */}
            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Services Page Meta Content</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {renderFormField('servicesPage', 'pageTitle', 'Page Title')}
                  {renderFormField('servicesPage', 'pageDescription', 'Page Description', true)}
                  {renderFormField('servicesPage', 'clubSectionTitle', 'Clubs Section Title')}
                  {renderFormField('servicesPage', 'clubSectionDescription', 'Clubs Section Description', true)}
                  {renderFormField('servicesPage', 'individualSectionTitle', 'Individuals Section Title')}
                  {renderFormField('servicesPage', 'individualSectionDescription', 'Individuals Section Description', true)}
                </CardContent>
                 <CardFooter>
                  <Button onClick={() => handleSave('Services Page Meta', servicesPageContent)} disabled={isSaving['Services Page Meta']}>
                    {isSaving['Services Page Meta'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Services Page Meta
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader><CardTitle>Individual Services</CardTitle></CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {editableServices.map((service, index) => (
                      <AccordionItem value={`service-${index}`} key={service.slug}>
                        <AccordionTrigger>{service.titleEn} / {service.titleDe}</AccordionTrigger>
                        <AccordionContent className="space-y-4 pl-2 border-l-2 ml-2">
                          {renderFormField('servicesItems', 'title', 'Service Title', false, index, 'titleDe', )}
                          {renderFormField('servicesItems', 'title', '', false, index, 'titleEn')}
                          {renderFormField('servicesItems', 'description', 'Short Description', true, index, 'descriptionDe')}
                          {renderFormField('servicesItems', 'description', '', true, index, 'descriptionEn')}
                          {renderFormField('servicesItems', 'detailedDescription', 'Detailed Description (HTML)', true, index, 'detailedDescriptionDe')}
                           {renderFormField('servicesItems', 'detailedDescription', '', true, index, 'detailedDescriptionEn')}
                          {renderSingleField('servicesItems', 'imageHint', 'Image Hint (Keywords for AI)', false, index, 'imageHint')}
                          {/* Image URL is not directly editable here for simplicity, could be a text field if needed */}
                           <p className="text-sm text-muted-foreground">Icon for this service is: {service.icon.props.className.match(/lucide-\w+/)?.[0].replace('lucide-','') || 'Custom Icon'} (Not editable here)</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
                 <CardFooter>
                  <Button onClick={() => handleSave('Services List', editableServices)} disabled={isSaving['Services List']}>
                    {isSaving['Services List'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save All Services
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* How It Works Page Tab */}
            <TabsContent value="how-it-works" className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>How It Works Page Content</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {renderFormField('howItWorks', 'pageTitle', 'Page Title')}
                        {renderFormField('howItWorks', 'pageDescription', 'Page Description', true)}
                        {renderFormField('howItWorks', 'volunteerTitle', 'Volunteer Title')}
                        {renderFormField('howItWorks', 'volunteerDescription', 'Volunteer Description', true)}
                        {renderFormField('howItWorks', 'costTitle', 'Cost Title')}
                        {renderFormField('howItWorks', 'costDescription', 'Cost Description', true)}
                        {renderFormField('howItWorks', 'requestTitle', 'Request Help Title')}
                        {renderFormField('howItWorks', 'requestDescriptionPart1', 'Request Description Part 1')}
                        {renderFormField('howItWorks', 'requestDescriptionLink', 'Request Description Link Text')}
                        {renderFormField('howItWorks', 'requestDescriptionPart2', 'Request Description Part 2')}
                        {renderFormField('howItWorks', 'expectationTitle', 'Expectation Title')}
                        {renderFormField('howItWorks', 'expectationDescription', 'Expectation Description', true)}
                        {renderFormField('howItWorks', 'whoTitle', 'Who We Are Title')}
                        {renderFormField('howItWorks', 'whoDescription', 'Who We Are Description', true)}
                        {renderFormField('howItWorks', 'donationsTitle', 'Donations Title')}
                        {renderFormField('howItWorks', 'donationsDescription', 'Donations Description', true)}
                        {renderFormField('howItWorks', 'ctaTitle', 'CTA Title')}
                        {renderFormField('howItWorks', 'ctaDescription', 'CTA Description', true)}
                        {renderFormField('howItWorks', 'ctaButton', 'CTA Button Text')}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleSave('How It Works', howItWorksContent)} disabled={isSaving['How It Works']}>
                            {isSaving['How It Works'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save How It Works Content
                        </Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            {/* Contact Page Tab */}
            <TabsContent value="contact" className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Contact Page Content</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {renderFormField('contact', 'pageTitle', 'Page Title')}
                        {renderFormField('contact', 'pageDescription', 'Page Description', true)}
                        {renderFormField('contact', 'formTitle', 'Form Title')}
                        {renderFormField('contact', 'alertTitle', 'Alert Title')}
                        {renderFormField('contact', 'alertDescription', 'Alert Description', true)}
                        {renderFormField('contact', 'nameLabel', 'Name Label')}
                        {renderFormField('contact', 'namePlaceholder', 'Name Placeholder')}
                        {renderFormField('contact', 'emailLabel', 'Email Label')}
                        {renderFormField('contact', 'emailPlaceholder', 'Email Placeholder')}
                        {renderFormField('contact', 'subjectLabel', 'Subject Label')}
                        {renderFormField('contact', 'subjectPlaceholder', 'Subject Placeholder')}
                        {renderFormField('contact', 'messageLabel', 'Message Label')}
                        {renderFormField('contact', 'messagePlaceholder', 'Message Placeholder')}
                        {renderFormField('contact', 'messageDescription', 'Message Description')}
                        {renderFormField('contact', 'techDetailsLabel', 'Tech Details Label')}
                        {renderFormField('contact', 'techDetailsPlaceholder', 'Tech Details Placeholder')}
                        {renderFormField('contact', 'techDetailsDescription', 'Tech Details Description')}
                        {renderFormField('contact', 'submitButton', 'Submit Button Text')}
                        {renderFormField('contact', 'directContactTitle', 'Direct Contact Title')}
                        {renderFormField('contact', 'emailInfoTitle', 'Email Info Title')}
                        {renderFormField('contact', 'emailInfoText', 'Email Info Text')}
                        {renderFormField('contact', 'emailInfoHint', 'Email Info Hint')}
                        {renderFormField('contact', 'phoneInfoTitle', 'Phone Info Title')}
                        {renderFormField('contact', 'phoneInfoText', 'Phone Info Text')}
                        {renderSingleField('contact', 'phoneInfoNumber', 'Phone Info Number')}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleSave('Contact', contactContent)} disabled={isSaving['Contact']}>
                            {isSaving['Contact'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Contact Content
                        </Button>
                    </CardFooter>
                </Card>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
