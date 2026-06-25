import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import bookingsReducer from "./features/bookings/bookings-slice"
import authReducer from "./features/auth/auth-slice"
import { bookingsApi } from "./features/bookings/bookings-api"
import { categoriesApi } from "./features/categories/categories-api"
import { servicesApi } from "./features/services/services-api"
import { salonsApi } from "./features/salons/salons-api"
import { membersApi } from "./features/members/members-api"
import { authApi } from "./features/auth/auth-api"

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      bookings: bookingsReducer,
      [authApi.reducerPath]: authApi.reducer,
      [bookingsApi.reducerPath]: bookingsApi.reducer,
      [categoriesApi.reducerPath]: categoriesApi.reducer,
      [servicesApi.reducerPath]: servicesApi.reducer,
      [salonsApi.reducerPath]: salonsApi.reducer,
      [membersApi.reducerPath]: membersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(authApi.middleware)
        .concat(bookingsApi.middleware)
        .concat(categoriesApi.middleware)
        .concat(servicesApi.middleware)
        .concat(salonsApi.middleware)
        .concat(membersApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  })

  setupListeners(store.dispatch)

  return store
}

export const store = makeStore()
