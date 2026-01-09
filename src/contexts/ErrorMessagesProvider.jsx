import PropTypes from "prop-types";
import React from "react";
import {ErrorMessagesContext} from "./ErrorMessagesContext";

export function ErrorMessagesProvider({ children }) {
    const [errorMessages, setErrorMessages] = React.useState([]);

    const addErrors = React.useCallback((errors) => {
        const list = Array.isArray(errors) ? errors : [errors];
        setErrorMessages((prev) => [...prev, ...list].filter(Boolean));
    }, []);

    const clearErrors = React.useCallback(() => {
        setErrorMessages([]);
    }, []);

    const value = React.useMemo(
      () => ({ errorMessages, addErrors, clearErrors, setErrorMessages }),
      [errorMessages, addErrors, clearErrors]
    );

    return <ErrorMessagesContext.Provider value={value}>{children}</ErrorMessagesContext.Provider>;
}

ErrorMessagesProvider.propTypes = {
    children: PropTypes.node,
};