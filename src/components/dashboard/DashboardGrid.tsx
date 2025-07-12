import { motion, type Variants } from "framer-motion";
import React from "react";

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { ease: "easeOut", duration: 0.3 } },
};

interface DashboardGridProps {
  children: React.ReactNode;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ children }) => {
  return (
    <motion.div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={gridVariants}
      initial="hidden"
      animate="show"
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
};

export default DashboardGrid;
