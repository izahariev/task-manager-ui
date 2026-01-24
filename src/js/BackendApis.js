import axios from "axios";
import * as qs from "qs";

export async function fetchUsers(page = 1, size = 10) {
    const response = await axios.get('http://localhost:8080/users/get', {
        params: { page, size }
    });
    return response.data;
}

export async function fetchTask(id) {
    const response = await axios.get('http://localhost:8080/tasks/' + id);
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

    const response = await axios.get("http://localhost:8080/tasks/list", {
        params,
        paramsSerializer: {
            serialize: p => qs.stringify(p, { arrayFormat: "repeat" })
        }
    });
    return response.data;
}

export async function addTask(task) {
    const response = await axios.post(
      'http://localhost:8080/tasks/create',
      {parentTaskId: task.parentTaskId, title: task.title, description: task.description, priority: task.priority,
          start: task.startTime, deadline: task.deadline, repeat: task.repeat, assignees: task.assignees}
    )
    return  response.data;
}

export async function updateTask(id, updatedFields) {
    const response = await axios.patch('http://localhost:8080/tasks/' + id, updatedFields);
    return  response.data;
}

export async function deleteTask(id) {
    const response = await axios.delete('http://localhost:8080/tasks/' + id);
    return response.data;
}

export async function createUser(name) {
    const response = await axios.post('http://localhost:8080/users/create', null, {params: {name}});
    return response.data;
}

export async function updateUser(originalName, newName) {
    const response = await axios.patch('http://localhost:8080/users/update', null, {
        params: {
            originalName,
            newName
        }
    });
    return response.data;
}

export async function deleteUser(id) {
    const response = await axios.delete('http://localhost:8080/users/remove', {params: {id}});
    return response.data;
}