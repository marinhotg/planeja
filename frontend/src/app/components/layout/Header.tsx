import Image from "next/image";

export default function Header() {
  return (
    <div className="w-full h-16 bg-blue-700 border-b border-white/0">
      <div className="w-full max-w-[1336px] h-9 mx-auto px-[52px] pt-4">
        <div className="flex justify-between items-center h-full">
          <Image src="/menu-icon.svg" alt="Menu" width={28} height={28} />

          <div className="text-center text-white text-3xl font-bold font-inter">
            PlanEJA
          </div>

          <div className="flex gap-5">
            <Image src="/search-icon.svg" alt="Search" width={28} height={28} />
            <Image src="/user-icon.svg" alt="User" width={28} height={28} />
          </div>
        </div>
      </div>
    </div>
  );
}
