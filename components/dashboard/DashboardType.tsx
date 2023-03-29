'use client'

import { DLabel, DText } from "components/common";
import { DealType } from "lib/types";

export const getTypeLabel = (type: DealType): JSX.Element => {

    const { text, color } = typeMap[type as string];

    return <DLabel color={color}><DText text={text} /></DLabel>;

}

export const typeMap = ['nda', 'termsandconditions', 'shareholders', 'iou', 'sales', 'offerletter', 'custom'].reduce((prev, curr) => {
    return { ...prev, [curr]: { text: curr.toLocaleUpperCase(), color: 'secondary' }}
}, {})

export const typeOptions = Object.entries(typeMap).map(([key, val]) => {
    return { id: key, name: (val as any).text }
}).concat([{ id: 'all', name: 'All' }])