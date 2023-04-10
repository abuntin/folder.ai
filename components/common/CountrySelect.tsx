import PublicIcon from "@mui/icons-material/Public";
import {
  Autocomplete, Box, InputAdornment, TextField, UseAutocompleteProps
} from "@mui/material";
import { margin } from "lib/constants";
import * as React from "react";
import { DText } from "./DText";

const countries = require("lib/constants/countries.json");

interface CountrySelectProps<T>
  extends Omit<UseAutocompleteProps<T, false, false, false>, "options"> {}

export const CountrySelect: React.FC<CountrySelectProps<string>> = (props) => {
  const { value } = props;

  const [leading, setLeading] = React.useState<React.ReactNode>(
    value ? (
      <img
        loading="eager"
        width="20"
        src={`https://flagcdn.com/w20/${value.toLowerCase()}.png`}
        srcSet={`https://flagcdn.com/w40/${value.toLowerCase()}.png 2x`}
        alt=""
      />
    ) : null
  );

  const handleChange = (
    e: React.SyntheticEvent,
    value: string,
    reason: "createOption" | "selectOption" | "removeOption" | "blur" | "clear"
  ) => {
    setLeading(
      reason == "removeOption" || reason == "clear" ? null : (
        <img
          loading="eager"
          width="20"
          src={`https://flagcdn.com/w20/${value.toLowerCase()}.png`}
          srcSet={`https://flagcdn.com/w40/${value.toLowerCase()}.png 2x`}
          alt=""
        />
      )
    );
    if (props.onChange != null) props.onChange(e, value, reason);
  };

  return (
    <Autocomplete
      sx={{ width: "max-width" }}
      options={Object.keys(countries)}
      autoHighlight
      autoSelect
      getOptionLabel={(option: string) => countries[option]}
      onChange={handleChange}
      renderOption={(props, option: string) => {
        return (
          <Box
            {...props}
            component="li"
            sx={{
              "&> img": {
                mr: margin,
                flexShrink: 0,
                backgroundColor: "primary",
              },
            }}
          >
            <img
              loading="lazy"
              width="20"
              src={`https://flagcdn.com/w20/${option.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w40/${option.toLowerCase()}.png 2x`}
              alt=""
            />
            <DText text={`${countries[option]} (${option})`} />
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{ fontFamily: "sans-serif", fontWeight: "light" }}
          variant="standard"
          color="primary"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                {leading ?? <PublicIcon fontSize="small" />}
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};
