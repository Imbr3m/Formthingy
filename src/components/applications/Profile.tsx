import React from 'react'
import Window from '../os/Window';
import useInitialWindowSize from '../../hooks/useInitialWindowSize';

// Components import
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Frame, styleReset } from 'react95';
import { useTheme } from '../../contexts/ThemeContext';

/* Original Windows95 font */
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body, input, select, textarea {
    font-family: 'ms_sans_serif';
  }
`;



export interface ProfileProps extends WindowAppProps {}

export const Profile: React.FC<ProfileProps> = (props) => {
  const { currentTheme } = useTheme();


  return (    
    <Window
      top={44}
      left={286}
      width={1000}
      height={700}
      windowTitle="SURVEY FORM"
      windowBarIcon="accountSmall"
      closeWindow={props.onClose}
      onInteract={props.onInteract}
      minimizeWindow={props.onMinimize}
      bottomLeftText={'© by Rainer Santos || Answer my survey pls :)'}
    >
      <GlobalStyles />
      <ThemeProvider theme={currentTheme}>
        {/* main frame */}
        <Frame style={styles.profile} variant='well'>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSd93nO901-mFibj8siJm3n_oFJoL_7MloXREeDxLG6ZbYgfyQ/viewform?embedded=true&hl=en"
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
          >Loading…</iframe>
        </Frame>
      </ThemeProvider>
    </Window>
  );
}

const styles = {
    profile: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      color: 'white',
      overflow: 'hidden',
    },
};

export default Profile;