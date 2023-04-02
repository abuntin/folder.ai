import { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { borderRadius } from "lib/constants";

interface LabelProps {
  className?: string;
  color?:
    | "primary"
    | "black"
    | "secondary"
    | "error"
    | "warning"
    | "success"
    | "info";
  children?: ReactNode;
}

const LabelWrapper = styled("span")(
  ({ theme }) => `
      background-color: ${theme.palette.background.paper};
      padding: ${theme.spacing(0.5, 1)};
      font-size: ${theme.typography.pxToRem(13)};
      border-radius: ${borderRadius};
      display: inline-flex;
      align-items: center;
      justify-content: center;
      max-height: ${theme.spacing(3)};
      
      &.MuiLabel {
        &-primary {
          background-color: ${theme.palette.background.paper};
          color: ${theme.palette.primary.main}
        }

        &-black {
          background-color: ${theme.palette.background.paper};
          color: ${theme.palette.primary};
        }
        
        &-secondary {
          background-color: ${theme.palette.secondary.light};
          color: ${theme.palette.secondary.main}
        }
        
        &-success {
          background-color: ${theme.palette.success.light};
          color: ${theme.palette.success.main}
        }
        
        &-warning {
          background-color: ${theme.palette.warning.light};
          color: ${theme.palette.warning.main}
        }
              
        &-error {
          background-color: ${theme.palette.error.light};
          color: ${theme.palette.error.main}
        }
        
        &-info {
          background-color: ${theme.palette.info.light};
          color: ${theme.palette.info.main}
        }
      }
`
);

export const DLabel: FC<LabelProps> = ({
  className,
  color = "secondary",
  children,
  ...rest
}) => {
  return (
    <LabelWrapper className={"MuiLabel-" + color} {...rest}>
      {children}
    </LabelWrapper>
  );
};

DLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    "primary",
    "black",
    "secondary",
    "error",
    "warning",
    "success",
    "info",
  ]),
};
