import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import CardsPage from './page';

jest.mock('@/dictionary-provider', () => ({
  useDictionary: () => ({
    cards: { heading: 'Cards' },
  }),
}));

describe('CardsPage', () => {
  it('renders cards heading and card items', () => {
    render(<CardsPage />);
    expect(screen.getByText('Cards')).toBeInTheDocument();
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
    expect(screen.getByText('Card 3')).toBeInTheDocument();
  });
}); 