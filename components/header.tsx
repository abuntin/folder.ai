'use client';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ColorModeContext } from './app';
import { DText } from './common';
import { borderRadius, padding } from 'lib/constants';
import {
  Box,
  IconButton,
  Unstable_Grid2 as Grid,
  useTheme,
} from '@mui/material';
import { margin } from 'lib/constants';
import React from 'react';
import { Brightness7, Brightness4 } from '@mui/icons-material';
import { m } from 'framer-motion';
import Image from 'next/image';
import logo from 'public/logo_transparent.svg';

const navItems = {
  '/': {
    name: 'My Directory',
  },
  '/query': {
    name: 'Query by FolderAI',
  },
  '/subscription': {
    name: 'Account',
  },
  '/settings': {
    name: 'Settings',
  },
};

function ToggleThemeMode() {
  const { mode, toggleColorMode } = React.useContext(ColorModeContext);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.primary',
        borderRadius: 1,
        p: 3,
      }}
    >
      <IconButton
        sx={{ ml: 1 }}
        onClick={toggleColorMode.toggle}
        color="inherit"
      >
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Box>
  );
}

function Logo() {
  return (
    <Link aria-label="FolderAI" href="/">
      <Image src={logo} alt="FolderAI" width={110} height={110} />
    </Link>
  );
}

const HeaderItem = ({ active, path, name, ...rest }) => {
  const [hover, setHover] = React.useState(false);

  const theme = useTheme();

  return (
    <Box
      onMouseEnter={e => setHover(true)}
      onMouseLeave={e => setHover(false)}
      {...rest}
    >
      <Link
        onClick={e => { if (!path.includes('query') || path.length > 1) { e.preventDefault(); return } }}
        key={path}
        href={path}
        className={clsx(
          'transition-all hover:text-neutral-800 dark:hover:text-neutral-200 py-[5px] px-[10px]',
          'flex flex-col items-center justify-evenly'
        )}
      >
        <m.div
          initial="false"
          animate="enter"
          transition={{ ease: 'easeInOut' }}
          aria-label="Current Directory"
          whileHover={{
            scale: 1.05,
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:
              active || hover ? theme.palette.background.paper : 'transparent',
            borderRadius: borderRadius * 3,
            paddingLeft: padding * 10,
            paddingRight: padding * 10,
            paddingTop: padding * 5,
            paddingBottom: padding * 5,
          }}
        >
          <DText
            text={name}
            variant="body1"
            fontWeight={active ? 'medium' : 'light'}
            color={active || hover ? 'text.disabled' : 'text.primary'}
          />
        </m.div>
      </Link>
    </Box>
  );
};

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = props => {
  let pathname = usePathname() || '/';
  if (pathname.includes('/blog/')) {
    pathname = '/blog';
  }

  let entries = Object.entries(navItems);

  return (
    <Box
      sx={{
        padding,
      }}
    >
      <Grid container>
        <Grid xs={2} display="flex" alignItems="center">
          <Logo />
        </Grid>
        <Grid xs={8} container>
          {entries.map(([path, { name }], i) => {
            const isActive = path === pathname;

            return (
              <Grid
                xs={12 / entries.length}
                key={i}
                display="flex"
                alignItems="center"
              >
                <HeaderItem path={path} name={name} active={isActive} />
              </Grid>
            );
          })}
        </Grid>
        <Grid xs={2}>
          <ToggleThemeMode />
        </Grid>
      </Grid>
    </Box>
  );
};
