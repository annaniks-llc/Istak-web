import React from 'react';
import { render, screen } from '@testing-library/react';
import FirstSlider from './index';

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock dictionary
jest.mock('@/dictionary-provider', () => ({
  useDictionary: () => ({
    home: {
      hero: {
        title: 'Premium Alcoholic Beverages',
        subtitle: 'Discover the finest selection of spirits, wines, and craft beers',
        cta: 'Shop Now',
      },
    },
  }),
}));

describe('FirstSlider', () => {
  it('renders the slider container', () => {
    render(<FirstSlider />);

    const sliderContainer = screen.getByTestId('slider');
    expect(sliderContainer).toBeInTheDocument();
  });

  it('renders the main heading and title', () => {
    render(<FirstSlider />);

    // Check if the main heading is rendered
    expect(screen.getByText('ISTAK - Ավանդույթի ուժով')).toBeInTheDocument();

    // Check if the subtitle is rendered (using partial text match)
    expect(screen.getByText(/Հայկական վարպետությամբ/)).toBeInTheDocument();
  });

  it('renders the custom button', () => {
    render(<FirstSlider />);

    const button = screen.getByTestId('custom-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Գնել հիմա');
  });

  it('renders navigation buttons', () => {
    render(<FirstSlider />);

    // Check if navigation buttons are rendered
    const navigationButtons = screen.getAllByRole('button');
    expect(navigationButtons.length).toBeGreaterThan(1);
  });

  it('renders navigation arrow images', () => {
    render(<FirstSlider />);

    const arrowImages = screen.getAllByRole('img');
    expect(arrowImages.length).toBeGreaterThanOrEqual(2);

    // Check if left arrow is present
    const leftArrow = arrowImages.find((img) => img.getAttribute('alt') === 'arrowleft');
    expect(leftArrow).toBeInTheDocument();

    // Check if right arrow is present
    const rightArrow = arrowImages.find((img) => img.getAttribute('alt') === 'arrowRight');
    expect(rightArrow).toBeInTheDocument();
  });

  it('renders slider items with correct content', () => {
    render(<FirstSlider />);

    // Check if slider items are rendered (should be 6 based on the component)
    const slider = screen.getByTestId('slider');
    expect(slider).toBeInTheDocument();

    // Check if the first slide content is rendered
    expect(screen.getByText('ISTAK - Ավանդույթի ուժով')).toBeInTheDocument();
    expect(screen.getByText(/Հայկական վարպետությամբ/)).toBeInTheDocument();
  });

  it('renders slider with correct structure', () => {
    render(<FirstSlider />);

    const slider = screen.getByTestId('slider');
    expect(slider).toBeInTheDocument();

    // Check if the slider container exists
    expect(slider).toBeInTheDocument();

    // Check if the main content is rendered
    expect(screen.getByText('ISTAK - Ավանդույթի ուժով')).toBeInTheDocument();
  });
});
