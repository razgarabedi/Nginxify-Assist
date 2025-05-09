'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(admin)/contexts/auth-context';
import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogOut, Save, FileText, HomeIcon, SettingsIcon, MailIcon, Briefcase, ImagesIcon, Trash2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn for combining classNames

import { allServices as serviceDefinitions, type Service as ServiceDefinition } from '@/lib/services-data';
import { 
  getContent, 
  saveContent,
  type AllContentData,
  type HomeContentData,
  type ServicesPageData,
  type ServiceItemContentData,
  type HowItWorksContentData,
  type ContactContentData,
  type SlideContentData
} from '@/actions/content-actions';

// Import initial data getters from the new utility file
import { 
  getInitialHomeContent as getInitialHomeData, 
  getInitialSlideshowData 
} from '@/lib/default-content-getters';


const getInitialServicesPageData = (): ServicesPageData => ({
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

// This will be for display structure, text comes from servicesItemsContent
const getInitialDisplayServices = (): ServiceDefinition[] => JSON.parse(JSON.stringify(serviceDefinitions));

const getInitialHowItWorksData = (): HowItWorksContentData => ({
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

const getInitialContactData = (): ContactContentData => ({
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

  const [homeContent, setHomeContent] = useState<Omit<HomeContentData, 'slideshowItems'>>(
    () => {
      const initialHome = getInitialHomeData();
      const { slideshowItems, ...rest } = initialHome;
      return rest;
    }
  );
  const [slideshowItems, setSlideshowItems] = useState<SlideContentData[]>(() => getInitialSlideshowData());
  const [servicesPageContent, setServicesPageContent] = useState<ServicesPageData>(getInitialServicesPageData);
  const [servicesItemsContent, setServicesItemsContent] = useState<Record<string, ServiceItemContentData>>({});
  const [howItWorksContent, setHowItWorksContent] = useState<HowItWorksContentData>(getInitialHowItWorksData);
  const [contactContent, setContactContent] = useState<ContactContentData>(getInitialContactData);
  
  const [displayServices, setDisplayServices] = useState<ServiceDefinition[]>(getInitialDisplayServices);

  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.replace('/mngr/login');
    }
  }, [isAuthenticated, authIsLoading, router]);

  useEffect(() => {
    async function loadPageContent() {
      if (isAuthenticated) {
        setIsLoadingContent(true);
        try {
          const data = await getContent();
          
          const defaultInitialHome = getInitialHomeData(); 
          const defaultInitialSlides = getInitialSlideshowData();

          const { slideshowItems: loadedSlideshowItems, ...loadedHomeContent } = data.home || defaultInitialHome;
          setHomeContent(loadedHomeContent);
          setSlideshowItems(loadedSlideshowItems && loadedSlideshowItems.length > 0 ? loadedSlideshowItems : defaultInitialSlides);

          setServicesPageContent(data.servicesPage || getInitialServicesPageData());
          setHowItWorksContent(data.howItWorks || getInitialHowItWorksData());
          setContactContent(data.contact || getInitialContactData());

          const finalServicesItemsContent: Record<string, ServiceItemContentData> = {};
          const finalDisplayServices: ServiceDefinition[] = [];

          serviceDefinitions.forEach(sd => {
            const { icon, slug: serviceSlug, category, ...defaultTextContent } = sd;
            
            if (data.servicesItems && data.servicesItems[serviceSlug]) {
              finalServicesItemsContent[serviceSlug] = {
                ...defaultTextContent, 
                ...data.servicesItems[serviceSlug]
              };
            } else {
              finalServicesItemsContent[serviceSlug] = defaultTextContent as ServiceItemContentData;
            }
            finalDisplayServices.push(sd);
          });

          setServicesItemsContent(finalServicesItemsContent);
          setDisplayServices(finalDisplayServices);

        } catch (error) {
          console.error('Failed to load content:', error);
          toast({
            title: 'Error Loading Content',
            description: 'Could not load website content. Using defaults.',
            variant: 'destructive',
          });
          const { slideshowItems: defaultSlides, ...defaultHome } = getInitialHomeData();
          setHomeContent(defaultHome);
          setSlideshowItems(defaultSlides);
          setServicesPageContent(getInitialServicesPageData());
          setHowItWorksContent(getInitialHowItWorksData());
          setContactContent(getInitialContactData());
          
          const fallbackServicesItems: Record<string, ServiceItemContentData> = {};
          serviceDefinitions.forEach(s => {
            const { icon, slug, category, ...textContent } = s;
            fallbackServicesItems[slug] = textContent as ServiceItemContentData;
          });
          setServicesItemsContent(fallbackServicesItems);
          setDisplayServices(getInitialDisplayServices());
        } finally {
          setIsLoadingContent(false);
        }
      }
    }
    if(!authIsLoading && isAuthenticated) {
        loadPageContent();
    }
  }, [isAuthenticated, authIsLoading, toast]); 

  const handleSlideshowItemChange = useCallback((index: number, field: keyof SlideContentData, value: string | number) => {
    setSlideshowItems(prev => {
      const newSlides = [...prev];
      (newSlides[index] as any)[field] = value; 
      return newSlides;
    });
  }, []);

  const addSlideshowItem = useCallback(() => {
    setSlideshowItems(prev => [
      ...prev,
      {
        id: prev.length > 0 ? Math.max(...prev.map(s => s.id)) + 1 : 1,
        imageUrl: 'https://picsum.photos/1600/900',
        imageHint: 'new slide',
        altText_de: 'Neuer Slide Alt Text DE',
        altText_en: 'New Slide Alt Text EN',
        title_de: 'Neuer Slide Titel DE',
        title_en: 'New Slide Title EN',
        description_de: 'Neue Slide Beschreibung DE.',
        description_en: 'New slide description EN.',
        ctaText_de: 'Mehr erfahren',
        ctaText_en: 'Learn More',
        ctaLink: '/',
      }
    ]);
  }, []);

  const removeSlideshowItem = useCallback((indexToRemove: number) => {
    setSlideshowItems(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);


  const handleContentChange = useCallback((
    pageKey: keyof Omit<AllContentData, 'home'> | 'homeFields' | 'servicesItems', 
    field: string, 
    value: string, 
    lang?: 'de' | 'en', 
    serviceSlug?: string
  ) => {
    switch (pageKey) {
      case 'homeFields':
        setHomeContent(prev => ({ ...prev, [field + (lang ? `_${lang}` : '')]: value }));
        break;
      case 'servicesPage':
        setServicesPageContent(prev => ({ ...prev, [field + (lang ? `_${lang}` : '')]: value }));
        break;
      case 'howItWorks':
        setHowItWorksContent(prev => ({ ...prev, [field + (lang ? `_${lang}` : '')]: value }));
        break;
      case 'contact':
        if (field === 'phoneInfoNumber' && !lang) {
             setContactContent(prev => ({ ...prev, [field]: value }));
        } else {
             setContactContent(prev => ({ ...prev, [field + (lang ? `_${lang}` : '')]: value }));
        }
        break;
      case 'servicesItems':
        if (serviceSlug && field) {
          let keyToUpdate: string;
          if (lang) { 
            const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1); 
            keyToUpdate = field + capitalizedLang; 
          } else { 
            keyToUpdate = field; 
          }
          setServicesItemsContent(prev => ({
            ...prev,
            [serviceSlug]: {
              ...(prev[serviceSlug] || {} as ServiceItemContentData),
              [keyToUpdate]: value
            } as ServiceItemContentData
          }));
        }
        break;
    }
  }, []);


  const handleSaveAllContent = async () => {
    setIsSaving(prev => ({ ...prev, AllContent: true }));
    const allData: AllContentData = {
      home: { ...homeContent, slideshowItems },
      servicesPage: servicesPageContent,
      servicesItems: servicesItemsContent,
      howItWorks: howItWorksContent,
      contact: contactContent,
    };
    const result = await saveContent(allData);
    if (result.success) {
      toast({
        title: 'All Content Saved',
        description: 'Website content has been updated.',
      });
    } else {
      toast({
        title: 'Error Saving Content',
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsSaving(prev => ({ ...prev, AllContent: false }));
  };
  
  const renderBilingualField = (
    sectionKey: 'homeFields' | 'servicesPage' | 'howItWorks' | 'contact' | 'servicesItems' | 'slideshowItem',
    fieldName: string, 
    label: string,
    isTextarea = false,
    itemKey?: string | number
  ) => {
    const idPrefix = `${sectionKey}-${itemKey || ''}-${fieldName}`;
    const idDe = `${idPrefix}-de`;
    const idEn = `${idPrefix}-en`;

    let valueDe: string = '';
    let valueEn: string = '';
    let onChangeDe: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    let onChangeEn: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

    if (sectionKey === 'slideshowItem' && typeof itemKey === 'number') {
      const slide = slideshowItems[itemKey];
      valueDe = (slide as any)[`${fieldName}_de`] || '';
      valueEn = (slide as any)[`${fieldName}_en`] || '';
      onChangeDe = (e) => handleSlideshowItemChange(itemKey, `${fieldName}_de` as keyof SlideContentData, e.target.value);
      onChangeEn = (e) => handleSlideshowItemChange(itemKey, `${fieldName}_en` as keyof SlideContentData, e.target.value);
    } else if (sectionKey === 'servicesItems' && typeof itemKey === 'string') {
        const itemContent = servicesItemsContent[itemKey];
        valueDe = (itemContent as any)[`${fieldName}De`] || '';
        valueEn = (itemContent as any)[`${fieldName}En`] || '';
        onChangeDe = (e) => handleContentChange(sectionKey, fieldName, e.target.value, 'de', itemKey);
        onChangeEn = (e) => handleContentChange(sectionKey, fieldName, e.target.value, 'en', itemKey);
    } else if (sectionKey === 'homeFields') {
        valueDe = (homeContent as any)[`${fieldName}_de`] || '';
        valueEn = (homeContent as any)[`${fieldName}_en`] || '';
        onChangeDe = (e) => handleContentChange(sectionKey, fieldName, e.target.value, 'de');
        onChangeEn = (e) => handleContentChange(sectionKey, fieldName, e.target.value, 'en');
    } else if (sectionKey === 'servicesPage') {
        valueDe = (servicesPageContent as any)[`${fieldName}_de`] || '';
        valueEn = (servicesPageContent as any)[`${fieldName}_en`] || '';
        onChangeDe = (e) => handleContentChange(sectionKey, fieldName, e.target.value, 'de');
        onChangeEn = (e) => handleContentChange(sectionKey, fieldName, e.target.value, 'en');
    } else if (sectionKey === 'howItWorks') {
        valueDe = (howItWorksContent as any)[`${fieldName}_de`] || '';
        valueEn = (howItWorksContent as any)[`${fieldName}_en`] || '';
        onChangeDe = (e) => handleContentChange(sectionKey, fieldName, e.target.value, 'de');
        onChangeEn = (e) => handleContentChange(sectionKey, fieldName, e.target.value, 'en');
    } else if (sectionKey === 'contact') {
        valueDe = (contactContent as any)[`${fieldName}_de`] || '';
        valueEn = (contactContent as any)[`${fieldName}_en`] || '';
        onChangeDe = (e) => handleContentChange(sectionKey, fieldName, e.target.value, 'de');
        onChangeEn = (e) => handleContentChange(sectionKey, fieldName, e.target.value, 'en');
    } else {
        return null;
    }
    
    return (
      <div key={idPrefix} className="space-y-4 py-2">
        <h4 className="font-medium col-span-full">{label}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <Label htmlFor={idDe}>Deutsch</Label>
            {isTextarea ? (
              <Textarea id={idDe} value={valueDe} onChange={onChangeDe} rows={fieldName.toLowerCase().includes('description') ? 5 : 3} className="w-full mt-1" />
            ) : (
              <Input id={idDe} value={valueDe} onChange={onChangeDe} className="w-full mt-1" />
            )}
          </div>
          <div>
            <Label htmlFor={idEn}>English</Label>
            {isTextarea ? (
              <Textarea id={idEn} value={valueEn} onChange={onChangeEn} rows={fieldName.toLowerCase().includes('description') ? 5 : 3} className="w-full mt-1" />
            ) : (
              <Input id={idEn} value={valueEn} onChange={onChangeEn} className="w-full mt-1" />
            )}
          </div>
        </div>
      </div>
    );
  };

   const renderSingleLanguageField = (
    sectionKey: 'contact' | 'servicesItems' | 'slideshowItem', 
    fieldName: string, 
    label: string,
    isTextarea = false,
    itemKey?: string | number 
    ) => {
    let value: string = '';
    let onChangeFunc: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

    const id = `${sectionKey}-${itemKey || ''}-${fieldName}`;

    if (sectionKey === 'slideshowItem' && typeof itemKey === 'number') {
        const slide = slideshowItems[itemKey];
        value = (slide as any)[fieldName] || '';
        onChangeFunc = (e) => handleSlideshowItemChange(itemKey, fieldName as keyof SlideContentData, e.target.value);
    } else if (sectionKey === 'contact') {
        value = (contactContent as any)[fieldName] || '';
        onChangeFunc = (e) => handleContentChange('contact', fieldName, e.target.value);
    } else if (sectionKey === 'servicesItems' && typeof itemKey === 'string') {
        const itemContent = servicesItemsContent[itemKey];
        value = (itemContent as any)?.[fieldName] || ''; 
        onChangeFunc = (e) => handleContentChange('servicesItems', fieldName, e.target.value, undefined, itemKey);
    } else {
        return null; 
    }
    
    return (
        <div key={id} className="space-y-2 py-2">
        <Label htmlFor={id}>{label}</Label>
        {isTextarea ? (
            <Textarea id={id} value={value} onChange={onChangeFunc} rows={3} className="w-full mt-1" />
        ) : (
            <Input id={id} value={value} onChange={onChangeFunc} className="w-full mt-1" />
        )}
        </div>
    );
  };

  if (authIsLoading || (!isAuthenticated && !authIsLoading)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (isLoadingContent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading content...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-5xl mx-auto"> 
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <Button variant="outline" onClick={logout} size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
          <CardDescription>Edit website content below. Changes will be saved to content.json.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="home" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
              <TabsTrigger value="home"><HomeIcon className="mr-2 h-4 w-4"/>Home</TabsTrigger>
              <TabsTrigger value="services"><Briefcase className="mr-2 h-4 w-4"/>Services</TabsTrigger>
              <TabsTrigger value="how-it-works"><SettingsIcon className="mr-2 h-4 w-4"/>How It Works</TabsTrigger>
              <TabsTrigger value="contact"><MailIcon className="mr-2 h-4 w-4"/>Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Home Page Content</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {renderBilingualField('homeFields', 'pageTitle', 'Page Title')}
                  {renderBilingualField('homeFields', 'pageDescription', 'Page Description', true)}
                  {renderBilingualField('homeFields', 'requestHelpButton', 'Request Help Button')}
                  {renderBilingualField('homeFields', 'learnMoreButton', 'Learn More Button')}
                  {renderBilingualField('homeFields', 'clubsTitle', 'Clubs Title')}
                  {renderBilingualField('homeFields', 'clubsDescription', 'Clubs Meta Description')}
                  {renderBilingualField('homeFields', 'clubsText', 'Clubs Text', true)}
                  {renderBilingualField('homeFields', 'individualsTitle', 'Individuals Title')}
                  {renderBilingualField('homeFields', 'individualsDescription', 'Individuals Meta Description')}
                  {renderBilingualField('homeFields', 'individualsText', 'Individuals Text', true)}
                  {renderBilingualField('homeFields', 'viewDetailsButton', 'View Details Button')}
                  {renderBilingualField('homeFields', 'howItWorksTitle', 'How It Works Title')}
                  {renderBilingualField('homeFields', 'howItWorksDescription', 'How It Works Description', true)}
                  {renderBilingualField('homeFields', 'howItWorksButton', 'How It Works Button')}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Homepage Slideshow <ImagesIcon className="inline-block ml-2 h-5 w-5"/></CardTitle>
                    <Button onClick={addSlideshowItem} size="sm" variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add Slide</Button>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full space-y-4">
                    {slideshowItems.map((slide, index) => (
                      <AccordionItem value={`slide-${slide.id || index}`} key={slide.id || index}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex justify-between items-center w-full pr-2">
                            <span>Slide {index + 1}: {slide.title_en || 'New Slide'}</span>
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={(e) => { e.stopPropagation(); removeSlideshowItem(index); }}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); removeSlideshowItem(index); }}}
                              className={cn(
                                buttonVariants({ variant: "ghost", size: "icon" }),
                                "hover:bg-destructive/10 text-destructive hover:text-destructive"
                              )}
                              aria-label="Remove slide"
                            >
                              <Trash2 className="h-4 w-4" />
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pl-2 border-l-2 ml-2">
                          {renderBilingualField('slideshowItem', 'title', 'Slide Title', false, index)}
                          {renderBilingualField('slideshowItem', 'description', 'Slide Description', true, index)}
                          {renderBilingualField('slideshowItem', 'altText', 'Image Alt Text', false, index)}
                          {renderBilingualField('slideshowItem', 'ctaText', 'CTA Button Text (Optional)', false, index)}
                          {renderSingleLanguageField('slideshowItem', 'imageUrl', 'Image URL', false, index)}
                          {renderSingleLanguageField('slideshowItem', 'imageHint', 'Image Hint (Keywords)', false, index)}
                          {renderSingleLanguageField('slideshowItem', 'ctaLink', 'CTA Link URL (Optional)', false, index)}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Services Page Meta Content</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {renderBilingualField('servicesPage', 'pageTitle', 'Page Title')}
                  {renderBilingualField('servicesPage', 'pageDescription', 'Page Description', true)}
                  {renderBilingualField('servicesPage', 'clubSectionTitle', 'Clubs Section Title')}
                  {renderBilingualField('servicesPage', 'clubSectionDescription', 'Clubs Section Description', true)}
                  {renderBilingualField('servicesPage', 'individualSectionTitle', 'Individuals Section Title')}
                  {renderBilingualField('servicesPage', 'individualSectionDescription', 'Individuals Section Description', true)}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader><CardTitle>Individual Services</CardTitle></CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {displayServices.map((serviceDef) => (
                      <AccordionItem value={`service-${serviceDef.slug}`} key={serviceDef.slug}>
                        <AccordionTrigger>{servicesItemsContent[serviceDef.slug]?.titleEn || serviceDef.titleEn} / {servicesItemsContent[serviceDef.slug]?.titleDe || serviceDef.titleDe}</AccordionTrigger>
                        <AccordionContent className="space-y-4 pl-2 border-l-2 ml-2">
                          {renderBilingualField('servicesItems', 'title', 'Service Title', false, serviceDef.slug)}
                          {renderBilingualField('servicesItems', 'description', 'Short Description', true, serviceDef.slug)}
                          {renderBilingualField('servicesItems', 'detailedDescription', 'Detailed Description (HTML)', true, serviceDef.slug)}
                          {renderSingleLanguageField('servicesItems', 'imageHint', 'Image Hint (Keywords for AI)', false, serviceDef.slug)}
                          {renderSingleLanguageField('servicesItems', 'imageUrl', 'Image URL (e.g., https://images.unsplash.com/... or https://picsum.photos/...)', false, serviceDef.slug)}
                           <p className="text-sm text-muted-foreground">Icon: {serviceDef.icon.props.className?.match(/lucide-\w+/)?.[0].replace('lucide-','') || 'Custom Icon'} (Defined in code, not editable here)</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="how-it-works" className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>How It Works Page Content</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {renderBilingualField('howItWorks', 'pageTitle', 'Page Title')}
                        {renderBilingualField('howItWorks', 'pageDescription', 'Page Description', true)}
                        {renderBilingualField('howItWorks', 'volunteerTitle', 'Volunteer Title')}
                        {renderBilingualField('howItWorks', 'volunteerDescription', 'Volunteer Description', true)}
                        {renderBilingualField('howItWorks', 'costTitle', 'Cost Title')}
                        {renderBilingualField('howItWorks', 'costDescription', 'Cost Description', true)}
                        {renderBilingualField('howItWorks', 'requestTitle', 'Request Help Title')}
                        {renderBilingualField('howItWorks', 'requestDescriptionPart1', 'Request Description Part 1')}
                        {renderBilingualField('howItWorks', 'requestDescriptionLink', 'Request Description Link Text')}
                        {renderBilingualField('howItWorks', 'requestDescriptionPart2', 'Request Description Part 2')}
                        {renderBilingualField('howItWorks', 'expectationTitle', 'Expectation Title')}
                        {renderBilingualField('howItWorks', 'expectationDescription', 'Expectation Description', true)}
                        {renderBilingualField('howItWorks', 'whoTitle', 'Who We Are Title')}
                        {renderBilingualField('howItWorks', 'whoDescription', 'Who We Are Description', true)}
                        {renderBilingualField('howItWorks', 'donationsTitle', 'Donations Title')}
                        {renderBilingualField('howItWorks', 'donationsDescription', 'Donations Description', true)}
                        {renderBilingualField('howItWorks', 'ctaTitle', 'CTA Title')}
                        {renderBilingualField('howItWorks', 'ctaDescription', 'CTA Description', true)}
                        {renderBilingualField('howItWorks', 'ctaButton', 'CTA Button Text')}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Contact Page Content</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {renderBilingualField('contact', 'pageTitle', 'Page Title')}
                        {renderBilingualField('contact', 'pageDescription', 'Page Description', true)}
                        {renderBilingualField('contact', 'formTitle', 'Form Title')}
                        {renderBilingualField('contact', 'alertTitle', 'Alert Title')}
                        {renderBilingualField('contact', 'alertDescription', 'Alert Description', true)}
                        {renderBilingualField('contact', 'nameLabel', 'Name Label')}
                        {renderBilingualField('contact', 'namePlaceholder', 'Name Placeholder')}
                        {renderBilingualField('contact', 'emailLabel', 'Email Label')}
                        {renderBilingualField('contact', 'emailPlaceholder', 'Email Placeholder')}
                        {renderBilingualField('contact', 'subjectLabel', 'Subject Label')}
                        {renderBilingualField('contact', 'subjectPlaceholder', 'Subject Placeholder')}
                        {renderBilingualField('contact', 'messageLabel', 'Message Label')}
                        {renderBilingualField('contact', 'messagePlaceholder', 'Message Placeholder')}
                        {renderBilingualField('contact', 'messageDescription', 'Message Description')}
                        {renderBilingualField('contact', 'techDetailsLabel', 'Tech Details Label')}
                        {renderBilingualField('contact', 'techDetailsPlaceholder', 'Tech Details Placeholder')}
                        {renderBilingualField('contact', 'techDetailsDescription', 'Tech Details Description')}
                        {renderBilingualField('contact', 'submitButton', 'Submit Button Text')}
                        {renderBilingualField('contact', 'directContactTitle', 'Direct Contact Title')}
                        {renderBilingualField('contact', 'emailInfoTitle', 'Email Info Title')}
                        {renderBilingualField('contact', 'emailInfoText', 'Email Info Text')}
                        {renderBilingualField('contact', 'emailInfoHint', 'Email Info Hint')}
                        {renderBilingualField('contact', 'phoneInfoTitle', 'Phone Info Title')}
                        {renderBilingualField('contact', 'phoneInfoText', 'Phone Info Text')}
                        {renderSingleLanguageField('contact', 'phoneInfoNumber', 'Phone Info Number')}
                    </CardContent>
                </Card>
            </TabsContent>

          </Tabs>
        </CardContent>
         <CardFooter className="mt-6 border-t pt-6">
            <Button onClick={handleSaveAllContent} disabled={isSaving['AllContent'] || isLoadingContent} size="lg">
              {isSaving['AllContent'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save All Changes
            </Button>
          </CardFooter>
      </Card>
    </div>
  );
}

