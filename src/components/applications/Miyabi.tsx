import React from 'react'
import Window from '../os/Window';
import MiyabiBG from '../../assets/gifs/miyabi.gif'


export interface MiyabiProps extends WindowAppProps {}

export const Miyabi: React.FC<MiyabiProps> = (props) => {
  return (
    <Window
      top={60}
      left={60}
      width={600}
      height={400}
      windowTitle="Miyabi stops you from being unemployed"
      windowBarIcon="computerBig"
      // rainbow={true}
      closeWindow={props.onClose}
      onInteract={props.onInteract}
      minimizeWindow={props.onMinimize}
      bottomLeftText={'ARE YOU MOTIVATED????'}
    >
      <div style={styles.inside}></div>
    </Window>
  );
}
const styles: StyleSheetCSS = {
    inside: {
        width: '100%',
        backgroundColor: 'black',
        backgroundImage: `url(${MiyabiBG})`,
        backgroundSize: 'cover',       
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        
        overflow: 'hidden',
    }
};

export default Miyabi;

// another test window for now