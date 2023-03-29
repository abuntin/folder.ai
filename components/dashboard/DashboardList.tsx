'use client' 


import * as React from 'react' 
import { Box, FormControl, Divider, InputLabel, Select, Unstable_Grid2 as Grid, Stack, MenuItem, ListProps } from '@mui/material'
import { DashboardListItem } from './DashboardListItem'
import { useAppDispatch, useAppSelector } from 'lib/redux'
import { DLabel, DText } from 'components/common'
import { Deal } from 'lib/models'
import { DealType } from 'lib/types'
import { typeOptions } from './DashboardType'

interface DashboardListProps extends ListProps {
} 

interface Filters {
    type?: DealType;

}

const applyFilters = (
    deals: Deal[],
    filters: Filters
  ): Deal[] => {
    return deals.filter((deal) => {
      let matches = true;

      if (filters.type && deal.type !== filters.type) {
        matches = false;
      }
      return matches;
    });
};


export const DashboardList: React.FC<DashboardListProps> = (props) => {

    const { deals } = useAppSelector(state => state.dashboard)

    const [filters, setFilters] = React.useState<Filters>({
        type: null
    });


    const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let value = null;

        if (e.target.value !== 'all') {
            value = e.target.value;
        }

        setFilters((prevFilters) => ({
            ...prevFilters,
            type: value
        }));
    };

    const filteredDeals = applyFilters(deals, filters);

    return (
        <Grid container spacing={4} direction='column' sx={{ width: '100%' }}>
            <Grid xs container direction='row'>
                <Grid xs display='flex' justifyContent='start' alignItems='center'>
                    <DText text='Dashboard' variant='h5' />
                </Grid>
                <Grid xs display='flex' justifyContent='end' alignItems='center'>
                    {
                        (deals && deals.length !== 0) ?
                            <Box width={150}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel color='primary'> DealType </InputLabel>
                                    <Select
                                        value={filters.type || 'all'}
                                        onChange={handleTypeChange}
                                        label={<DText text="DealType" />}
                                        autoWidth
                                        >
                                        {typeOptions.map(option => (
                                            <MenuItem key={option.id} value={option.id}>
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        : null
                    }
                </Grid>
            </Grid>
            <Grid xs>
                <Divider />
            </Grid>

            {
                (deals && deals.length !== 0) &&
                    <Grid xs={12}>
                        <Stack spacing={0.5} alignItems='stretch'>
                            {
                                filteredDeals.map((deal, i) => (
                                    <DashboardListItem key={i} deal={deal} />
                                ))
                            }
                        </Stack>
                    </Grid>
            }
        </Grid>
    )
}