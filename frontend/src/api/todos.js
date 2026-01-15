const API_URL = "http://localhost:5000/api/todos";

export async function fetchTodos() {
    const response = await fetch(`${API_URL}/todos`);

    if(!response.ok) {
        throw new Error("Failed to fetch todos");
    }
return response.json(); 
}