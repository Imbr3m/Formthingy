// Background assets export
import bg0 from './bg0.png';
import bg1 from './bg1.png';
import bg2 from './bg2.jpg';
import bg3 from './bg3.jpg';
import bg5 from './bg5.png';
import bg6 from './bg6.jpg';
import bg7 from './bg7.png';
import bg8 from './bg8.png';
import bg9 from './bg9.jpg';
import bgpc from './bgpc.png';
import mikuXshrek from './mikuXshrek.gif';

// Background options with metadata
export const backgroundOptions = [
  { 
    value: 1, 
    label: '(None)', 
    color: '#098684', 
    image: null, 
    barColor: '#14045c'
  },
  { 
    value: 2, 
    label: 'Purple Summer', 
    color: '#3F4565', 
    image: bg1, 
    barColor: '#3F4565'
  },
  { 
    value: 3, 
    label: 'Matt Blue', 
    color: '#456EA6', 
    image: bg2, 
    barColor: '#456EA6'
  },
  { 
    value: 4, 
    label: 'Matt Green', 
    color: '#008081', 
    image: bg3, 
    barColor: '#008081'
  },
  { 
    value: 5, 
    label: 'Blue Sky', 
    color: '#4B6894', 
    image: bg5, 
    barColor: '#4B6894'
  },
  { 
    value: 6, 
    label: 'Dark Tone', 
    color: '#313439', 
    image: bg6, 
    barColor: '#313439'
  },
  { 
    value: 7, 
    label: 'Light Pink', 
    color: '#f3aac0', 
    image: bg7, 
    barColor: '#1c1719'
  },
  { 
    value: 8, 
    label: 'Deep Ocean', 
    color: '#3F4565', 
    image: bg8, 
    barColor: '#3F4565'
  },
  { 
    value: 9, 
    label: 'Purple Blue', 
    color: '#354092', 
    image: bg9, 
    barColor: '#354092'
  },
  {
    value: 10,
    label: 'Miku X Shrek',
    color: '#000000',
    image: mikuXshrek,
    barColor: '#000000'
  }
];

// Format for react95 Select component
export const selectOptions = backgroundOptions.map(option => ({
  value: option.value,
  label: option.label
}));

// Export individual images for direct use
export {
  bg0,
  bg1,
  bg2,
  bg3,
  bg5,
  bg6,
  bg7,
  bg8,
  bg9,
  bgpc,
  mikuXshrek
};
