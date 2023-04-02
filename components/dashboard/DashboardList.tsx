'use client' 


import { Box, Divider, FormControl, InputLabel, ListProps, MenuItem, Select, Stack, TablePagination, Unstable_Grid2 as Grid, useTheme } from '@mui/material'
import { AddButton, DInput, DText, HoverAnimation, NavAnimation } from 'components'
import { padding } from 'lib/constants'
import { Deal } from 'lib/models'
import { useAppSelector } from 'lib/redux'
import { DealType } from 'lib/types'
import * as React from 'react'
import { ActionPane } from './ActionPane'
import { DashboardListItem } from './DashboardListItem'
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

const applyPagination = (
    deals: Deal[],
    page: number,
    limit: number
  ): Deal[] => {
    return deals.slice(page * limit, page * limit + limit);
};


export const DashboardList: React.FC<DashboardListProps> = (props) => {

    const theme = useTheme()

    const { deals, table: { activeDealId }} = useAppSelector(state => state.dashboard)

    const [active, setActive] = React.useState(null)

    React.useEffect(() => {

        const _deal = activeDealId === '' ? null : deals.filter(deal => deal.id === activeDealId)[0]

        setActive(_deal)

    }, [activeDealId])
    

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
            <Grid xs={12} container direction='row'>
                <Grid xs={4} sx={{ ml: '10%', mr: '20%'}}>
                    <DInput placeholder='Search' />
                </Grid>
                <Grid xs={4} container display='flex' alignItems='flex-end'>
                    <Grid xs={4}>
                        <HoverAnimation>
                            <AddButton />
                        </HoverAnimation>
                    </Grid>
                    <Grid xs={8}>
                    {
                        (deals && deals.length !== 0) ?
                            <Box width={150}>
                                <FormControl fullWidth variant="outlined">
                                    <Select
                                        value={filters.type || 'all'}
                                        onChange={handleTypeChange}
                                        label={<DText text="DealType" />}
                                        autoWidth
                                        variant='standard'
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
                
            </Grid>
            <Grid xs={12} container direction='row'>
                <Grid xs={activeDealId !== '' ? 7 : 12}>
                    {
                        (deals && deals.length !== 0) &&
                            <Grid xs={12}>
                                <Stack alignItems='stretch'>
                                    {
                                        paginatedDeals.map((deal, i) => (
                                            <React.Fragment key={i}>
                                                <HoverAnimation>
                                                    <DashboardListItem deal={deal} />
                                                </HoverAnimation>
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
                {
                    activeDealId !== '' && active &&
                    <Grid xs={5} sx={{ height: '80%' }}>
                        <NavAnimation>
                            <ActionPane deal={active} open={activeDealId !== '' && active} />
                        </NavAnimation>
                    </Grid>
                }
            </Grid>
        </Grid>
    )
}