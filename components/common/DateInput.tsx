'use client' 


import { DesktopDatePicker, DesktopDatePickerProps } from '@mui/x-date-pickers'
import { Dayjs } from 'dayjs'
import * as React from 'react' 

export const DateInput: React.FC<DesktopDatePickerProps<Dayjs>> = (props) => {
    return (
        <DesktopDatePicker views={['year', 'month', 'day']} />
    )
}