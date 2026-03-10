import axios from 'axios';

export interface Task {
  id: string; 
  title: string;
  description: string;
  status: 'pending' | 'completed';
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const taskAPI = {
  getTasks: async () => {
    const response = await apiClient.get<Task[]>('/tasks');
    return response.data;
  },
  
  getTaskById: async (id: string) => {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (task: Omit<Task, 'id'>) => {
    const response = await apiClient.post<Task>('/tasks', task);
    return response.data;
  },

  updateTask: async (id: string, task: Partial<Task>) => {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  deleteTask: async (id: string) => {
    await apiClient.delete(`/tasks/${id}`);
  }
};