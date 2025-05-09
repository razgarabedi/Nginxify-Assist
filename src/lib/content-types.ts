// src/lib/content-types.ts
import type { Service as ServiceDefinition } from '@/lib/services-data';

// Content for a single slide in the homepage slideshow
export interface SlideContentData {
  id: number; // or string, for keying and identification
  imageUrl: string;
  imageHint: string;
  altText_de: string;
  altText_en: string;
  title_de: string;
  title_en: string;
  description_de: string;
  description_en: string;
  ctaText_de?: string;
  ctaText_en?: string;
  ctaLink?: string;
}

// Content for the Home page
export interface HomeContentData {
  pageTitle_de: string;
  pageTitle_en: string;
  pageDescription_de: string;
  pageDescription_en: string;
  requestHelpButton_de: string;
  requestHelpButton_en: string;
  learnMoreButton_de: string;
  learnMoreButton_en: string;
  clubsTitle_de: string;
  clubsTitle_en: string;
  clubsDescription_de: string;
  clubsDescription_en: string;
  clubsText_de: string;
  clubsText_en: string;
  individualsTitle_de: string;
  individualsTitle_en: string;
  individualsDescription_de: string;
  individualsDescription_en: string;
  individualsText_de: string;
  individualsText_en: string;
  viewDetailsButton_de: string;
  viewDetailsButton_en: string;
  howItWorksTitle_de: string;
  howItWorksTitle_en: string;
  howItWorksDescription_de: string;
  howItWorksDescription_en: string;
  howItWorksButton_de: string;
  howItWorksButton_en: string;
  slideshowItems: SlideContentData[]; // Added for slideshow
}

// Content for the Services page (meta and section descriptions)
export interface ServicesPageData {
  pageTitle_de: string;
  pageTitle_en: string;
  pageDescription_de: string;
  pageDescription_en: string;
  clubSectionTitle_de: string;
  clubSectionTitle_en: string;
  clubSectionDescription_de: string;
  clubSectionDescription_en: string;
  individualSectionTitle_de: string;
  individualSectionTitle_en: string;
  individualSectionDescription_de: string;
  individualSectionDescription_en: string;
}

// Editable content for individual service items
// Slug is the key, icon is from ServiceDefinition
export type ServiceItemContentData = Omit<ServiceDefinition, 'icon' | 'category' | 'slug'>;

// Content for the How It Works page
export interface HowItWorksContentData {
  pageTitle_de: string;
  pageTitle_en: string;
  pageDescription_de: string;
  pageDescription_en: string;
  volunteerTitle_de: string;
  volunteerTitle_en: string;
  volunteerDescription_de: string;
  volunteerDescription_en: string;
  costTitle_de: string;
  costTitle_en: string;
  costDescription_de: string;
  costDescription_en: string;
  requestTitle_de: string;
  requestTitle_en: string;
  requestDescriptionPart1_de: string;
  requestDescriptionPart1_en: string;
  requestDescriptionLink_de: string;
  requestDescriptionLink_en: string;
  requestDescriptionPart2_de: string;
  requestDescriptionPart2_en: string;
  expectationTitle_de: string;
  expectationTitle_en: string;
  expectationDescription_de: string;
  expectationDescription_en: string;
  whoTitle_de: string;
  whoTitle_en: string;
  whoDescription_de: string;
  whoDescription_en: string;
  donationsTitle_de: string;
  donationsTitle_en: string;
  donationsDescription_de: string;
  donationsDescription_en: string;
  ctaTitle_de: string;
  ctaTitle_en: string;
  ctaDescription_de: string;
  ctaDescription_en: string;
  ctaButton_de: string;
  ctaButton_en: string;
}

// Content for the Contact page
export interface ContactContentData {
  pageTitle_de: string;
  pageTitle_en: string;
  pageDescription_de: string;
  pageDescription_en: string;
  formTitle_de: string;
  formTitle_en: string;
  alertTitle_de: string;
  alertTitle_en: string;
  alertDescription_de: string;
  alertDescription_en: string;
  nameLabel_de: string;
  nameLabel_en: string;
  namePlaceholder_de: string;
  namePlaceholder_en: string;
  emailLabel_de: string;
  emailLabel_en: string;
  emailPlaceholder_de: string;
  emailPlaceholder_en: string;
  subjectLabel_de: string;
  subjectLabel_en: string;
  subjectPlaceholder_de: string;
  subjectPlaceholder_en: string;
  messageLabel_de: string;
  messageLabel_en: string;
  messagePlaceholder_de: string;
  messagePlaceholder_en: string;
  messageDescription_de: string;
  messageDescription_en: string;
  techDetailsLabel_de: string;
  techDetailsLabel_en: string;
  techDetailsPlaceholder_de: string;
  techDetailsPlaceholder_en: string;
  techDetailsDescription_de: string;
  techDetailsDescription_en: string;
  submitButton_de: string;
  submitButton_en: string;
  directContactTitle_de: string;
  directContactTitle_en: string;
  emailInfoTitle_de: string;
  emailInfoTitle_en: string;
  emailInfoText_de: string;
  emailInfoText_en: string;
  emailInfoHint_de: string;
  emailInfoHint_en: string;
  phoneInfoTitle_de: string;
  phoneInfoTitle_en: string;
  phoneInfoText_de: string;
  phoneInfoText_en: string;
  phoneInfoNumber: string; // Single language for phone number
}

// Structure for the entire content.json file
export interface AllContentData {
  home: HomeContentData;
  servicesPage: ServicesPageData;
  servicesItems: Record<string, ServiceItemContentData>; // Keyed by service slug
  howItWorks: HowItWorksContentData;
  contact: ContactContentData;
}

// Represents a fully merged service item for display, including the icon
export type DisplayService = ServiceDefinition;
