import React from 'react'
import SmallWindow from '../os/SmallWindow';


export interface TestProps extends WindowAppProps {}

export const Test: React.FC<TestProps> = (props) => {
  return (
    
    <SmallWindow
      top={48}
      left={48}
      width={300}
      height={400}
      windowTitle="Testing"
      windowBarIcon="computerBig"
      closeWindow={props.onClose}
      onInteract={props.onInteract}
      minimizeWindow={props.onMinimize}
      bottomLeftText={'© by Tester (thats me)'}
    >
      {/* what ever the content will be here  */}
      <div style={styles.test}>
        <h1>HELLO WORLD</h1>
      </div>
    </SmallWindow>
  );
}
const styles: StyleSheetCSS = {
    test: {
      width: '100%',
      backgroundColor: 'black',
      paddingTop: 64,
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: 64,
      color: 'white',
      overflow: 'hidden',
    }
};

export default Test;

// test window for noww 