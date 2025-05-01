import { describe, test, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Favorites from '../components/Favorites';
import api from '../api/api';

vi.mock('../api/api', () => ({
  default: {
    delete: vi.fn()
  }
}));

describe('Componente Favorites', () => {
  const mockFavorites = [
    { id: 1, city: 'Madrid, España' },
    { id: 2, city: 'Paris, Francia' }
  ];

  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
    window.location.href = '';
  });

  test('Muestra estado de carga', () => {
    render(<Favorites loading={true} favorites={[]} />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  test('Muestra errores correctamente', () => {
    const errorMessage = 'Error de conexión';
    render(<Favorites error={errorMessage} favorites={[]} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('Muestra mensaje cuando no hay favoritos', () => {
    render(<Favorites favorites={[]} />);
    expect(screen.getByText(/no hay ciudades favoritas/i)).toBeInTheDocument();
  });

  test('Muestra lista de favoritos', () => {
    render(<Favorites favorites={mockFavorites} />);
    expect(screen.getAllByTestId('favorite-item')).toHaveLength(2);
  });

  test('Elimina favorito al hacer clic en X', async () => {
    const mockOnUpdate = vi.fn();
    api.delete.mockResolvedValueOnce({});

    render(<Favorites favorites={mockFavorites} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getAllByTestId('delete-button')[0]);
    
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/favorites/1');
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });
});