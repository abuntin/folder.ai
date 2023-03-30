'use client' 
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { DividerGradient, DText } from 'components';
import { padding } from 'lib/constants';
import { Box, Unstable_Grid2 as Grid, useTheme } from '@mui/material';
import { margin } from 'lib/constants'
import React from 'react';

const navItems = {
  '/': {
    name: 'Dashboard',
    x: 0,
    y: 0,
    w: '64px',
  },
  '/newdeal': {
    name: 'Create New',
    x: 0,
    y: 0,
    w: '64px',
  },
};

function Logo() {
  return (
    <Link aria-label='DealAI' href='/'>
      <DText text='DealAI' variant='h6' fontWeight='medium' />
    </Link>
  )
}

const HeaderItem = ({ active, path, name, ...rest }) => {

  const [showLine, setShowLine] = React.useState(false);
  
  return (
    <Box onMouseEnter={e => setShowLine(true)} onMouseLeave={e => setShowLine(false)} {...rest}>
      <Link
          key={path}
          href={path}
          className={clsx(
            'transition-all hover:text-neutral-800 dark:hover:text-neutral-200 py-[5px] px-[10px]',
            'flex flex-col items-center justify-evenly'
          )}
      >
          <DText text={name} variant='body1' fontWeight={active ? 'medium' : 'light' } color={(active || showLine) ?  'white' : 'primary' } />
          <DividerGradient sx={{ mt: margin, width: margin * 40 }} active={active} hover={showLine} />
      </Link>
    </Box>
  )
}

interface HeaderProps {
    
} 

export const Header: React.FC<HeaderProps> = (props) => {

    const theme = useTheme();

    let pathname = usePathname() || '/';
    if (pathname.includes('/blog/')) {
        pathname = '/blog';
    }

    let entries = Object.entries(navItems);

    return (
        <Grid container spacing={2} sx={{ padding, backgroundColor: theme.palette.common.black }}>
            <Grid xs={2} display='flex' alignItems='start'>
                <Logo />
            </Grid>
            <Grid xs={10} container display='flex' alignItems='end'>
                {entries.map(([path, { name }], i) => {
                    const isActive = path === pathname;

                    return (
                        <Grid xs={12 / entries.length} key={i} display='flex' justifyContent='center' alignItems='center'>
                            <HeaderItem path={path} name={name} active={isActive} />
                        </Grid> 
                    
                    );
                })}
            </Grid>
            
        </Grid>
    )
}