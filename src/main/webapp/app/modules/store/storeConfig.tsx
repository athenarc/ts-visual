import { configureStore } from "@reduxjs/toolkit";
import { enableMapSet } from 'immer';
import visualizer from "./visualizerSlice";
import { TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import applicationProfile from 'app/shared/reducers/application-profile';
import { loadingBarReducer as loadingBar, loadingBarMiddleware } from 'react-redux-loading-bar';
import notificationMiddleware from 'app/config/notification-middleware';
import promiseMiddleware from 'redux-promise-middleware';
import errorMiddleware from 'app/config/error-middleware';
import loggerMiddleware from 'app/config/logger-middleware';
import home from "./homeSlice";
import fileManagement from "./fileManagementSlice"
import uploadSchema from "./uploadSchemaSlice";
import forecasting from "./forecastingSlice";

enableMapSet();

export const store = configureStore({
    reducer: {
        loadingBar,
        applicationProfile,
        visualizer,
        home,
        fileManagement,
        uploadSchema,
        forecasting,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
      }).concat(loggerMiddleware, loadingBarMiddleware(), promiseMiddleware, notificationMiddleware, errorMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
