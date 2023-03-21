import React from 'react';
import dayjs from 'dayjs'
export * from './common';
export * from './iou'

const initialState = {
    selectDealPage: 'iou',
    primaryPartyPage: {
        name: '',
        country: { code: 'gb', label: 'United Kingdom' },
        address: '',
        city: ''
    },
    secondaryPartyPage: {
        name: '',
        country: { code: 'gb', label: 'United Kingdom' },
        address: '',
        city: ''
    },
    partyTypePage: {
        value: '',
        label: '',
    },
    assetTypePage: {
        amount: 0,
        details: '',
        type: { value: '' as ('land-property' | 'business' | 'inventory' | 'debt' | 'other'), label: '' }
    },
    loanDetailsPage: {
        loanDate: '',
        interest: {
            rate: 0,
            type: 'fixed' as ('compound' | 'fixed'),
            frequency: 'annually' as ('monthly' | 'quarterly' | 'annually' | 'weekly' | 'daily' | 'full' | string),
        },
        repaymentFrequency: 'annually' as ('monthly' | 'quarterly' | 'annually' | 'weekly' | 'daily' | 'full' | string),
    },
    cosignPage: {
        isCosigned: false,
        name: '',
        address: '',
        city: ''
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

    return (
      <NewDealContext.Provider value={{getState, dispatch}}>
          {children}
      </NewDealContext.Provider>
    );
}