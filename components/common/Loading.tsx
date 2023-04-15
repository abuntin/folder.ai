"use client";

import * as React from "react";
import { BlinkAnimation, useDashboard } from "components";
import Image from "next/image";
import logo from "public/logo_transparent.png";
import { DText } from "../common/DText";

interface LoadingComponentProps {
  text?: string
}

export const LoadingComponent: React.FC<LoadingComponentProps> = ({ text }) => {

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <BlinkAnimation>
        <Image alt="Folder.AI Loading" src={logo} width={250} height={250} />
      </BlinkAnimation>
      {/* <DText
          text={text ?? 'Loading...'}
          fontWeight="medium"
          fontSize={24}
          textAlign="center"
          color={(theme) => theme.palette.common.white}
          sx={{ opacity: 0.5 }}
        /> */}
    </div>
  );
};
