import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, vi } from 'vitest';
import History from '../components/History';

describe('Componente History', () => {
  const mockHistory = [
    'Madrid, España',
    'Paris, Francia',
    'Berlin, Alemania',
    'Londres, Reino Unido'
  ];

  test('Muestra elementos del historial correctamente', () => {
    render(<History history={mockHistory} onHistoryClick={vi.fn()} />);
    
    // Obtener el texto de cada elemento de la lista
    const items = screen.getAllByRole('listitem');
    const texts = items.map(item => 
      item.textContent.replace(/\s+/g, ' ').trim()
    );
    
    expect(texts).toContain('Madrid, España');
    expect(texts).toContain('Paris, Francia');
    expect(items).toHaveLength(4);
  });

  test('Muestra máximo 12 elementos', () => {
    const longHistory = Array(15).fill('Ciudad, País');
    render(<History history={longHistory} onHistoryClick={vi.fn()} />);
    
    expect(screen.getAllByRole('listitem')).toHaveLength(12);
  });

  test('Muestra mensaje cuando el historial está vacío', () => {
    render(<History history={[]} onHistoryClick={vi.fn()} />);
    
    expect(screen.queryByRole('listitem')).toBeNull();
  });
});