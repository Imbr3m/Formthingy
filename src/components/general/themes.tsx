// React95 themes export
import original from 'react95/dist/themes/original';
import olive from 'react95/dist/themes/olive';
import rose from 'react95/dist/themes/rose';
import vaporTeal from 'react95/dist/themes/vaporTeal';
import matrix from 'react95/dist/themes/matrix';
import tokyoDark from 'react95/dist/themes/tokyoDark';
import bee from 'react95/dist/themes/bee';
import azureOrange from 'react95/dist/themes/azureOrange';
import highContrast from 'react95/dist/themes/highContrast';
import ninjaTurtles from 'react95/dist/themes/ninjaTurtles';
import travel from 'react95/dist/themes/travel';
import theSixtiesUSA from 'react95/dist/themes/theSixtiesUSA';
import water from 'react95/dist/themes/water';
import counterStrike from 'react95/dist/themes/counterStrike';
import maple from 'react95/dist/themes/maple';
import blue from 'react95/dist/themes/blue';
import lilac from 'react95/dist/themes/lilac';
import cherry from 'react95/dist/themes/cherry';
import hotdogStand from 'react95/dist/themes/hotdogStand';
import powerShell from 'react95/dist/themes/powerShell';
import rainyDay from 'react95/dist/themes/rainyDay';
import plum from 'react95/dist/themes/plum';
import marine from 'react95/dist/themes/marine';
import honey from 'react95/dist/themes/honey';
import slate from 'react95/dist/themes/slate';

// Theme options with metadata
export const themeOptions = [
  { value: 1, label: 'Original', theme: original },
  { value: 2, label: 'Olive', theme: olive },
  { value: 3, label: 'Rose', theme: rose },
  { value: 4, label: 'Vapor Teal', theme: vaporTeal },
  { value: 5, label: 'Matrix', theme: matrix },
  { value: 6, label: 'Tokyo Dark', theme: tokyoDark },
  { value: 7, label: 'Bee', theme: bee },
  { value: 8, label: 'Azure Orange', theme: azureOrange },
  { value: 9, label: 'High Contrast', theme: highContrast },
  { value: 10, label: 'Ninja Turtles', theme: ninjaTurtles },
  { value: 11, label: 'Travel', theme: travel },
  { value: 12, label: 'The Sixties USA', theme: theSixtiesUSA },
  { value: 13, label: 'Water', theme: water },
  { value: 14, label: 'Counter Strike', theme: counterStrike },
  { value: 15, label: 'Maple', theme: maple },
  { value: 16, label: 'Blue', theme: blue },
  { value: 17, label: 'Lilac', theme: lilac },
  { value: 18, label: 'Cherry', theme: cherry },
  { value: 19, label: 'Hotdog Stand', theme: hotdogStand },
  { value: 20, label: 'PowerShell', theme: powerShell },
  { value: 21, label: 'Rainy Day', theme: rainyDay },
  { value: 22, label: 'Plum', theme: plum },
  { value: 23, label: 'Marine', theme: marine },
  { value: 24, label: 'Honey', theme: honey },
  { value: 25, label: 'Slate', theme: slate },
];

// Format for react95 Select component
export const themeSelectOptions = themeOptions.map(option => ({
  value: option.value,
  label: option.label
}));

// Export individual themes for direct use
export {
  original,
  olive,
  rose,
  vaporTeal,
  matrix,
  tokyoDark,
  bee,
  azureOrange,
  highContrast,
  ninjaTurtles,
  travel,
  theSixtiesUSA,
  water,
  counterStrike,
  maple,
  blue,
  lilac,
  cherry,
  hotdogStand,
  powerShell,
  rainyDay,
  plum,
  marine,
  honey,
  slate
};
