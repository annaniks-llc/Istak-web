import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './index';

jest.mock('@/dictionary-provider', () => ({
  useDictionary: () => ({}),
}));

describe('Button', () => {
  const variants = ['primary', 'secondary', 'light'] as const;

  it('renders with the correct text', () => {
    render(<Button text="Click me" variant="primary" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  variants.forEach((variant) => {
    it(`applies the correct class for variant: ${variant}`, () => {
      render(<Button text="Test" variant={variant} onClick={() => {}} />);
      const button = screen.getByRole('button');
      expect(button.className).toContain(variant);
    });
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button text="Click" variant="primary" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
