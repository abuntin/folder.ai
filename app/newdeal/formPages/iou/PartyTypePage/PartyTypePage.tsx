"use client";

import { Unstable_Grid2 as Grid, RadioGroup } from "@mui/material";
import { margin } from "lib/constants";
import { key, headings } from "./text";
import { DText, OptionLabel } from "components";
import * as React from "react";
import { useNewDealDispatch, useNewDealSelector } from "../..";
import { FormOptionType, LoanPartyType } from "lib/types";
import { capitalise } from "lib/functions";

interface PartyTypePageProps {}

const { heading, subheading } = headings;

export const PartyTypePage: React.FC<PartyTypePageProps> = () => {
  const {
    [key]: state,
    primaryPartyPage: { name },
  } = useNewDealSelector((state) => state);

  const [selected, setSelected] = React.useState(state);

  const dispatch = useNewDealDispatch();

  const handleChange = (e: any, option: LoanPartyType) => {
    setSelected(option);
    dispatch({ [key]: option });
  };

  return (
    <Grid container spacing={4} direction="column">
      <Grid xs>
        <DText
          text={name === "" ? heading : `${name} is the...`}
          variant="h5"
        />
      </Grid>
      {subheading !== "" && (
        <Grid xs sx={{ mb: margin }}>
          <DText text={subheading} variant="body1" />
        </Grid>
      )}
      <Grid xs>
        <RadioGroup onChange={handleChange}>
          {["lender", "borrower"].map((option, i) => {
            return (
              // TODO: Add tooltips to options via option.description
              <OptionLabel
                option={{ value: option, label: capitalise(option) }}
              />
            );
          })}
        </RadioGroup>
      </Grid>
    </Grid>
  );
};
