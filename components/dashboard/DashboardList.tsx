'use client' 


import * as React from 'react' 
import { Box, FormControl, Divider, InputLabel, Select, Unstable_Grid2 as Grid, Stack, MenuItem, ListProps, TablePagination } from '@mui/material'
import { DashboardListItem } from './DashboardListItem'
import { useAppDispatch, useAppSelector } from 'lib/redux'
import { DText, DInput } from 'components'
import { Deal } from 'lib/models'
import { DealType } from 'lib/types'
import { typeOptions } from './DashboardType'

interface DashboardListProps extends ListProps {
    deals: Deal[]
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

const applyPagination = (
    deals: Deal[],
    page: number,
    limit: number
  ): Deal[] => {
    return deals.slice(page * limit, page * limit + limit);
};


export const DashboardList: React.FC<DashboardListProps> = ({ deals, ...rest }) => {

    const [page, setPage] = React.useState<number>(0);
    const [limit, setLimit] = React.useState<number>(5);
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

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const filteredDeals = applyFilters(deals, filters);

    const paginatedDeals = applyPagination(
        filteredDeals,
        page,
        limit
    );

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
                <DInput placeholder='Search'/>
            </Grid>
            <Grid xs>
                <Divider />
            </Grid>

            {
                (deals && deals.length !== 0) &&
                    <Grid xs={12}>
                        <Stack spacing={0.5} alignItems='stretch'>
                            {
                                paginatedDeals.map((deal, i) => (
                                    <React.Fragment key={i}>
                                        <DashboardListItem deal={deal} />
                                        <Divider sx={{ width: '100%' }} />
                                    </React.Fragment>
                                ))
                            }
                        </Stack>
                    </Grid>
            }
            <Grid xs={12}>
                <TablePagination
                    component="div"
                    count={filteredDeals.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 10, 25, 30]}
                />
            </Grid>
        </Grid>
    )
}