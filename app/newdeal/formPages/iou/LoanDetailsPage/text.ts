export const key = 'loanDetailsPage'

export const frequencyOptions = [
 { value: 'annually', label: 'Annually'},
 { value: 'quarterly', label: 'Quarterly'},
 { value: 'monthly', label: 'Monthly'},
 { value: 'weekly', label: 'Weekly'},
 { value: 'daily', label: 'Daily'},
 { value: 'term', label: 'Term'}
]
export const keys = {
  loanDate: 'loanDate',
  repaymentFrequency: 'repaymentFrequency',
  interest: {
    value: 'interest',
    rate: 'rate',
    frequency: 'frequency',
    type: {
      value: 'type',
      options: [
        'compound',
        'fixed'
      ]
    },
  },
      
}


export const headings = {
    heading: 'Loan Details',
    subheading: 'The important stuff.',
    info: ''
}

export const labels = {
  loanDate: 'Loan Date',
  interest: 'Interest Rate',
  repaymentFrequency: 'Repayments',
}
