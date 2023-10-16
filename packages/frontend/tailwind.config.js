module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        fontFamily: {
            sans: ['Inter', 'sans-serif']
        },
        extend: {
            colors: {
                primary: {
                    50: '#EDF5F2',
                    100: '#DCEDC8',
                    200: '#C5E1A5',
                    300: '#AED581',
                    400: '#9CCC65',
                    500: '#8BC34A',
                    600: '#7CB342',
                    700: '#689F38',
                    800: '#558B2F',
                    900: '#33691E',
                },
                secondary: {
                    50: '#FFF0C2',
                    100: '#FFE0B2',
                    200: '#FFCC80',
                    300: '#FFB74D',
                    400: '#FFA726',
                    500: '#FF9800',
                    600: '#FB8C00',
                    700: '#F57C00',
                    800: '#EF6C00',
                    900: '#E65100',
                },
                gray: {
                    50: '#f7f8f9',
                    100: '#f7fafc',
                    200: '#edf2f7',
                    300: '#e1e7ef',
                    400: '#ccd5e0',
                    500: '#9eacbf',
                    600: '#748093',
                    700: '#4a5568',
                    800: '#2c3647',
                    900: '#191f2b',
                }
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/forms'),
    ],
}
