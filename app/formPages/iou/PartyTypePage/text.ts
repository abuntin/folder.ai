import { FormOptionType } from "lib/types";

export const key = 'partyTypePage'

export const keys = {
    options: [
    {
        value: 'lender',
        label: "Lender",
    },
    {
        value: 'borrower',
        label: "Borrower",
    }
    ] as FormOptionType[],
}

export const headings = {
    heading: 'Primary Party is the...',
    subheading: ''
}


