import { defineConfig, presetAttributify, presetUno, presetIcons, presetWebFonts, presetTypography } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      prefix: ['i-', ''],
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500',
        mono: 'Fira Code',
      },
    }),
    presetTypography(),
  ],
});
