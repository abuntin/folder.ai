import { CountryType } from "lib/constants"

export type ContractType = {
    nda: 'Non-Disclosure Agreement (NDA)', 
    termsandconditions: 'Terms and Conditions Policy', 
    shareholders: "Shareholder's Agreement",
    iou: 'Promissory Note (IOU)',
    sales: "Sale's Agreement",
    offerletter: 'Offer Letter' 

}

export type Frequency = 'monthly' | 'quarterly' | 'annually' | 'weekly' | 'daily' | 'term' | 'other'

export type AssetType = 'land-property' | 'business' | 'inventory' | 'cash' | 'other'

export interface DealMetadata {
    signDate: '',
    termDate: '',
}

export interface Party {
    name: string,
    address: string,
    city: string,
    country: CountryType
}

export interface InterestTerms {
    rate: number,
    type: 'fixed' | 'compound',
    frequency: Frequency
}

export interface AssetTerms {
    amount: number,
    details: '',
    type: 'land-property' | 'business' | 'inventory' | 'cash' | 'other'
}

export interface PaymentTerms {
    loanDate: ''
    interest: InterestTerms,
    assetType: AssetTerms,
    repayment: Frequency,
}

export type LoanPartyType = 'lender' | 'borrower'

export type DealType = keyof ContractType