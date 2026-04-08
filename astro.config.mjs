import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Inter",
      cssVariable: "--font-inter",
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/Inter-VariableFont_opsz,wght.ttf'],
            weight: '100 900',
            style: 'normal',
          },
          {
            src: ['./src/assets/fonts/Inter-Italic-VariableFont_opsz,wght.ttf'],
            weight: '100 900',
            style: 'italic',
          }
        ]
      }
    }
  ]
});

