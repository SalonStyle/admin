import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query" 
import bookingsReducer from "./features/bookings/bookings-slice"
import { bookingsApi } from "./features/bookings/bookings-api"
import { categoriesApi } from "./features/categories/categories-api"

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      bookings: bookingsReducer,
      [bookingsApi.reducerPath]: bookingsApi.reducer,
      [categoriesApi.reducerPath]: categoriesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(bookingsApi.middleware)
        .concat(categoriesApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  })

  setupListeners(store.dispatch)

  return store
}

export const store = makeStore()
