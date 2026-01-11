import React from "react";

export const TaskChangedMessageContext = React.createContext(null);

export function useTaskChangedMessage() {
    const context = React.useContext(TaskChangedMessageContext);
    if (!context) {
        throw new Error("useTaskChangedMessage must be used within a TaskChangedMessageProvider");
    }
    return context;
}

