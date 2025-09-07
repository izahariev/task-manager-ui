import axios from "axios";
import * as qs from "qs";

export async function fetchUsers() {
    const response = await axios.get('http://localhost:8080/users/get')
    return  response.data['content']['elements'];
}

export async function fetchAllTasks(page, size) {
    const response = await axios.get(
      'http://localhost:8080/tasks/get',
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

export async function addTask(title, description, priority, start, deadline, repeat, assignees) {
    const response = await axios.post(
      'http://localhost:8080/tasks/create',
      {title: title, description: description, priority: priority,
          start: start, deadline: deadline, repeat: repeat, assignees: assignees}
    )
    return  response.data['content'];
}