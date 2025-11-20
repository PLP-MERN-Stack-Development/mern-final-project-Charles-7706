import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../Login';
import { AppContext } from '../../context/AppContext';

const mockLogin = jest.fn();
const mockContextValue = {
  login: mockLogin,
};

const renderLogin = (onToggleMode = jest.fn()) => {
  return render(
    <AppContext.Provider value={mockContextValue}>
      <Login onToggleMode={onToggleMode} />
    </AppContext.Provider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  it('renders login form', () => {
    renderLogin();
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    mockLogin.mockResolvedValue({ success: true });
    renderLogin();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('displays error message on login failure', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });
    renderLogin();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('calls onToggleMode when sign up link is clicked', () => {
    const mockToggle = jest.fn();
    renderLogin(mockToggle);

    fireEvent.click(screen.getByText('Sign up'));
    expect(mockToggle).toHaveBeenCalled();
  });
});