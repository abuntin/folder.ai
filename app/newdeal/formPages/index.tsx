import React from 'react';
import { Frequency, AssetType, Party, DealType, LoanPartyType } from 'lib/types';
import { IOU } from 'lib/models';
export * from './common';
export * from './iou'

const initialState = {
    selectDealPage: 'iou' as DealType,
    primaryPartyPage: {
        name: '',
        country: 'GB',
        address: '',
        city: ''
    } as Party,
    secondaryPartyPage: {
        name: '',
        country: 'GB',
        address: '',
        city: ''
    } as Party,
    partyTypePage: 'lender' as LoanPartyType,
    assetTypePage: {
        amount: 0,
        details: '',
        currency: 'GBP',
        type: { value: 'cash' as AssetType, label: 'Cash, Securities, Bills' },
    },
    loanDetailsPage: {
        loanDate: '',
        interest: {
            rate: 0,
            type: 'fixed' as ('compound' | 'fixed'),
            frequency: {
                value: 'annually' as Frequency,
                label: 'Annually'
            }
        },
        repaymentFrequency: {
            value: 'annually' as Frequency,
            label: 'Annually'
        }
    },
    cosignPage: {
        isCosigned: false,
        name: '',
        address: '',
        city: '',
    },
    termDetailsPage: {
        signDate: '',
        termDate: '',
        specialClause: '',
    },
}

type FormState = typeof initialState;

type CallbackType = (state: FormState) => FormState;

type SelectorType = (callback: CallbackType) => FormState;

type DispatchType = (state: Partial<FormState>) => void;

const NewDealContext = 
    React.createContext<{ getState: SelectorType, dispatch: DispatchType}>({ getState: () => initialState, dispatch: () => {}});

export const useNewDealSelector = (callback: CallbackType) => {
    const { getState } = React.useContext(NewDealContext);

    return getState(callback);

}

export const useNewDealDispatch = () => {
    const {dispatch} = React.useContext(NewDealContext);

    return dispatch;
}

const newDealReducer: React.Reducer<FormState, Partial<FormState>> = (state, newState) => {    
    return { ...state, ...newState }
}



export function NewDealProvider({ children }) {
    const [state, dispatch] = React.useReducer(newDealReducer, initialState);
    
    const getState: SelectorType = (callback: CallbackType) => {
        return callback(state)
    };

    React.useEffect(() => console.log(state), [state])

    return (
      <NewDealContext.Provider value={{getState, dispatch}}>
          {children}
      </NewDealContext.Provider>
    );
}
