import { FormOptionType } from "lib/types";

export const key = 'assetTypePage'

export const keys = {
  amount: 'amount',
  details: 'details',
  type: {
    value: 'type',
    options: [
    {
      value: 'land-property',
      label: 'Real Estate (Land / Property)',
    },
    {
      value: 'business',
      label: 'Business',
    },
    {
      value: 'physical',
      label: 'Inventory (Truck, Raw Materials, Vacuum Cleaner)',
    },
    {
      value: 'debt',
      label: 'Cash, Debt or Bills',
    },
    {
      value: 'other',
      label: 'Anything else',
    }

  ] as FormOptionType[]},
}

export const headings = {
  heading: 'Asset Details',
  subheading: "What are we loaning out?",
  info: ''
}

export const labels = {
  amount: 'Value',
  details: 'Description',
  type: 'Asset Type'
}