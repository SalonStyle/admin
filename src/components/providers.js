"use client";

// import { Provider } from "react-redux";
import { SidebarProvider } from "./sidebar-provider";
// import { store } from "../../stor";

export default function Providers({ children }) {
  return (
    // <Provider store={store}>
    <SidebarProvider>{children}</SidebarProvider>
    // </Provider>
  );
}
