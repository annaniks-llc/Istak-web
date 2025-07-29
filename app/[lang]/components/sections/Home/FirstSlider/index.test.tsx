import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FirstSlider from './index';

// Mock react-slick
jest.mock('react-slick', () => {
  return function MockSlider({ children, ...props }: any) {
    return (
      <div data-testid="slider" {...props}>
        {children}
      </div>
    );
  };
});

// Mock the Button component
jest.mock('../../../Button', () => {
  return function MockButton({ text, variant, onClick }: any) {
    return (
      <button data-testid="custom-button" onClick={onClick}>
        {text}
      </button>
    );
  };
});

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
    const leftArrow = arrowImages.find(img => img.getAttribute('alt') === 'arrowleft');
    expect(leftArrow).toBeInTheDocument();
    
    // Check if right arrow is present
    const rightArrow = arrowImages.find(img => img.getAttribute('alt') === 'arrowRight');
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