'use client'

import { Verified, DoneAllSharp } from "@mui/icons-material";
import { DLabel, DText } from "components";
import { DealType, Party } from "lib/types";

export const getTypeLabel = (type: DealType): JSX.Element => {

    const { text, color } = typeMap[type as string];

    return <DLabel color={color}><DText text={text} /></DLabel>;

}

export const getPartyStatus = (party: Party) => {
    if (party.signed) return <Verified fontSize='small' color='success' />
    else return <DoneAllSharp fontSize='small' color='primary' />
}

export const getCosignersStatus = (cosigners: Party[]) => {
    if ((cosigners.length === 1 && cosigners[0].signed) || cosigners.reduce((prev, curr) => prev && curr.signed, true)) {
        return  <Verified fontSize='small' color='success' />
    }
    else return <DoneAllSharp fontSize='small' color='primary' />
}

export const typeMap = ['nda', 'termsandconditions', 'shareholders', 'iou', 'sales', 'offerletter', 'custom'].reduce((prev, curr) => {
    return { ...prev, [curr]: { text: curr.toLocaleUpperCase(), color: 'secondary' }}
}, {})

export const typeOptions = Object.entries(typeMap).map(([key, val]) => {
    return { id: key, name: (val as any).text }
}).concat([{ id: 'all', name: 'All' }])