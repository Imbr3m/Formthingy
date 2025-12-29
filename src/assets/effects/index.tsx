// Effects assets export
import noise from './noise.png';
import bigger_noise from './bigger_noise.jpg';
import brokenTV from './brokenTV.jpg';
import glitch from './glitch.gif';
import glitch2 from './glitch2.gif';
import glitch2_jpg from './glitch2.jpg';
import live_grey from './live_grey.gif';
import live_light_grey from './live_light_grey.gif';
import trickal from './trickal.gif';

// Effects options with metadata
export const effectOptions = [
  { 
    value: 1, 
    label: '(None)', 
    image: null
  },
  { 
    value: 2, 
    label: 'Noise', 
    image: noise
  },
  { 
    value: 3, 
    label: 'Bigger Noise', 
    image: bigger_noise
  },
  { 
    value: 4, 
    label: 'Broken TV', 
    image: brokenTV
  },
  { 
    value: 5, 
    label: 'Glitch', 
    image: glitch
  },
  { 
    value: 6, 
    label: 'Glitch Two', 
    image: glitch2
  },
  { 
    value: 7, 
    label: 'Glitch Static', 
    image: glitch2_jpg
  },
  { 
    value: 8, 
    label: 'Live Grey', 
    image: live_grey
  },
  { 
    value: 9, 
    label: 'Live Light Grey', 
    image: live_light_grey
  },
  {
    value: 10,
    label: 'Trickal',
    image: trickal
  }
];

// Format for react95 Select component
export const effectSelectOptions = effectOptions.map(option => ({
  value: option.value,
  label: option.label
}));

// Export individual images for direct use
export {
  noise,
  bigger_noise,
  brokenTV,
  glitch,
  glitch2,
  glitch2_jpg,
  live_grey,
  live_light_grey,
  trickal
};
