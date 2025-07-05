import Image from "next/image";
import Button from "./Button";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";

export default function LoginForm() {
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
              <span className="text-blue-700 text-base font-normal leading-relaxed">Ainda não tem uma conta? </span>
              <button className="text-blue-700 text-base font-semibold leading-relaxed">Cadastre-se</button>
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <InputLabel htmlFor="username">Usuário</InputLabel>
            <TextInput id="username" type="text" placeholder="Usuário" />
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <InputLabel htmlFor="password">Senha</InputLabel>
            <div className="relative w-full">
              <TextInput id="password" type="password" placeholder="Senha" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 overflow-hidden">
                <Image src="/user-icon.svg" alt="password icon" layout="fill" />
              </button>
            </div>
          </div>
          <div className="self-stretch h-6 relative">
            <div className="left-[1px] top-0 absolute inline-flex justify-start items-center gap-2.5">
              <input type="checkbox" className="w-5 h-5 rounded-[4px] text-blue-700 border-gray-300 focus:ring-blue-700" />
              <label className="justify-start text-blue-700 text-base font-normal leading-relaxed">Lembrar de mim</label>
            </div>
          </div>
        </div>
        <Button className="w-full">
          Entrar
        </Button>
      </div>
    </>
  );
}