import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import stateSlice from "./slices/stateSlice"
import taskSlice from "./slices/taskSlice"
import uiSlice from "./slices/uiSlice"

export const store = configureStore({
    reducer: {
        auth: authSlice,
        tasks: taskSlice,
        states: stateSlice,
        ui: uiSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch