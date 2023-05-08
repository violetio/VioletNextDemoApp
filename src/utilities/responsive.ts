import { useMediaQuery } from 'react-responsive';

export const useDesktopMediaQuery = () => useMediaQuery({ minWidth: 1200 });

export const useTabletMediaQuery = () => useMediaQuery({ minWidth: 600 });

export const useMobileMediaQuery = () => useMediaQuery({ minWidth: 300 });
