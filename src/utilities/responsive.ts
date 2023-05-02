import { useMediaQuery as mediaQuery } from 'react-responsive';

export const desktopMediaQuery = () => {
  return mediaQuery({ minWidth: 1200 });
};

export const tabletMediaQuery = () => {
  return mediaQuery({ minWidth: 600 });
};

export const mobileMediaQuery = () => {
  return mediaQuery({ minWidth: 300 });
};
