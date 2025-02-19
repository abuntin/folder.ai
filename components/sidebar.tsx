"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { DText } from "components";

const navItems = {
  "/": {
    name: "Dashboard",
    x: 0,
    y: 0,
    w: "64px",
  },
  "/newdeal": {
    name: "Create New",
    x: 0,
    y: 0,
    w: "64px",
  },
};

function Logo() {
  return (
    <Link aria-label="DealAI" href="/">
      <DText text="DealAI" variant="h6" fontWeight="medium" />
    </Link>
  );
}
// function Logo() {
//   return (
//     <Link aria-label="DealAI" href="/">
//       <motion.svg
//         className="text-black dark:text-white h-[25px] md:h-[37px]"
//         width="25"
//         height="37"
//         viewBox="0 0 232 316"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//      >
//         <motion.path
//           initial={{
//             opacity: 0,
//             pathLength: 0,
//           }}
//           animate={{
//             opacity: 1,
//             pathLength: 1,
//           }}
//           transition={{
//             duration: 0.5,
//             type: 'spring',
//             stiffness: 50,
//           }}
//           d="M39 316V0"
//           stroke="currentColor"
//           strokeWidth={78}
//         />
//         <motion.path
//           initial={{ x: -200, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{
//             duration: 0.5,
//             type: 'spring',
//             stiffness: 50,
//           }}
//           d="M232 314.998H129.852L232 232.887V314.998Z"
//           fill="currentColor"
//         />
//       </motion.svg>
//     </Link>
//   );
// }

export default function Navbar() {
  let pathname = usePathname() || "/";
  if (pathname.includes("/blog/")) {
    pathname = "/blog";
  }

  return (
    <aside className="sticky top-0 bg-black md:w-[150px] md:flex-shrink-0 -mx-4 md:mx-0 md:px-0 font-serif">
      <div className="md:sticky md:top-10 lg:sticky lg:top-20">
        <div className="ml-2 md:ml-[12px] mb-2 px-4 md:px-0 md:mb-8 space-y-10 flex flex-row md:flex-row items-start ">
          <Logo />
        </div>
        <nav className="flex flex-row" id="nav">
          <div className="flex flex-row">
            {Object.entries(navItems).map(([path, { name }]) => {
              const isActive = path === pathname;

              return (
                <Link
                  key={path}
                  href={path}
                  className={clsx(
                    "transition-all hover:text-neutral-800 hover:underline hover:underline-offset-2 dark:hover:text-neutral-200 py-[5px] px-[10px]"
                  )}
                >
                  <DText
                    text={name}
                    variant="body1"
                    fontWeight={isActive ? "regular" : "light"}
                    color={isActive ? "white" : "primary"}
                  />
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
