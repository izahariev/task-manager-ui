import PropTypes from "prop-types";
import React from "react";
import {fetchUsers} from "../js/BackendApis.js";
import {useErrors} from "./ErrorMessagesContext.jsx";
import {UsersContext} from "./UsersContext";

export function UsersProvider({ children }) {
    const [users, setUsers] = React.useState([]);
    const {addErrors, clearErrors} = useErrors();

    const refreshUsers = React.useCallback(() => {
        return fetchUsers()
          .then((r) => {
              if (r.errors && r.errors.length > 0) {
                  addErrors(r.errors);
                  return { success: false, errors: r.errors };
              }
              setUsers(r.content.elements);
              clearErrors();
              return { success: true, data: r.content.elements };
          })
          .catch((error) => {
              const errors = error.response?.data?.errors
                ? error.response.data.errors.map((e) => e.description)
                : ["An unexpected error occurred"];
              addErrors(errors);
              return { success: false, errors };
          });
    }, [addErrors, clearErrors]);

    const value = React.useMemo(
      () => ({
          users,
          refreshUsers,
      }),
      [users, refreshUsers]
    );

    return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

UsersProvider.propTypes = {
    children: PropTypes.node,
};

