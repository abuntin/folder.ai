import { m, LazyMotion, domMax, MotionProps } from 'framer-motion'


interface AnimationProps extends MotionProps {

}

export const AnimationWrapper = ({ children }) =>(
    <LazyMotion features={domMax}>
        {children}
    </LazyMotion>
)


export const NavAnimation: React.FC<AnimationProps> = ({ children, ...rest }) => (
    <m.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: '0%' }}
        exit={{ opacity: 0, x: '-100%'}}
        transition={{
            duration: 0.1,
            ease: [0, 0.71, 0.2, 1.01],
            x: {
                type: 'spring',
                damping: 10,
                stiffness: 100,
                restDelta: 0.001
            }
        }}
        {...rest}
    >
        {children}
    </m.div>
)

export const AppearAnimation: React.FC<AnimationProps> = ({ children, ...rest }) => (
    <m.div
        initial={{ opacity: 0, y: '-100%' }}
        animate={{ opacity: 1, y: '0%' }}
        transition={{
            duration: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
            y: {
                type: "spring",
                damping: 10,
                stiffness: 100,
                restDelta: 0.001
            }
        }}
        {...rest}
    >
        {children}
    </m.div>
)