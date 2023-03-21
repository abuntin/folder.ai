'use client' 


import { DesktopDatePicker, DesktopDatePickerProps } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import * as React from 'react' 


interface DateInputProps extends DesktopDatePickerProps<Dayjs> {
    
} 

export const DateInput: React.FC<DateInputProps> = (props) => {
    return (
        <DesktopDatePicker views={['year', 'month', 'day']} />
    )
}