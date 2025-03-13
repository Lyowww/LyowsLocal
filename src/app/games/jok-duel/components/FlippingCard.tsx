import { StaticImageData } from "next/image";
import { useState } from "react";
import Image from "next/image";
import { closedCard } from "../images";

interface FlippingCardProps {
  backSrc: StaticImageData;
  position: string;
  canFlip: boolean;
}

export const FlippingCard = ({
  backSrc,
  position,
  canFlip,
}: FlippingCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-[88px] h-[111px] cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => canFlip && setIsFlipped(!isFlipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-[1000ms] ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped
            ? "rotateY(180deg) scale(1.1) " +
              (position == "first"
                ? "translateY(-255%) translateX(-35%)"
                : position == "second"
                ? "translateY(-255%) translateX(78%)"
                : "translateY(-255%) translateX(188%)")
            : "translateY(0) rotateY(0deg) scale(1)",
          transition: "transform 1s cubic-bezier(0.32, 1.25, 0.375, 1.15)",
        }}
      >
        <div
          className="absolute w-full h-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Image src={closedCard} alt="Front Side" width={88} height={111} />
        </div>

        <div
          className="absolute w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Image src={backSrc} alt="Back Side" width={88} height={111} />
        </div>
      </div>
    </div>
  );
};
