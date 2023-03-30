import {
    Box, Card, CardHeader, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Table,
    TableBody, TableContainer, TableHead,
    TablePagination, useTheme
} from '@mui/material';
import React, { ChangeEvent, FC, useState } from 'react';

import { DCheckbox, DLabel, DText } from 'components';
import { Deal, IOU } from 'lib/models';
import { DealType } from 'lib/types';
import { DashboardListItem } from './DashboardListItem';
import { useAppSelector } from 'lib/redux';

interface DealsTableProps {
  className?: string;
}

interface Filters {
  type?: DealType;
}

let typeMap = ['nda', 'termsandconditions', 'shareholders', 'iou', 'sales', 'offerletter', 'custom'].reduce((prev, curr) => {
    return { ...prev, [curr]: { text: curr.toLocaleUpperCase(), color: 'primary' }}
}, {})

const getTypeLabel = (type: DealType): JSX.Element => {

  const { text, color } = typeMap[type as string];

  return <DLabel color={color}>{text}</DLabel>;

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

export const DashboardTable: FC<DealsTableProps> = (props) => {

    const deals = useAppSelector(state => state.dashboard.deals)

    const [selectedDeals, setSelectedDeals] = useState<string[]>(
        []
    );
    const selectedBulkActions = selectedDeals.length > 0;
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [filters, setFilters] = useState<Filters>({
        type: null
    });

    const typeOptions = Object.entries(typeMap).map(([key, val]) => {
        return { id: key, name: (val as any).text }
    }).concat([{ id: 'all', name: 'All'}])

    const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
        let value = null;

        if (e.target.value !== 'all') {
            value = e.target.value;
        }

        setFilters((prevFilters) => ({
            ...prevFilters,
            status: value
        }));
    };

    const handleSelectAllDeals = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        setSelectedDeals(
        event.target.checked
            ? deals.map((deal) => deal.id)
            : []
        );
    };

    const handleSelectOneUserDeal = (
        event: ChangeEvent<HTMLInputElement>,
        tradeId: string
    ): void => {
        if (!selectedDeals.includes(tradeId)) {
        setSelectedDeals((prevSelected) => [
            ...prevSelected,
            tradeId
        ]);
        } else {
        setSelectedDeals((prevSelected) =>
            prevSelected.filter((id) => id !== tradeId)
        );
        }
    };

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const filteredDeals = applyFilters(deals, filters);
    const paginatedDeals = applyPagination(
        filteredDeals,
        page,
        limit
    );
    const selectedSomeDeals =
        selectedDeals.length > 0 &&
        selectedDeals.length < deals.length;
    const selectedAllDeals =
        selectedDeals.length === deals.length;
    const theme = useTheme();

    return (
        <Card>    
        {/* {selectedBulkActions && (
            <Box flex={1} p={2}>
            <BulkActions />
            </Box>
        )} */}
        {!selectedBulkActions && (
            <CardHeader
            action={
                (deals != null && deals.length !== 0) ?
                <Box width={150}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Status</InputLabel>
                    <Select
                    value={filters.type || 'all'}
                    onChange={handleStatusChange}
                    label="DealType"
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
            title="My Deals"
            />
        )}
        <Divider />
        
        {
            !deals && 
            
            <DText text='Error fetching from server' variant='subtitle1' align='center' sx={{ margin: 20 }} />
        }

        {
            (deals && deals.length === 0) && 
            
            <DText text='Nothing to see here yet!' variant='subtitle1' align='center' sx={{ margin: 20 }} />
        }

        {(deals && deals.length !== 0) && 
            <React.Fragment>
            <TableContainer>
                <Table>
                <TableHead>
                    TABLE ACTIONS HERE
                </TableHead>
                <TableBody>
                    {paginatedDeals.map((deal) => {
                    const isUserDealSelected = selectedDeals.includes(
                        deal.id
                    );
                    return (
                        <Grid container spacing={0}>
                            <Grid xs>
                                <DCheckbox
                                    checked={isUserDealSelected}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                        handleSelectOneUserDeal(event, deal.id)
                                    }
                                    value={isUserDealSelected}
                                />
                            </Grid>
                            <Grid xs>
                                {getTypeLabel(deal.type)}
                            </Grid>
                            <Grid xs={8}>
                                <DashboardListItem deal={deal} />
                            </Grid>
                        </Grid>

                    );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
            
            <Box p={2}>
                <TablePagination
                component="div"
                count={filteredDeals.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 25, 30]}
                />
            </Box>
            </React.Fragment>
        }
        </Card>
    );
};
