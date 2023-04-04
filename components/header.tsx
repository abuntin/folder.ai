"use client";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { DividerGradient, DText, ColorModeContext } from "components";
import { padding } from "lib/constants";
import {
  Box,
  IconButton,
  Unstable_Grid2 as Grid,
  useTheme,
} from "@mui/material";
import { margin } from "lib/constants";
import React from "react";
import { Brightness7, Brightness4 } from "@mui/icons-material";
import Image from "next/image";
import logo from "public/logo_transparent.png";

const navItems = {
  "/": {
    name: "Dashboard",
  },
  "/newdeal": {
    name: "Create New",
  },
  "/editor": {
    name: "Editor",
  },
};

function ToggleThemeMode() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        color: "text.primary",
        borderRadius: 1,
        p: 3,
      }}
    >
      <IconButton
        sx={{ ml: 1 }}
        onClick={colorMode.toggleColorMode}
        color="inherit"
      >
        {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Box>
  );
}

function Logo() {
  return (
    <Link aria-label="Folder.AI" href="/">
      <Image src={logo} alt="Folder.AI" width={125} height={125} />
    </Link>
  );
}

const HeaderItem = ({ active, path, name, ...rest }) => {
  const [showLine, setShowLine] = React.useState(false);

  return (
    <Box
      onMouseEnter={(e) => setShowLine(true)}
      onMouseLeave={(e) => setShowLine(false)}
      {...rest}
    >
      <Link
        key={path}
        href={path}
        className={clsx(
          "transition-all hover:text-neutral-800 dark:hover:text-neutral-200 py-[5px] px-[10px]",
          "flex flex-col items-center justify-evenly"
        )}
      >
        <DText
          text={name}
          variant="body1"
          fontWeight={active ? "medium" : "light"}
          color={active || showLine ? "text.disabled" : "text.primary"}
        />
        <DividerGradient
          sx={{ mt: margin, width: margin * 40 }}
          active={active}
          hover={showLine}
        />
      </Link>
    </Box>
  );
};

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = (props) => {
  let pathname = usePathname() || "/";
  if (pathname.includes("/blog/")) {
    pathname = "/blog";
  }

  let entries = Object.entries(navItems);

  return (
    <Box
      sx={{
        padding,
        // position: "sticky",
        // top: 0,
        // zIndex: 1,
      }}
    >
      <Grid container spacing={2}>
        <Grid xs={2}>
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
