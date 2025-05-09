
'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/context/language-context';

export default function HtmlLangUpdater() {
  const { language } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return null; // This component doesn't render anything visible
}
