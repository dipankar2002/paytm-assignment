import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const RoundLoader = () => {
  return (
    <div className="flex justify-center">
      <div className="relative w-40 h-40">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-200 stroke-current"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="10"
          />
          <motion.circle
            className="text-blue-500 stroke-current"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="10"
            strokeDasharray="282.74"
            strokeDashoffset="282.74"
            strokeLinecap="round"
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
          />
        </svg>
      </div>
    </div>
  );
};

export default RoundLoader;
