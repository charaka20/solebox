import { motion } from "motion/react";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
}

export default function ScrollReveal({ children }: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.8, ease: [0.21, 1.02, 0.43, 1.01] }}
    >
      {children}
    </motion.div>
  );
}
