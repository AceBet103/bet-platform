export async function apiFetch(url, options = {}) {
  let accessToken = localStorage.getItem("accessToken");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options.headers
    }
  });

  if (res.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    const refreshRes = await fetch("http://localhost:5000/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });

    const refreshData = await refreshRes.json();

    if (refreshData.accessToken) {
      localStorage.setItem("accessToken", refreshData.accessToken);

      return fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshData.accessToken}`,
          ...options.headers
        }
      });
    } else {
      localStorage.clear();
      window.location.href = "/";
    }
  }

  return res;
}
