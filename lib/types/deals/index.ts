export type ContractType = {
    nda: 'Non-Disclosure Agreement (NDA)', 
    termsandconditions: 'Terms and Conditions Policy', 
    shareholders: "Shareholder's Agreement",
    iou: 'Promissory Note (IOU)',
    sales: "Sale's Agreement",
    offerletter: 'Offer Letter',
    custom: 'Custom'
}

export type Frequency = 'monthly' | 'quarterly' | 'annually' | 'weekly' | 'daily' | 'term' | 'other'

export type AssetType = 'land-property' | 'business' | 'inventory' | 'cash' | 'other'

export interface DealMetadata {
    sign: string,
    term: string,
    created: string,
    title: string,
}

export interface Party {
    name: string,
    address: string,
    city: string,
    country: string,
    signed?: boolean,
}

export interface InterestTerms {
    rate: number,
    type: 'fixed' | 'compound',
    frequency: Frequency
}

export interface AssetTerms {
    amount: number,
    currency: string
    details: string,
    type: 'property' | 'business' | 'inventory' | 'cash' | 'other'
}

export interface PaymentTerms {
    loanDate: string,
    interest: InterestTerms,
    repayment: Frequency,
}

export type LoanPartyType = 'lender' | 'borrower'

export type DealType = keyof ContractType