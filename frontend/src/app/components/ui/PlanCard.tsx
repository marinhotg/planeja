import Image from "next/image";
import React from 'react';

interface PlanCardProps {
  id: number;
  title: string;
  subtitle: string;
  onView: (id: number) => void;
  onDownload: (id: number) => void;
  onDelete: (id: number) => void;
  onFavorite: (id: number) => void;
  favorited: boolean;
}

export default function PlanCard({
  id,
  title,
  subtitle,
  onView,
  onDownload,
  onDelete,
  onFavorite,
  favorited,
}: PlanCardProps) {
  return (
    <div className="flex flex-col justify-between w-full p-6 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-blue-700 items-center gap-4 overflow-hidden">
      <div className="self-stretch flex flex-col justify-center items-center gap-6">
        <div className="self-stretch flex flex-col justify-start items-center gap-4">
          <div className="flex flex-col justify-start items-center gap-1">
            <div className="text-center justify-start text-blue-700 text-lg font-semibold leading-loose">{title}</div>
            <div className="text-center justify-start text-blue-700 text-sm font-normal leading-snug">{subtitle}</div>
          </div>
        </div>
        <div className="inline-flex justify-center items-start gap-6">
          <div className="flex justify-start items-start gap-4">
            <button onClick={() => onView(id)} className="w-9 h-9 relative bg-sky-100 rounded-[100px] flex justify-center items-center cursor-pointer hover:bg-sky-200">
              <Image src="/eye.svg" alt="Visualizar" width={16} height={16} />
            </button>
            <button onClick={() => onDownload(id)} className="w-9 h-9 relative bg-sky-100 rounded-[100px] flex justify-center items-center cursor-pointer hover:bg-sky-200">
              <Image src="/download.svg" alt="Baixar" width={16} height={16} />
            </button>
            <button onClick={() => onDelete(id)} className="w-9 h-9 relative bg-sky-100 rounded-[100px] flex justify-center items-center cursor-pointer hover:bg-sky-200">
              <Image src="/trash.svg" alt="Deletar" width={16} height={16} />
            </button>
            <button onClick={() => onFavorite(id)} className="w-9 h-9 relative bg-sky-100 rounded-[100px] flex justify-center items-center cursor-pointer hover:bg-sky-200">
              <Image src={favorited ? "/filled-heart.svg" : "/heart.svg"} alt="Favoritar" width={16} height={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
