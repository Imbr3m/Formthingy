import React from 'react'
import Window from '../os/Window';

// Components import
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Frame } from 'react95';

// Import global theme context
import { useTheme } from '../../contexts/ThemeContext';

/* Original Windows95 font */
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';

const GlobalStyles = createGlobalStyle`
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

export interface PaintProps extends WindowAppProps {}

export const Paint: React.FC<PaintProps> = (props) => {
    const { currentTheme } = useTheme(); // theme that is current haha

    return (
        <Window
            top={100}
            left={500}
            width={600}
            height={400}
            windowTitle="Paint"
            windowBarIcon="paint"
            // rainbow={true}
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={'Go paint something idk'}
        >
            <GlobalStyles />
            <ThemeProvider theme={currentTheme}>
                <Frame style={styles.paint} variant='well'>
                    <div style={styles.blockMenuPaint}></div>
                    <div style={styles.blockMenuPaintExtra}></div>
                    <iframe src="https://jspaint.app" width="100%" height="100%"></iframe>
                </Frame>
            </ThemeProvider>
        </Window>
    );
}
const styles: StyleSheetCSS = {
    paint: {
        width: '100%', 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    blockMenuPaint: {
        position: 'absolute',
        width: '32px',
        height: '24px',
        zIndex: 5,
    },
    blockMenuPaintExtra: {
        position: 'absolute',
        width: '45px',
        height: '24px',
        zIndex: 5,
        left: '13.5rem',
    },
};

export default Paint;
