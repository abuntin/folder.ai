"use client";

import { Unstable_Grid2 as Grid, InputAdornment } from "@mui/material";
import { margin } from "lib/constants";
import { key, keys, headings, labels } from "./text";
import {
  DText,
  DAutocomplete,
  DInput,
  PanDownAnimation,
  CurrencySelect,
} from "components";
import * as React from "react";
import { useNewDealDispatch, useNewDealSelector } from "../..";
import { FormOptionType } from "lib/types";

interface AssetTypePageProps {}

const { heading, subheading } = headings;
const {
  amount: amountKey,
  details: detailsKey,
  type: typeKey,
  currency: currencyKey,
} = keys;
const { amount: amountLabel, details: detailsLabel, type: typeLabel } = labels;

export const AssetTypePage: React.FC<AssetTypePageProps> = () => {
  const { [key]: state } = useNewDealSelector((state) => state);

  const dispatch = useNewDealDispatch();

  const [fields, setFields] = React.useState(state);

  const { amount, type, details, currency } = fields;

  const handleChange = (e: any, field: string, newVal?: any) => {
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
      {subheading !== "" && (
        <Grid xs sx={{ mb: margin }}>
          <DText text={subheading} variant="body1" />
        </Grid>
      )}
      <Grid xs>
        <DText text={typeLabel} variant="body2" />
      </Grid>
      <Grid xs>
        <DAutocomplete<FormOptionType>
          options={typeKey.options}
          value={
            type ??
            ({
              value: "cash",
              label: "Cash, Securities, Bills",
            } as FormOptionType)
          }
          onChange={(e, newVal) =>
            handleChange(e, typeKey.value, newVal ?? undefined)
          }
        />
      </Grid>
      <Grid xs>
        <DText text={amountLabel} variant="body2" />
      </Grid>
      <Grid xs>
        <DInput
          placeholder={amountLabel}
          value={amount}
          onChange={(e) => handleChange(e, amountKey)}
          number
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DText text="£" />{" "}
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid xs>
        {amount !== 0 && (
          <PanDownAnimation>
            <CurrencySelect
              value={currency}
              onChange={(e, newVal) =>
                handleChange(e, currencyKey, newVal ?? "")
              }
            />
          </PanDownAnimation>
        )}
      </Grid>
      <Grid xs>
        <DText text={detailsLabel} variant="body2" />
      </Grid>
      <Grid xs>
        <DInput
          placeholder="(E.g. Plot no. 13579, Alphabet Class A shares)"
          value={details}
          onChange={(e) => handleChange(e, detailsKey)}
          multiline
          rows={2}
        />
      </Grid>
    </Grid>
  );
};
