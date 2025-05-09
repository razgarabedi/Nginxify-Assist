
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { AllContentData, ServiceItemContentData } from '@/lib/content-types';
import { allServices as initialServiceDefinitions } from '@/lib/services-data';
import { 
    getInitialHomeContent as getInitialHomeContentInternal, 
    getInitialSlideshowData as getInitialSlideshowDataInternal,
    getInitialServicesPageContent,
    getInitialHowItWorksContent,
    getInitialContactContent
} from '@/lib/default-content-getters';


const contentFilePath = path.join(process.cwd(), 'src', 'data', 'content.json');

function getDefaultContent(): AllContentData {
  const servicesItems: Record<string, ServiceItemContentData> = {};
  initialServiceDefinitions.forEach(serviceDef => {
    const { icon, slug, category, ...textContent } = serviceDef;
    servicesItems[slug] = textContent;
  });

  return {
    home: getInitialHomeContentInternal(),
    servicesPage: getInitialServicesPageContent(),
    servicesItems,
    howItWorks: getInitialHowItWorksContent(),
    contact: getInitialContactContent(),
  };
}

export async function getContent(): Promise<AllContentData> {
  try {
    await fs.access(contentFilePath); // Check if file exists
    const fileContent = await fs.readFile(contentFilePath, 'utf-8');
    const jsonData = JSON.parse(fileContent) as AllContentData;
    // Basic validation: check if top-level keys exist and home has slideshowItems
    if (jsonData && jsonData.home && jsonData.home.slideshowItems && jsonData.servicesPage && jsonData.servicesItems && jsonData.howItWorks && jsonData.contact) {
      // Ensure slideshowItems is an array, otherwise fallback
      if (!Array.isArray(jsonData.home.slideshowItems)) {
        console.warn('Home content slideshowItems is not an array, using default slideshow content from internal getter.');
        jsonData.home.slideshowItems = getInitialSlideshowDataInternal(); 
      }
      return jsonData;
    }
    console.warn('Content file is missing some keys or slideshowItems, returning default content.');
    return getDefaultContent();
  } catch (error) {
    // If file doesn't exist or is invalid JSON, return default content
    console.warn(`Error reading content file (${contentFilePath}), returning default content. Error: ${error}`);
    const defaultContent = getDefaultContent();
    // Attempt to save the default content to create the file
    try {
      await fs.mkdir(path.dirname(contentFilePath), { recursive: true });
      await fs.writeFile(contentFilePath, JSON.stringify(defaultContent, null, 2), 'utf-8');
      console.log('Default content.json created.');
    } catch (saveError) {
      console.error('Failed to create default content.json:', saveError);
    }
    return defaultContent;
  }
}

export async function saveContent(data: AllContentData): Promise<{ success: boolean; message: string }> {
  try {
    // Ensure the data directory exists (though src/data should already exist)
    await fs.mkdir(path.dirname(contentFilePath), { recursive: true });
    await fs.writeFile(contentFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true, message: 'Content saved successfully.' };
  } catch (error) {
    console.error('Failed to save content:', error);
    return { success: false, message: `Failed to save content: ${(error as Error).message}` };
  }
}

// Note: The export of getInitialHomeData and getInitialSlideshowData for client-side admin dashboard use
// has been removed from here. The dashboard will import them from `src/lib/default-content-getters.ts`.
// These internal versions are still used by `getDefaultContent()` within this server actions file.
