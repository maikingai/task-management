import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { TaskFormPage } from './TaskFormPage';
import { taskAPI } from '../../../services/api';

const { mockNavigate, mockUseParams } = vi.hoisted(() => {
  return { 
    mockNavigate: vi.fn(),
    mockUseParams: vi.fn().mockReturnValue({ id: undefined })
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: mockUseParams,
  };
});

vi.mock('../../../services/api', () => ({
  taskAPI: {
    createTask: vi.fn(),
    updateTask: vi.fn(),
    getTaskById: vi.fn(),
  }
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('TaskFormPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ id: undefined }); 
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {}); 
  });

  it('should display Error when data entered is too short', async () => {
    renderWithRouter(<TaskFormPage />);
    const titleInput = screen.getByPlaceholderText('e.g. Learn about Vite.js');
    const descInput = screen.getByPlaceholderText('Enter task details...');
    
    fireEvent.change(titleInput, { target: { value: 'ab' } });
    fireEvent.blur(titleInput);
    fireEvent.change(descInput, { target: { value: 'short' } });
    fireEvent.blur(descInput);

    await waitFor(() => {
      expect(screen.getByText('Task name must have at least 5 characters')).toBeInTheDocument();
    });
  });

  it('Can create a new task successfully', async () => {
    vi.mocked(taskAPI.createTask).mockResolvedValueOnce({ 
      id: '2', title: 'Test', description: 'Test description', status: 'pending' 
    });
    
    renderWithRouter(<TaskFormPage />);
    const titleInput = screen.getByPlaceholderText('e.g. Learn about Vite.js');
    const descInput = screen.getByPlaceholderText('Enter task details...');
    const submitBtn = screen.getByRole('button', { name: /Save/i });

    fireEvent.change(titleInput, { target: { value: 'Write test to pass' } });
    fireEvent.change(descInput, { target: { value: 'Need to make Coverage reach 100%' } });

    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(taskAPI.createTask).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    });
  });

  it('should fetch old data and display it in edit mode, and allow updating', async () => {

    mockUseParams.mockReturnValue({ id: '1' });
    vi.mocked(taskAPI.getTaskById).mockResolvedValueOnce({
      id: '1', title: 'old data', description: 'old description', status: 'pending'
    });
    vi.mocked(taskAPI.updateTask).mockResolvedValueOnce({
      id: '1', title: 'updated', description: 'updated description', status: 'pending'
    });

    renderWithRouter(<TaskFormPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('old data')).toBeInTheDocument();
    });

    const titleInput = screen.getByDisplayValue('old data');
    fireEvent.change(titleInput, { target: { value: 'updated' } });
    
    const submitBtn = screen.getByRole('button', { name: /save/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(taskAPI.updateTask).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    });
  });

  it('should handle error when fetching old data to edit failed (API Error)', async ()=>{
    mockUseParams.mockReturnValue({ id: '99' });
    vi.mocked(taskAPI.getTaskById).mockRejectedValueOnce(new Error('Not Found'));
    
    renderWithRouter(<TaskFormPage />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  it('should handle Error when fetching old data to display in edit mode fails', async () => {

    mockUseParams.mockReturnValue({ id: '99' });
    
    vi.mocked(taskAPI.getTaskById).mockRejectedValueOnce(new Error('Fetch Error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithRouter(<TaskFormPage />);

    await waitFor(() => {
      
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  
  it('should handle Error or show Alert when saving data fails', async () => {
    
    mockUseParams.mockReturnValue({ id: undefined });
    
    vi.mocked(taskAPI.createTask).mockRejectedValueOnce(new Error('Save Error'));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithRouter(<TaskFormPage />);

    const titleInput = screen.getByPlaceholderText('e.g. Learn about Vite.js');
    const descInput = screen.getByPlaceholderText('Enter task details...');
  
    fireEvent.change(titleInput, { target: { value: 'Test save failure' } });
    fireEvent.change(descInput, { target: { value: 'Test description' } });

    const submitBtn = screen.getByRole('button', { name: /save/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  it('Should be able to click cancel button and navigate back to /tasks', async () => {
    renderWithRouter(<TaskFormPage />);
    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    });
  });
});