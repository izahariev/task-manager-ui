import * as qs from "qs";
import api from "./Api.js";

export async function fetchUsers(page = 1, size = 10) {
    const response = await api.get('/users/get', {
        params: { page, size }
    });
    return response.data;
}

export async function fetchTask(id) {
    const response = await api.get('/tasks/' + id);
    return  response.data;
}

export async function fetchTasks(parentTaskId, priority, title, startDate, deadline, completionDate, isCompleted,
                                 assignees, page, size) {
    const params = {
        page,
        size
    };

    if (parentTaskId) {
        params.parentTaskId = parentTaskId;
    }

    if (priority) {
        params.priority = priority;
    }

    if (title) {
        params.title = title;
    }

    if (startDate) {
        params.startDate = startDate.format('YYYY-MM-DD').toString();
    }

    if (deadline) {
        params.deadline = deadline.format('YYYY-MM-DD').toString();
    }

    if (isCompleted !== null) {
        params.isCompleted = isCompleted;
    }

    if (assignees && assignees.length > 0) {
        params.assignees = assignees;
    }

    if (completionDate) {
        params.completionDate = completionDate.format('YYYY-MM-DD').toString();
    }

    const response = await api.get("/tasks/list", {
        params,
        paramsSerializer: {
            serialize: p => qs.stringify(p, { arrayFormat: "repeat" })
        }
    });
    return response.data;
}

export async function addTask(task) {
    const response = await api.post(
      '/tasks/create',
      {parentTaskId: task.parentTaskId, title: task.title, description: task.description, priority: task.priority,
          start: task.startTime, deadline: task.deadline, repeat: task.repeat, repeatPeriod: task.repeatPeriod,
          assignees: task.assignees}
    )
    return  response.data;
}

export async function updateTask(id, updatedFields) {
    const response = await api.patch('/tasks/' + id, updatedFields);
    return  response.data;
}

export async function completeTask(id) {
    const response = await api.patch('/tasks/' + id + '/complete');
    return response.data;
}

export async function deleteTask(id) {
    const response = await api.delete('/tasks/' + id);
    return response.data;
}

export async function createUser(name) {
    const response = await api.post('/users/create', null, {params: {name}});
    return response.data;
}

export async function updateUser(originalName, newName) {
    const response = await api.patch('/users/update', null, {
        params: {
            originalName,
            newName
        }
    });
    return response.data;
}

export async function deleteUser(id) {
    const response = await api.delete('/users/remove', {params: {id}});
    return response.data;
}