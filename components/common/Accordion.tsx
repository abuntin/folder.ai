import { Stack } from '@mui/system';
import { m, AnimatePresence } from 'framer-motion';

interface AccordionProps {
  expanded: boolean;
  flexDirection: 'row' | 'column';
  children: React.ReactNode[];
}

export const Accordion: React.FC<AccordionProps> = ({
  expanded,
  children,
  flexDirection,
  ...rest
}) => {
  // By using `AnimatePresence` to mount and unmount the contents, we can animate
  // them in and out while also only rendering the contents of open accordions
  return (
    <Stack direction={flexDirection ?? 'row'}>
      <m.div
        initial={false}
        animate={{
          backgroundColor: expanded ? 'transparent' : 'background.paper',
        }}
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}
      >
        {children[0]}
      </m.div>
      <AnimatePresence initial={false}>
        {expanded && (
          <m.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0, 0.71, 0.2, 1.01] }}
          >
            <Stack direction={flexDirection ?? 'row'}>
              {children.filter((child, i) => i !== 0)}
            </Stack>
          </m.div>
        )}
      </AnimatePresence>
    </Stack>
  );
};
