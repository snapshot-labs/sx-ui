// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

const withOpacity = variableName => {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }

    return `rgb(var(${variableName}))`;
  };
};

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'rgb(var(--border-color))',
        red: '#ff3856'
      },
      colors: {
        primary: 'var(--primary-color)',
        'skin-border': withOpacity('--border-color'),
        'skin-text': 'var(--text-color)',
        'skin-link': 'var(--link-color)',
        'skin-bg': 'var(--bg-color)',
        'skin-block-bg': 'var(--block-bg)',
        'skin-active': 'var(--active-bg)',
        'skin-hover': 'var(--hover-bg)',
        'skin-heading': 'var(--heading-color)',
        blue: '#384aff',
        green: '#21b66f',
        red: '#ff3856',
        'choice-for': '#21b66f',
        'choice-against': '#ff3856',
        'choice-abstain': colors.gray['500']
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    },
    screens: {
      xs: '420px',
      sm: '544px',
      md: '768px',
      lg: '1012px',
      xl: '1280px'
    },
    spacing: {
      0: '0px',
      1: '4px',
      2: '8px',
      2.5: '14px',
      3: '16px',
      4: '24px',
      5: '32px',
      6: '40px',
      7: '48px',
      8: '64px'
    },
    fontFamily: {
      serif: ['"Calibre", Helvetica, Arial, sans-serif']
    },
    fontSize: {
      '2xl': ['34px'],
      xl: ['28px'],
      lg: ['22px'],
      md: ['20px'],
      base: ['18px'],
      sm: ['17px'],
      xs: ['13px']
    }
  }
};
