"use client";

import * as React from "react";
import {
  Box,
  Button,
  ButtonProps,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { padding } from "lib/constants";
import { FormOptionType } from "lib/types";
import { DText } from "./DText";

interface DGridProps {
  options: FormOptionType[];
  onChange?: (e: any, selected: FormOptionType) => void;
  defaultIndex?: number;
}

export const DGrid: React.FC<DGridProps> = (props) => {
  const { options, onChange, defaultIndex } = props;

  const [selected, setSelected] = React.useState<FormOptionType>(
    options[defaultIndex ?? 0]
  );

  const handleClick = (e: any, option: FormOptionType) => {
    setSelected(option);
    if (onChange) onChange(e, option);
  };

  interface OptionButtonProps extends ButtonProps {
    option: FormOptionType;
  }

  const OptionButton: React.FC<OptionButtonProps> = ({ option, ...props }) => {
    const [variant, setVariant] = React.useState(props.variant ?? "text");

    React.useEffect(() => {
      if (selected.value === option.value) setVariant("outlined");
      else setVariant("text");
    }, [selected]);

    return (
      <Box display="flex" flexDirection="row" justifyContent="space-evenly">
        <Button
          variant={variant}
          onClick={(e) => handleClick(e, option)}
          sx={{ maxWidth: 200, padding }}
        >
          <DText text={option.label} variant="caption" color="primary" />
        </Button>
      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, padding }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {options.map((option, i) => (
          <Grid xs={2} sm={4} md={4} key={i}>
            <OptionButton
              key={i}
              option={option}
              variant={
                i === 0 || (defaultIndex && i === defaultIndex)
                  ? "outlined"
                  : "text"
              }
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
