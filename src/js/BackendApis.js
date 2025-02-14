import axios from "axios";

export async function fetchUsers() {
    const response = await axios.get('http://localhost:8080/users/get')
    return  response.data['content']['elements'];
};