import React from 'react';
import { motion } from 'framer-motion';

const Sugarcane = ({ x, y, rotate, scale }: { x: number, y: number, rotate: number, scale: number }) => (
  <motion.div
    className="absolute bg-green-500 rounded-full"
    style={{
      x: `${x}vw`,
      y: `${y}vh`,
      rotate: `${rotate}deg`,
      scale: scale,
      width: '10px',   // Adjust as needed
      height: '50px',  // Adjust as needed
      borderRadius: '5px', // Make it rounded
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, y: `${y + 2}vh` }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    }}
  />
);

const AnimatedSugarcane = () => {
  return (
    <>
      <Sugarcane x={10} y={20} rotate={15} scale={0.8} />
      <Sugarcane x={30} y={30} rotate={-20} scale={0.6} />
      <Sugarcane x={50} y={10} rotate={10} scale={0.7} />
      <Sugarcane x={70} y={25} rotate={-15} scale={0.9} />
      <Sugarcane x={85} y={35} rotate={20} scale={0.5} />
    </>
  );
};

export default AnimatedSugarcane;