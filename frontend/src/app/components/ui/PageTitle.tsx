import React from 'react';

interface PageTitleProps {
  title: string;
  subtitle: string;
}

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <div className="w-full text-center justify-start text-blue-700 text-5xl font-semibold leading-[62px]">{title}</div>
      <div className="inline-flex justify-start items-start gap-4">
        <div className="flex justify-start items-center gap-1">
          <div className="justify-start text-blue-700 text-xs font-normal leading-tight">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
