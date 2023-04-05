"use client";

import * as React from "react";
import { BlinkAnimation } from "components";
import Image from "next/image";
import logo from "public/logo_transparent.png";
import { DText } from "./DText";

interface LoadingComponentProps {}

export const LoadingComponent: React.FC<LoadingComponentProps> = (props) => {

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
        <Image
          alt="Folder.AI Loading"
          src={logo}
          width={250}
          height={250}
        />
        <DText
          text="Loading..."
          fontWeight="medium"
          fontSize={24}
          textAlign="center"
          color={theme => theme.palette.common.white}
        />
      </BlinkAnimation>
    </div>
  );
};
