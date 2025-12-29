import React, { useState } from 'react';
import DosPlayer from '../dos/DosPlayer';
import Window from '../os/Window';

export interface DoomProps extends WindowAppProps {}

export const Doom: React.FC<DoomProps> = (props) => {
    const [width, setWidth] = useState(980);
    const [height, setHeight] = useState(670);

    return (
        <Window
            top={10}
            left={10}
            width={width}
            height={height}
            windowTitle="Doom"
            windowBarColor="#1C1C1C"
            windowBarIcon="doomIcon"
            bottomLeftText={'Powered by JSDOS & DOSBox'}
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            onWidthChange={setWidth}
            onHeightChange={setHeight}
        >
            {/* doom app0 */}
            <DosPlayer bundleUrl="doom.jsdos" /> 
        </Window>
    );
};

export default Doom;
