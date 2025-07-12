"use client";

import dynamic from 'next/dynamic';

const DynamicNewClassProfileForm = dynamic(() => import('../components/ui/NewClassProfileForm'), { ssr: false });

export default function NewClassProfileClientPage() {
  return <DynamicNewClassProfileForm />;
}
