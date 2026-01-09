import PropTypes from "prop-types";
import React from "react";
import {fetchTasks} from "../js/BackendApis.js";
import {TasksContext} from "./TasksContext";

export function TasksProvider({ children }) {
    const [tasks, setTasks] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageCount, setPageCount] = React.useState(0);
    const [errorMessages, setErrorMessages] = React.useState([]);
    const currentPageRef = React.useRef(currentPage);

    React.useEffect(() => {
        currentPageRef.current = currentPage;
    }, [currentPage]);

    const refreshTasks = React.useCallback((filters = {}) => {
        const {
            parentTaskId = null,
            priority = null,
            title = null,
            deadline = null,
            isCompleted = false,
            assignees = null,
            page = currentPageRef.current,
            size = 9,
        } = filters;

        return fetchTasks(parentTaskId, priority, title, deadline, isCompleted, assignees, page, size)
          .then((r) => {
              if (r.errors.length > 0) {
                  setErrorMessages([...r.errors]);
                  return { success: false, errors: r.errors };
              }
              setTasks(r.content.elements);
              setPageCount(r.content.totalPageCount);
              if (page !== currentPageRef.current) setCurrentPage(page);
              setErrorMessages([]);
              return { success: true, data: r.content };
          })
          .catch((error) => {
              const errors = error.response?.data?.errors
                ? error.response.data.errors.map((e) => e.description)
                : ["An unexpected error occurred"];
              setErrorMessages([...errors]);
              return { success: false, errors };
          });
    }, []);

    const value = React.useMemo(
      () => ({
          tasks,
          setTasks,
          currentPage,
          pageCount,
          errorMessages,
          setPageCount,
          setErrorMessages,
          refreshTasks,
      }),
      [tasks, currentPage, pageCount, errorMessages, refreshTasks]
    );

    return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

TasksProvider.propTypes = {
    children: PropTypes.node,
};
