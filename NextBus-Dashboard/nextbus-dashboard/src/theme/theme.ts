export const theme = {
  colors: {
    light: {
      gradientStart: '#d7e9eb', // Light teal gradient start
      gradientEnd: '#ffffff',   // White gradient end
      primary: '#008080',       // Light teal
      secondary: '#006666',
      surface: '#d7e9eb',
      error: '#c62828',
      text: {
        primary: '#171717',
        secondary: '#424242',
        hint: '#616161',
        disabled: '#9e9e9e',
      },
      card: {
        background: 'rgba(255, 255, 255, 0.9)',
      },
      button: {
        background: '#008080',
        text: '#ffffff',
      },
      input: {
        background: 'rgba(255, 255, 255, 0.9)',
        border: 'rgba(0, 0, 0, 0.12)',
        focusedBorder: '#00f2ff',
        errorBorder: '#c62828',
      }
    },
    dark: {
      gradientStart: '#0f1515', // Dark gradient start
      gradientEnd: '#182222',   // Dark gradient end
      primary: '#008080',       // Teal
      secondary: '#00B3B3',
      surface: '#0f1515',
      error: '#c62828',
      text: {
        primary: '#ffffff',
        secondary: '#e0e0e0',
        hint: '#bdbdbd',
        disabled: '#757575',
      },
      card: {
        background: 'rgba(24, 34, 34, 0.9)',
      },
      button: {
        background: '#00B3B3',
        text: '#ffffff',
      },
      input: {
        background: 'rgba(24, 34, 34, 0.7)',
        border: 'rgba(255, 255, 255, 0.24)',
        focusedBorder: '#005757',
        errorBorder: '#c62828',
      }
    }
  },
  borderRadius: {
    small: '2px',
    medium: '5px',
    large: '12px',
  },
  fontFamily: {
    primary: 'Montserrat, sans-serif',
  },
  fontWeight: {
    normal: 500,
    bold: 900,
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    medium: '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
    large: '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)',
  }
}; 