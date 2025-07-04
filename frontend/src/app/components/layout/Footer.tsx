import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full py-8 bg-sky-100 flex justify-center items-center">
      <Image src="/logo.png" alt="PlanEJA logo" width={80} height={29} />
    </footer>
  );
}