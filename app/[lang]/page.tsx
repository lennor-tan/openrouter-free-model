import React from 'react';
import { getTranslations } from 'next-intl/server';
import { ModelView } from '@/components/model-view';
import { ModelsResponse } from '@/types';
import { unstable_noStore as noStore } from 'next/cache';

async function getModels(): Promise<ModelsResponse> {
  noStore();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/models`);

  if (!res.ok) {
    throw new Error('Failed to fetch models');
  }
  return res.json();
}

export default async function Home() {
  const t = await getTranslations('HomePage');
  const initialData = await getModels();

  return <ModelView initialData={initialData} />;
}
