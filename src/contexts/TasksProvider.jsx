import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";
import {fetchTasks} from "../js/BackendApis.js";
import {useActiveTab} from "./ActiveTabContext.jsx";
import {useErrors} from "./ErrorMessagesContext.jsx";
import {TasksContext} from "./TasksContext";

export function TasksProvider({ children }) {
    const [tasks, setTasks] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageCount, setPageCount] = React.useState(0);
    const [tasksRefreshTimestamp, setTasksRefreshTimestamp] = React.useState(0);
    const {addErrors, clearErrors} = useErrors();
    const {activeTab} = useActiveTab();
    const currentPageRef = React.useRef(currentPage);
    const refreshTasksRef = React.useRef(() => {});

    React.useEffect(() => {
        currentPageRef.current = currentPage;
    }, [currentPage]);

    const refreshTasks = React.useCallback((filters = {}) => {
        const {
            parentTaskId = null,
            priority = null,
            title = null,
            startDate = activeTab === "active" || activeTab === "completed" ? null : dayjs(),
            deadline = null,
            isCompleted = activeTab === "completed",
            assignees = null,
            page = currentPageRef.current,
            size = 9,
            completionDate = null,
        } = filters;

        return fetchTasks(parentTaskId, priority, title, startDate, deadline, completionDate, isCompleted, assignees,
          page, size)
          .then((r) => {
              if (r.errors.length > 0) {
                  addErrors(r.errors);
                  return { success: false, errors: r.errors };
              }
              setTasks(r.content.elements);
              setPageCount(r.content.totalPageCount);
              if (page !== currentPageRef.current) setCurrentPage(page);
              setTasksRefreshTimestamp(Date.now());
              clearErrors();
              return { success: true, data: r.content };
          })
          .catch((error) => {
              const errors = error.response?.data?.errors
                ? error.response.data.errors.map((e) => e.description)
                : ["An unexpected error occurred"];
              addErrors(errors);
              return { success: false, errors };
          });
    }, [addErrors, clearErrors, activeTab]);

    React.useEffect(() => {
        refreshTasksRef.current = refreshTasks;
    }, [refreshTasks]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            refreshTasksRef.current();
        }, 60000);
        return () => clearInterval(intervalId);
    }, [activeTab]);

    const value = React.useMemo(
      () => ({
          tasks,
          setTasks,
          currentPage,
          pageCount,
          setPageCount,
          refreshTasks,
          tasksRefreshTimestamp,
      }),
      [tasks, currentPage, pageCount, refreshTasks, tasksRefreshTimestamp]
    );

    return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

TasksProvider.propTypes = {
    children: PropTypes.node,
};
