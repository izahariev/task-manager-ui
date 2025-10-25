import axios from "axios";
import * as qs from "qs";

export async function fetchUsers() {
    const response = await axios.get('http://localhost:8080/users/get')
    return  response.data['content']['elements'];
}

export async function fetchTask(id) {
    const response = await axios.get('http://localhost:8080/tasks/' + id);
    return  response.data['content'];
}

export async function fetchAllTasks(page, size) {
    const response = await axios.get(
      'http://localhost:8080/tasks/list',
      {params: {page: page, size: size}}
    )
    return  response.data['content']['elements'];
}

export async function fetchTasks(priority, title, deadline, assignees, page, size) {
    const params = {
        page,
        size
    };

    if (priority) {
        params.priority = priority;
    }
    if (title) {
        params.title = title;
    }
    if (deadline) {
        params.deadline = deadline.format('YYYY-MM-DD').toString();
    }
    if (assignees && assignees.length > 0) {
        params.assignees = assignees;
    }

    const response = await axios.get("http://localhost:8080/tasks/get", {
        params,
        paramsSerializer: {
            serialize: p => qs.stringify(p, { arrayFormat: "repeat" })
        }
    });
    return response.data["content"]["elements"];
}

export async function addTask(task) {
    const response = await axios.post(
      'http://localhost:8080/tasks/create',
      {title: task.title, description: task.description, priority: task.priority,
          start: task.start, deadline: task.deadline, repeat: task.repeat, assignees: task.assignees}
    )
    return  response.data['content'];
}

export async function updateTask(id, updatedFields) {
    const response = await axios.patch('http://localhost:8080/tasks/' + id, updatedFields);
    return  response.data['content'];
}