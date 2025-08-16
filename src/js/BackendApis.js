import axios from "axios";

export async function fetchUsers() {
    const response = await axios.get('http://localhost:8080/users/get')
    return  response.data['content']['elements'];
}

export async function fetchTasks(page, size) {
    const response = await axios.get(
      'http://localhost:8080/tasks/get',
      {params: {page: page, size: size}}
    )
    return  response.data['content']['elements'];
}

export async function addTask(title, description, priority, start, deadline, repeat, assignees) {
    const response = await axios.post(
      'http://localhost:8080/tasks/create',
      {title: title, description: description, priority: priority,
          start: start, deadline: deadline, repeat: repeat, assignees: assignees}
    )
    return  response.data['content'];
}