import React from "react";

export const UsersContext = React.createContext(null);

export function useUsers() {
    const context = React.useContext(UsersContext);
    if (!context) {
        throw new Error("useUsers must be used within a UsersProvider");
    }
    return context;
}

