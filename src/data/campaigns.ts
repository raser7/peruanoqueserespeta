import type { ImageMetadata } from 'astro';
import photo01 from '../assets/images/images/photo_2026-10-06_14-39-59.jpg';
import photo02 from '../assets/images/images/photo_2026-10-06_14-57-13.jpg';
import photo03 from '../assets/images/images/photo_2026-10-06_15-08-09.jpg';
import photo04 from '../assets/images/images/photo_2026-10-06_15-16-45.jpg';
import photo05 from '../assets/images/images/photo_2026-10-06_22-01-26.jpg';

export interface Campaign {
  number: string;
  cta: string;
  href: string;
  image: ImageMetadata;
  imageAlt: string;
  theme: 'pink' | 'yellow' | 'paper' | 'lime' | 'blue';
}

// Fotos asignadas en orden cronológico. Edita aquí el contenido de cada canal.
export const campaigns: Campaign[] = [
  {
    number: '01', cta: 'Entra aquí', href: 'https://t.me/+DvrQRAt1zRc4ZmEx', image: photo01,
    imageAlt: 'Collage de retratos y fotografías junto a una piscina y una cascada.', theme: 'pink',
  },
  {
    number: '02', cta: 'Entra aquí', href: 'https://t.me/+0VkNvTpxJnNmODMx', image: photo02,
    imageAlt: 'Collage de moda con un vestido azul, un look urbano y un traje de baño rosado.', theme: 'yellow',
  },
  {
    number: '03', cta: 'Entra aquí', href: 'https://t.me/+UsXXiAQY6ctiMmQx', image: photo03,
    imageAlt: 'Collage de fotografías de verano junto al agua y la naturaleza.', theme: 'paper',
  },
  {
    number: '04', cta: 'Entra aquí', href: 'https://t.me/+axFrUAfB_YBiODYx', image: photo04,
    imageAlt: 'Collage de retratos con uniforme y fotografías de verano junto a una piscina.', theme: 'lime',
  },
  {
    number: '05', cta: 'Entra aquí', href: 'https://t.me/+qBphnusW2CIwNjFh', image: photo05,
    imageAlt: 'Collage de retratos y fotografías de moda, con un paisaje de montañas y llamas.', theme: 'blue',
  },
];
