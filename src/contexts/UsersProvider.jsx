import PropTypes from "prop-types";
import React from "react";
import {fetchUsers} from "../js/BackendApis.js";
import {useErrors} from "./ErrorMessagesContext.jsx";
import {UsersContext} from "./UsersContext";

export function UsersProvider({ children }) {
    const [users, setUsers] = React.useState([]);
    const {addErrors, clearErrors} = useErrors();

    const refreshUsers = React.useCallback(() => {
        // First, fetch page 1 to get total page count
        return fetchUsers(1, 10)
          .then((firstPageResponse) => {
              if (firstPageResponse.errors && firstPageResponse.errors.length > 0) {
                  addErrors(firstPageResponse.errors);
                  return { success: false, errors: firstPageResponse.errors };
              }
              
              const totalPageCount = firstPageResponse.content.totalPageCount || 1;
              const allUsers = [...firstPageResponse.content.elements];
              
              // If there's only one page, return early
              if (totalPageCount <= 1) {
                  setUsers(allUsers);
                  clearErrors();
                  return { success: true, data: allUsers };
              }
              
              // Fetch all remaining pages in parallel
              const remainingPagePromises = [];
              for (let page = 2; page <= totalPageCount; page++) {
                  remainingPagePromises.push(fetchUsers(page, 10));
              }
              
              return Promise.all(remainingPagePromises)
                .then((responses) => {
                    // Check for errors in any response
                    const errors = [];
                    responses.forEach((r) => {
                        if (r.errors && r.errors.length > 0) {
                            errors.push(...r.errors);
                        } else {
                            allUsers.push(...r.content.elements);
                        }
                    });
                    
                    if (errors.length > 0) {
                        addErrors(errors);
                        return { success: false, errors };
                    }
                    
                    setUsers(allUsers);
                    clearErrors();
                    return { success: true, data: allUsers };
                });
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

