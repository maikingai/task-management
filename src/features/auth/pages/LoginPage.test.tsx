import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios'; //
import { LoginPage } from './LoginPage';

vi.mock('axios');

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

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('LoginPage Component', () => {

  it('should display Error when user enters invalid email format', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginPage />);
    const emailInput = screen.getByPlaceholderText('admin@nodesnow.com');
    
    await user.type(emailInput, 'wrongemail');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Invalid email format (e.g. user@example.com)')).toBeInTheDocument();
    });
  });

  it('should login successfully and navigate to /tasks when submit is pressed', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    (axios.post as any).mockResolvedValueOnce({
      data: { access_token: 'mock_fake_token' }
    });

    renderWithRouter(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('admin@nodesnow.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: /Login/i });

    await user.type(emailInput, 'admin@test.com');
    await user.type(passwordInput, 'password123');
    
    await waitFor(() => {
      expect(submitBtn).toBeEnabled();
    });

    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    });
  });

  it('should display Error on the page when email or password is incorrect', async () => {
    const user = userEvent.setup();
    
    (axios.post as any).mockRejectedValueOnce({
      response: { data: { message: 'Invalid email or password. Please try again' } }
    });

    renderWithRouter(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('admin@nodesnow.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: /Login/i });

    await user.type(emailInput, 'wrong@test.com');
    await user.type(passwordInput, 'wrongpass');
    
    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });

    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Login failed, please try again')).toBeInTheDocument();
    });
  });

  it('should show red border on password field when no data is entered', async () => {
    renderWithRouter(<LoginPage />);

    const passwordInput = screen.getByPlaceholderText('••••••••');

    fireEvent.focus(passwordInput);
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(passwordInput).toHaveClass('border-red-500');
    });
  });
});