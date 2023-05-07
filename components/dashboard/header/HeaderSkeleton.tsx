import { AddSharp, GridViewSharp, ViewListSharp } from "@mui/icons-material";
import { Box, Unstable_Grid2 as Grid, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { padding, borderRadius } from "lib/constants";
import { LoadingComponent } from "components/common";

interface HeaderProps {}

export const HeaderSkeleton: React.FC<HeaderProps> = props => {
  return (
    <Grid
      xs={12}
      container
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Grid xs={10} display="flex" alignItems="stretch">
        <Box
          sx={{ padding, borderRadius, backgroundColor: 'background.paper', minWidth: 200 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <LoadingComponent width={25} height={25} />
        </Box>
      </Grid>
      <Grid
        container
        xs={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid xs={6} display="flex" justifyContent="center">
          <AddSharp sx={{ fontSize: 20 }} color="primary" />
        </Grid>
        <Grid xs={6} display="flex" justifyContent="start">
          <ToggleButtonGroup exclusive disabled={true}>
            <ToggleButton value="grid" size="small">
              <GridViewSharp color="disabled" />
            </ToggleButton>
            <ToggleButton value="tile" size="small">
              <ViewListSharp color="disabled" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Grid>
  );
};
