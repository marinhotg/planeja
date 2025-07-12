"use client"

import Image from "next/image";
import Button from "./Button";
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <>
      <div className="self-stretch flex flex-col justify-start items-center gap-8">
        <div className="self-stretch flex flex-col justify-start items-center gap-6">
          <div className="w-14 h-14 relative">
            <Image src="/logo.png" alt="PlanEJA logo" width={56} height={56} />
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="self-stretch text-center justify-start text-blue-700 text-4xl font-semibold leading-10">Entrar</div>
            <div className="self-stretch text-center justify-start">
              <span className="text-blue-700 text-base font-normal leading-relaxed">Faça login com sua conta Google.</span>
            </div>
          </div>
        </div>
        <Button className="w-full" onClick={handleGoogleSignIn}>
          Entrar com Google
        </Button>
      </div>
    </>
  );
}
