import { useTheme } from "@mui/material";
import { m, LazyMotion, domAnimation, MotionProps } from "framer-motion";
import { borderRadius } from "lib/constants";

interface AnimationProps extends MotionProps {}

export const AnimationWrapper = ({ children }) => (
  <LazyMotion features={domAnimation}>{children}</LazyMotion>
);

export const NavAnimation: React.FC<AnimationProps> = ({
  children,
  ...rest
}) => (
  <m.div
    initial={{ opacity: 0, x: "100%" }}
    animate={{ opacity: 1, x: "0%" }}
    exit={{ opacity: 0, x: "-100%" }}
    transition={{
      duration: 0.1,
      ease: [0, 0.71, 0.2, 1.01],
      x: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        restDelta: 0.001,
      },
    }}
    {...rest}
  >
    {children}
  </m.div>
);

export const PanDownAnimation: React.FC<AnimationProps> = ({
  children,
  ...rest
}) => (
  <m.div
    initial={{ opacity: 0, y: "-100%" }}
    animate={{ opacity: 1, y: "0%" }}
    transition={{
      duration: 0.3,
      ease: [0, 0.71, 0.2, 1.01],
      y: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        restDelta: 0.001,
      },
    }}
    {...rest}
  >
    {children}
  </m.div>
);

export const HoverAnimation: React.FC<AnimationProps> = ({
  children,
  ...rest
}) => (
  <m.div
    initial={false}
    whileHover={{
      scale: 1.01,
      transition: { duration: 0.2 },
    }}
    whileTap={{ scale: 0.99 }}
    {...rest}
  >
    {children}
  </m.div>
);

export const RotateAnimation: React.FC<AnimationProps> = ({
  children,
  ...rest
}) => (
  <m.div
    initial={{ rotate: 0 }}
    animate={{ rotate: 360 }}
    transition={{
      duration: 0.5,
      repeat: Infinity,
    }}
    {...rest}
  >
    {children}
  </m.div>
);

export const AppearAnimationParent: React.FC<AnimationProps> = ({
  children,
  ...rest
}) => (
  <m.div
    initial="hidden"
    animate="visible"
    variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
    {...rest}
  >
    {children}
  </m.div>
);

export const AppearAnimationChild: React.FC<AnimationProps> = ({
  children,
  ...rest
}) => (
  <m.div
    variants={{
      visible: { opacity: 1, x: 0 },
      hidden: { opacity: 1, x: -100 },
    }}
    {...rest}
  >
    {children}
  </m.div>
);

export const BlinkAnimation: React.FC<AnimationProps> = ({
  children,
  ...rest
}) => (
  <m.div
    initial={{ opacity: 0.9 }}
    animate={{ opacity: 0.2 }}
    exit={{ opacity: 0.9 }}
    transition={{
      opacity: {
        type: "tween",
        duration: 1.5,
        damping: 10,
        repeat: Infinity,
        ease: [0.36, 0, 0.66, -0.56]
      },
    }}
  >
    {children}
  </m.div>
);


export const FolderAnimation: React.FC<AnimationProps> = ({
  children,
  ...rest
}) => {

  const theme = useTheme()

  return (
  <m.div
    style={{ borderRadius }}
    initial={{ opacity: 1, backgroundColor: 'transparent' }}
    whileHover={{ transition: { duration: 0.2, ease: [0, 0.71, 0.2, 1.01], } }}
    drag
    dragSnapToOrigin
    {...rest}
  >
      {children}
    </m.div>

  )
}