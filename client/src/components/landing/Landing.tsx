"use client";

import { motion } from "motion/react";
import React from "react";
import { AuroraBackground } from "@/components/aurorabackground";
import { useRouter } from "next/navigation";

export function Landing() {
  const router = useRouter();
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Discover, Collect & Trade NFTs
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          Your gateway to the future of digital art
        </div>
        <button onClick={() => router.push("/collection")} className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2 hover:cursor-pointer">
          Explore Collection
        </button>
      </motion.div>
    </AuroraBackground>
  );
}
