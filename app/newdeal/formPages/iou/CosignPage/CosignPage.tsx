"use client";

import { FormControlLabel, Unstable_Grid2 as Grid } from "@mui/material";
import { margin } from "lib/constants";
import { key, keys, headings, labels } from "./text";
import { PanDownAnimation, DText, DCheckbox, DInput } from "components";
import * as React from "react";
import { useNewDealDispatch, useNewDealSelector } from "../..";
import { capitalise } from "lib/functions";

interface CosignPageProps {}

const { heading, subheading, info } = headings;
const { name: nameKey, address: addressKey, city: cityKey } = keys;
const { name: nameLabel, address: addressLabel } = labels;

export const CosignPage: React.FC<CosignPageProps> = () => {
  const { [key]: state } = useNewDealSelector((state) => state);

  const dispatch = useNewDealDispatch();

  const [fields, setFields] = React.useState(state);

  const { isCosigned, name, address, city } = fields;

  const handleChange = (e: any, field: string, newVal?: boolean) => {
    const newFields = { ...fields, [field]: newVal ?? e.target.value };
    setFields(newFields);
    dispatch({ [key]: newFields });
  };

  return (
    <Grid container spacing={4} direction="column">
      {heading !== "" && (
        <Grid xs>
          <DText text={heading} variant="h5" />
        </Grid>
      )}
      <Grid xs>
        <FormControlLabel
          control={
            <DCheckbox
              value={isCosigned}
              onChange={(e) => handleChange(e, "isCosigned", e.target.checked)}
            />
          }
          label={<DText text={subheading} variant="body1" />}
          labelPlacement="end"
        />
      </Grid>
      <Grid xs>
        {isCosigned && (
          <PanDownAnimation>
            <Grid container spacing={4} direction="column">
              <Grid xs>
                <DText text={nameLabel} variant="body2" />
              </Grid>
              <Grid xs>
                <DInput
                  placeholder={capitalise(nameKey)}
                  value={name}
                  onChange={(e) => handleChange(e, nameKey)}
                />
              </Grid>
              <Grid xs>
                <DText text={addressLabel} variant="body2" />
              </Grid>
              <Grid xs>
                <DInput
                  placeholder={`${capitalise(addressKey)} & Postcode`}
                  value={address}
                  onChange={(e) => handleChange(e, addressKey)}
                />
              </Grid>
              <Grid xs>
                <DInput
                  placeholder={capitalise(cityKey)}
                  value={city}
                  onChange={(e) => handleChange(e, cityKey)}
                />
              </Grid>
            </Grid>
          </PanDownAnimation>
        )}
      </Grid>
      <Grid xs>
        <DText text={info} variant="caption" />
      </Grid>
    </Grid>
  );
};
