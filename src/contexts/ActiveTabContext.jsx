import React from "react";

export const ActiveTabContext = React.createContext(null);

export function useActiveTab() {
    const context = React.useContext(ActiveTabContext);
    if (!context) {
        throw new Error("useActiveTab must be used within an ActiveTabProvider");
    }
    return context;
}

