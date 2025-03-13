"use client";
import { useState } from "react";
import { opponentComment } from "../images";
import { motion } from "framer-motion";

export const OpponentComment = ({
  comment,
  reaction,
  containerClassname,
}: {
  comment: string;
  reaction?: string;
  containerClassname?: string;
}) => {
  const [loading, setLoading] = useState(true);
  return (
    <div
      className={`${
        loading ? "w-[100px]" : "w-[180px]"
      } h-[45px] ${containerClassname}`}
    >
      <div
        className={"w-full h-full flex items-center justify-center p-2"}
        style={{
          backgroundImage: `url(${opponentComment.src})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {loading ? (
          <div className="flex gap-3">
            <motion.div
              className="border rounded-full border-[#004989] w-4 h-4"
              animate={{
                backgroundColor: ["#FFFFFF", "#D9D9D966", "#D9D9D966"],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                times: [0, 0.33, 0.66],
              }}
            />
            <motion.div
              className="border rounded-full border-[#004989] w-4 h-4"
              animate={{
                backgroundColor: ["#D9D9D966", "#FFFFFF", "#D9D9D966"],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                times: [0, 0.33, 0.66],
              }}
            />
            <motion.div
              className="border rounded-full border-[#004989] w-4 h-4"
              animate={{
                backgroundColor: ["#D9D9D966", "#D9D9D966", "#FFFFFF"],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                times: [0, 0.33, 0.66],
              }}
            />
          </div>
        ) : (
          <p className="font-[Roboto] text-[12px]">{comment}</p>
        )}
      </div>
      {reaction && <p>{reaction}</p>}
    </div>
  );
};
