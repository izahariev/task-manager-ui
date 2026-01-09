import React from "react";

export const ErrorMessagesContext = React.createContext(null);

export function useErrors() {
    const ctx = React.useContext(ErrorMessagesContext);
    if (!ctx) {
        throw new Error("useErrors must be used within an ErrorProvider");
    }
    return ctx;
}