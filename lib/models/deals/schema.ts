import dayjs from "dayjs";
import { IOU } from ".";

export const sampleIOU = new IOU({
    id: '0000001000',
    type: 'iou',
    primaryParty: {
        name: 'jj',
        country: 'GB',
        address: 'House @ Marylebone dot Postcode',
        city: 'London',
        signed: false
    },
    secondaryParty: {
        name: 'derrick',
        country: 'GB',
        address: 'House @ Marylebone dot Postcode',
        city: 'London',
        signed: false
    },
    cosigners: [
        {
            name: 'tom',
            country: 'GB',
            address: 'House @ Marylebone dot Postcode',
            city: 'London',
            signed: false
        },
        {
            name: 'james',
            country: 'GB',
            address: 'House @ Marylebone dot Postcode',
            city: 'London',
            signed: false
        },
    ],
    metadata: {
        sign: dayjs().add(1, 'day').toISOString(),
        term: dayjs().add(3, 'day').toISOString(),
        title: "IOU Deal Test 1",
        created: dayjs().toISOString(),
    },
    specialClause: '10,000 v-bucks on default',
    paymentTerms:{
        loanDate: dayjs().subtract(2, 'day').toISOString(),
        interest: {
            rate: 2,
            type: 'compound',
            frequency: 'annually'
        },
        repayment: 'monthly'
    },
    assetTerms: {
        amount: 10000,
        currency: 'GBP',
        details: 'Cash loan',
        type: 'cash'
    },
    loanPartyType:'lender'

})
