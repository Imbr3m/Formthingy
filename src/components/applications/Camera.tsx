import React, { useRef, useState, useEffect } from 'react'
import Window from '../os/Window';

// Components import
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Frame, Button } from 'react95';

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

const ResultFrame = styled(Frame)<{ $hasPhoto: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: ${props => props.$hasPhoto ? '0' : '100%'};
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
  z-index: 10;
  overflow: hidden;

  canvas {
    flex: 1;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  button {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 5;
  }
`;

export interface CameraProps extends WindowAppProps {}

export const Camera: React.FC<CameraProps> = (props) => {
    const { currentTheme } = useTheme(); // theme that is current haha
    const videoRef = useRef<HTMLVideoElement>(null);
    const photoRef = useRef<HTMLCanvasElement>(null);

    const [hasPhoto, setHasPhoto] = useState(false);

    const getVideo = () => {
        navigator.mediaDevices.getUserMedia({ video:{ width: 1920, height: 1080 } }).then(stream => {
            let video = videoRef.current;
            if (video) {
                video.srcObject = stream;
                video.play();
            }
        })

        .catch(err => console.error('Error accessing camera:', err));
    }


    const takePhoto = () => {
        const width = 414;
        const height = width / (16/9);

        let video = videoRef.current;
        let photo = photoRef.current;

        if (photo && video) {
            photo.width = width;
            photo.height = height;

            let context = photo.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, width, height);
            }

            setHasPhoto(true);
        }
    }

    const closePhoto = () => {
        let photo = photoRef.current;
        if (photo) {
            let context = photo.getContext('2d');
            if (context) {
                context.clearRect(0, 0, photo.width, photo.height);
            }
        }
        setHasPhoto(false);
    }

    useEffect(() => {
        getVideo();
    }, [videoRef]);

    return (
        <Window
            top={100}
            left={500}
            width={600}
            height={400}
            windowTitle="Camera"
            windowBarIcon="camera"
            // rainbow={true}
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={'Click SHOOT to take a photo'}
        >
            <GlobalStyles />
            <ThemeProvider theme={currentTheme}>
                <Frame style={styles.camera} variant='well'>
                    <div style={styles.cameraContainer}>
                        <video ref={videoRef} style={styles.video}></video>
                        <Button onClick={takePhoto} style={styles.shootButton}>SHOOT</Button>
                    </div>

                    <ResultFrame variant='status' $hasPhoto={hasPhoto}>
                        <canvas ref={photoRef}></canvas>
                        <Button onClick={closePhoto}>Close</Button>
                    </ResultFrame>
                </Frame>
            </ThemeProvider>
        </Window>
    );
}
const styles: StyleSheetCSS = {
    camera: {
        width: '100%', 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    cameraContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    shootButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 5,
        padding: '8px 16px',
    }
};

export default Camera;
