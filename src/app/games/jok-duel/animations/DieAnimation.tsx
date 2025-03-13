import Image from "next/image";
import { useEffect, useState } from "react";
import { dieFrames } from "./allFrames";

interface DieAnimationProps {
  isPlaying: boolean;
}

const DieAnimation: React.FC<DieAnimationProps> = ({ isPlaying }) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    if (isPlaying && dieFrames.length > 0) {
      let frameIndex = 0;
      const interval = setInterval(() => {
        setCurrentFrame(frameIndex);
        frameIndex++;

        if (frameIndex >= dieFrames.length) {
          clearInterval(interval);
          setCurrentFrame(14);
        }
      }, 110);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="flex items-center justify-center w-[276px] h-[276px] absolute transform -translate-x-1/2 left-1/2 translate-y-[80%]">
      <Image
        src={dieFrames[currentFrame]}
        alt="Die animation"
        className="w-full h-auto object-contain"
      />
    </div>
  );
};

export default DieAnimation;
