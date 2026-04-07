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
            src: ['./src/assets/fonts/Inter.woff2'],
            weight: '100 900',
            style: 'normal'
          }
        ]
      }
    }
  ]
});

