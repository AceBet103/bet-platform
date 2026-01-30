const API_URL = process.env.REACT_APP_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API Error");

  return data;
};
