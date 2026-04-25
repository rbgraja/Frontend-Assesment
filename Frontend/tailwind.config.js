export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 50px rgba(15, 23, 42, 0.08)',
      },
      colors: {
        'heyy-purple': '#6C63FF',
        'heyy-gray': '#F4F6FB',
      },
    },
  },
  plugins: [],
};
