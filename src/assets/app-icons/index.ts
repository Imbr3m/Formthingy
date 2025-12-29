import React from 'react';

import computerBig from './computerBig.png';
import doomIcon from './doomIcon.png';
import volumeOn from './volumeOn.png';
import volumeOff from './volumeOff.png';
import windowsStartIcon from './windowsStartIcon.png';
import windowResize from './windowResize.png';
import close from './close.png';
import maximize from './maximize.png';
import minimize from './minimize.png';
import miyabiIcon from './miyabi-Icon.png';
import account from './account.png';
import accountSmall from './accountSmall.png';
import computerSmall from './computerSmall.png';
import mailIcon from './mailI.png';
import settings from './settings.png'
import cursorIcon from './cursorIcon.png'
import newspaper from './newspaper.png'
import camera from './camera.png'
import weather from './weather.png'
import paint from './paint.png'
import paintSmall from './paintSmall.png'



const icons = {
    computerBig: computerBig,
    doomIcon: doomIcon,
    volumeOn: volumeOn,
    volumeOff: volumeOff,
    windowsStartIcon: windowsStartIcon,
    windowResize: windowResize,
    close: close,
    maximize: maximize,
    minimize: minimize,
    miyabiIcon: miyabiIcon,
    account: account,
    accountSmall: accountSmall,
    computerSmall: computerSmall,
    mailIcon: mailIcon,
    settings: settings,
    cursorIcon: cursorIcon,
    newspaper: newspaper,
    camera: camera,
    weather: weather,
    paint: paint,
    paintSmall: paintSmall,
};

export type IconName = keyof typeof icons;

const getIconByName = (
    iconName: IconName
    // @ts-ignore
): React.FC<React.SVGAttributes<SVGElement>> => icons[iconName];

export default getIconByName;
