import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import { reducer } from './reducer';

const preloadedState = {};

export const store = configureStore({
    reducer,
    // middleware: getDefaultMiddleware => getDefaultMiddleware({
    //     // serializableCheck: {
    //     //   // Ignore these action types
    //     //   ignoredActions: [
    //     //     'auth/auth_success', 
    //     //     'auth/set_user',
    //     //     'persist/PERSIST', 
    //     //     'trade/etf_update_success', 
    //     //     'trade/user_update_success', 
    //     //     'trade/user_update_start', 
    //     //     'trade/etf_update_start',
    //     //     '@@redux-react-session/GET_USER_SESSION_SUCCESS'
    //     //   ],
    //     //   // Ignore these field paths in all actions
    //     //   ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
    //     //   // Ignore these paths in the state
    //     //   ignoredPaths: ['auth.user', 'trade.etfTrades', 'trade.userTrades', 'session'],
    //     // },
    //   }).concat([thunk]),
    preloadedState,
    //devTools: process.env.NODE_ENV !== 'production',
});

//export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
