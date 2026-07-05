// const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || "http://localhost:3000";

// export const getApiBaseUrl = () => API_BASE_URL;

// export const apiUrl = (path: string) => {
//   const normalizedPath = path.startsWith("/") ? path : `/${path}`;
//   return `${API_BASE_URL}${normalizedPath}`;
// };

// export const parseApiError = async (response: Response) => {
//   try {
//     const payload = (await response.json()) as { message?: string };
//     return payload.message || `Request failed with status ${response.status}`;
//   } catch {
//     return `Request failed with status ${response.status}`;
//   }
// };


const API_BASE_URL = ((import.meta.env.VITE_API_BASE_URL as string | undefined) || "http://localhost:3000").replace(/\/$/, "");


export const getApiBaseUrl = () => API_BASE_URL;

export const apiUrl = (path: string) => {
  if (!API_BASE_URL) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const parseApiError = async (response: Response) => {
  try {
    const payload = (await response.json()) as { message?: string };
    return payload.message || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
};
