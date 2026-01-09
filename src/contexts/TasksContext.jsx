import React from "react";

export const TasksContext = React.createContext(null);

export function useTasks() {
    const context = React.useContext(TasksContext);
    if (!context) {
        throw new Error("useTasks must be used within a TasksProvider");
    }
    return context;
}
