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
            src: ['./src/assets/fonts/static/Inter_24pt-Thin.ttf'],
            weight: '100',
            style: 'normal'
          },
          {
            src: ['./src/assets/fonts/static/Inter_24pt-ExtraLight.ttf'],
            weight: '200',
            style: 'normal'
          },
          {
            src: ['./src/assets/fonts/static/Inter_24pt-Light.ttf'],
            weight: '300',
            style: 'normal'
          },
          {
            src: ['./src/assets/fonts/static/Inter_24pt-Regular.ttf'],
            weight: '400',
            style: 'normal'
          },
          {
            src: ['./src/assets/fonts/static/Inter_24pt-Medium.ttf'],
            weight: '500',
            style: 'normal'
          },
          {
            src: ['./src/assets/fonts/static/Inter_24pt-SemiBold.ttf'],
            weight: '600',
            style: 'normal'
          },
          {
            src: ['./src/assets/fonts/static/Inter_24pt-Bold.ttf'],
            weight: '700',
            style: 'normal'
          },
          {
            src: ['./src/assets/fonts/static/Inter_24pt-ExtraBold.ttf'],
            weight: '800',
            style: 'normal'
          },
          {
            src: ['./src/assets/fonts/static/Inter_24pt-Black.ttf'],
            weight: '900',
            style: 'normal'
          }
        ]
      }
    }
  ]
});

