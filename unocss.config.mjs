import { presetUno, presetAttributify, presetIcons } from 'unocss';
import colors from 'tailwindcss/colors';

export default {
    presets: [
        presetUno(),
        presetAttributify(),
        presetIcons(),
    ],
    theme: {
        colors: {
            ...colors,
        },
    },
    include: [
        './src/**/*.{vue,js,ts,jsx,tsx}',
        './index.html',
    ],
};
