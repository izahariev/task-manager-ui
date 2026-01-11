import PropTypes from "prop-types";
import React from "react";
import {TaskChangedMessageContext} from "./TaskChangedMessageContext";

export function TaskChangedMessageProvider({ children }) {
    const [taskChangedMessage, setTaskChangedMessage] = React.useState(null);
    const [showAlert, setShowAlert] = React.useState(false);
    const removeTimerRef = React.useRef(null);

    React.useEffect(() => {
        if (taskChangedMessage !== null) {
            setShowAlert(true);
            const timer = setTimeout(() => {
                setShowAlert(false);
                // Wait for fade-out animation to complete (500ms) before removing from DOM
                removeTimerRef.current = setTimeout(() => {
                    setTaskChangedMessage(null);
                }, 500);
            }, 5000);
            return () => {
                clearTimeout(timer);
                if (removeTimerRef.current) {
                    clearTimeout(removeTimerRef.current);
                    removeTimerRef.current = null;
                }
            };
        }
    }, [taskChangedMessage]);

    const value = React.useMemo(
      () => ({ taskChangedMessage, setTaskChangedMessage, showAlert, setShowAlert }),
      [taskChangedMessage, showAlert]
    );

    return <TaskChangedMessageContext.Provider value={value}>{children}</TaskChangedMessageContext.Provider>;
}

TaskChangedMessageProvider.propTypes = {
    children: PropTypes.node,
};

