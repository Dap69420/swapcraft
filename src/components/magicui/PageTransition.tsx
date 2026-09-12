import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PageTransitionProps {
  pageKey: string;
  children: React.ReactNode;
}

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const PageTransition: React.FC<PageTransitionProps> = ({ pageKey, children }) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pageKey}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.16, ease: 'easeOut' }}
        className="w-full flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
