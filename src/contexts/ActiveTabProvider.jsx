import PropTypes from "prop-types";
import React from "react";
import {ActiveTabContext} from "./ActiveTabContext.jsx";

export function ActiveTabProvider({ children }) {
    const [activeTab, setActiveTab] = React.useState("active");

    const value = React.useMemo(
      () => ({ activeTab, setActiveTab }),
      [activeTab]
    );

    return <ActiveTabContext.Provider value={value}>{children}</ActiveTabContext.Provider>;
}

ActiveTabProvider.propTypes = {
    children: PropTypes.node,
};

