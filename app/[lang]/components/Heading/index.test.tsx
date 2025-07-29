import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Heading from './index';

jest.mock('@/dictionary-provider', () => ({
  useDictionary: () => ({
    home: { menu: { register: 'Register' } },
  }),
}));
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Heading', () => {
  it('renders the logo', () => {
    render(<Heading />);
    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/img/svg/logo.svg');
  });

  it('renders navigation links', () => {
    render(<Heading />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders icons', () => {
    render(<Heading />);
    expect(screen.getByAltText('card')).toBeInTheDocument();
    expect(screen.getByAltText('search')).toBeInTheDocument();
  });

  it('renders the register button', () => {
    render(<Heading />);
    expect(screen.getByText('Register')).toBeInTheDocument();
  });
}); 