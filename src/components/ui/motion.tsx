import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface MotionProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
}

export const FadeIn = ({ children, className, delay = 0, duration = 0.5, ...props }: MotionProps) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration, delay, ease: "easeOut" }}
        className={className}
        {...props}
    >
        {children}
    </motion.div>
);

export const SlideIn = ({
    children,
    className,
    delay = 0,
    duration = 0.5,
    direction = "up",
    ...props
}: MotionProps & { direction?: "up" | "down" | "left" | "right" }) => {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
            x: direction === "left" ? 20 : direction === "right" ? -20 : 0
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: { duration, delay, ease: "easeOut" }
        }
    } as const;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const ScaleIn = ({ children, className, delay = 0, duration = 0.3, ...props }: MotionProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration, delay, type: "spring", stiffness: 300, damping: 30 }}
        className={className}
        {...props}
    >
        {children}
    </motion.div>
);

export const StaggerContainer = ({ children, className, delay = 0, staggerChildren = 0.1, ...props }: MotionProps & { staggerChildren?: number }) => (
    <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    delayChildren: delay,
                    staggerChildren
                }
            }
        }}
        className={className}
        {...props}
    >
        {children}
    </motion.div>
);
