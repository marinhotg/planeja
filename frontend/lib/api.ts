const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const api = {
  baseURL: API_BASE_URL,

  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`);
    return response.json();
  },

  async post(endpoint: string, data: unknown) {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
