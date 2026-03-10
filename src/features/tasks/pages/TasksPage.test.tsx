import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { TasksPage } from './TasksPage';
import { taskAPI } from '../../../services/api';

const { mockNavigate } = vi.hoisted(() => {
  return { mockNavigate: vi.fn() };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../services/api', () => ({
  taskAPI: {
    getTasks: vi.fn(),
    deleteTask: vi.fn(),
  }
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('TasksPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {}); 
  });

  it('should display loading message when fetching tasks', () => {
    vi.mocked(taskAPI.getTasks).mockResolvedValueOnce([]);
    renderWithRouter(<TasksPage />);
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('should display task list when fetching tasks is successful', async () => {
    const mockTasks = [
      { id: '1', title: 'เรียน Vite.js', description: 'ทำโปรเจกต์ส่ง', status: 'pending' as const }
    ];
    vi.mocked(taskAPI.getTasks).mockResolvedValueOnce(mockTasks);
    renderWithRouter(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText('เรียน Vite.js')).toBeInTheDocument();
    });
  });

  it('should navigate to login page when logout button is clicked', async () => {
    vi.mocked(taskAPI.getTasks).mockResolvedValueOnce([]);
    renderWithRouter(<TasksPage />);
    
    const logoutBtn = await screen.findByRole('button', { name: /Logout/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('should handle API Error when fetching tasks fails', async () => {
    vi.mocked(taskAPI.getTasks).mockRejectedValueOnce(new Error('API Error'));
    renderWithRouter(<TasksPage />);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  it('should allow deleting a task', async () => {
    const mockTasks = [
      { id: '1', title: 'Task สำหรับลบ', description: 'เทสต์ลบ', status: 'pending' as const }
    ];

    vi.mocked(taskAPI.getTasks)
      .mockResolvedValueOnce(mockTasks)
      .mockResolvedValueOnce([]); 
      
    vi.mocked(taskAPI.deleteTask).mockResolvedValueOnce();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderWithRouter(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText('Task สำหรับลบ')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByRole('button', { name: 'Delete' }); 
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(taskAPI.deleteTask).toHaveBeenCalledWith('1');
    });
  });

  it('should allow editing a task and navigate to the form', async () => {
    const mockTasks = [
      { id: '1', title: 'Task สำหรับแก้ไข', description: 'เทสต์แก้ไข', status: 'pending' as const }
    ];

    vi.mocked(taskAPI.getTasks).mockResolvedValue(mockTasks);
    
    renderWithRouter(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText('Task สำหรับแก้ไข')).toBeInTheDocument();
    });

    const editBtn = screen.getByRole('button', { name: 'Edit' });
    fireEvent.click(editBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/tasks/edit/1');
  });

  it('should handle API Error when deleting a task fails', async () => {
    const mockTasks = [
      { id: '1', title: 'Task พังตอนลบ', description: 'เทสต์', status: 'pending' as const }
    ];
  
    vi.mocked(taskAPI.getTasks)
      .mockResolvedValueOnce(mockTasks)
      .mockResolvedValueOnce(mockTasks);

    vi.mocked(taskAPI.deleteTask).mockRejectedValueOnce(new Error('Delete Failed'));
    
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithRouter(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText('Task พังตอนลบ')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  it('should allow creating a new task and navigate to the form', async () => {
    
    vi.mocked(taskAPI.getTasks).mockResolvedValue([]);
    
    renderWithRouter(<TasksPage />);

    const createBtn = await screen.findByRole('button', { name: 'Create New Task' });
    
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/tasks/new');
    });
  });
  it('should not delete data if the user clicks Cancel in the confirmation dialog', async () => {
    const mockTasks = [
      { id: '1', title: 'Task ยกเลิกการลบ', description: 'เทสต์', status: 'pending' as const }
    ];
    vi.mocked(taskAPI.getTasks).mockResolvedValue(mockTasks);
    
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderWithRouter(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText('Task ยกเลิกการลบ')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteBtn);

  });

  it('should display the "Completed" status label for completed tasks', async () => {
    const mockTasks = [
      { id: '2', title: 'Task ที่ทำเสร็จแล้ว', description: 'เทสต์สถานะ', status: 'completed' as const }
    ];
    vi.mocked(taskAPI.getTasks).mockResolvedValue(mockTasks);

    renderWithRouter(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText('Task ที่ทำเสร็จแล้ว')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });
});