import Image from "next/image";

interface PlanCardProps {
  title: string;
  features: string[];
  isSelected?: boolean;
  onClick?: () => void;
}

export default function PlanCard({
  title,
  features,
  isSelected = false,
  onClick,
}: PlanCardProps) {
  return (
    <div
      onClick={onClick}
      className={`w-96 px-8 pt-14 pb-8 relative bg-white rounded-xl shadow-[0px_1px_10px_0px_rgba(0,0,0,0.06)] flex flex-col gap-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
        isSelected ? "ring-2 ring-blue-600" : ""
      }`}
    >
      <div className="flex flex-col gap-14">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h3 className="text-blue-900 text-xl font-semibold font-inter leading-7">
              {title}
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Image
                  src="/checkmark-icon.svg"
                  alt="Check"
                  width={24}
                  height={24}
                />
                <div className="flex-1 text-blue-700 text-base font-normal font-inter leading-relaxed">
                  {feature}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
