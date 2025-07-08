export const FONT_SIZES = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
  xl: 'text-xl'
};

export const applyAccessibilitySettings = (settings: any) => {
  const root = document.documentElement;
  
  // Apply dark mode
  if (settings.darkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Apply high contrast
  if (settings.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }
  
  // Apply reduced motion
  if (settings.reduceMotion) {
    root.classList.add('reduce-motion');
  } else {
    root.classList.remove('reduce-motion');
  }
};

export const getStoredSettings = () => {
  try {
    const stored = localStorage.getItem('healthquery-accessibility');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const saveSettings = (settings: any) => {
  try {
    localStorage.setItem('healthquery-accessibility', JSON.stringify(settings));
  } catch {
    // Silently fail if localStorage is not available
  }
};