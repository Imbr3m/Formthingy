// shutdown sequence i got from https://github.com/ShizukuIchi/winXP
import React, { useState, useEffect } from 'react';

export interface ShutdownSequenceProps {
    numShutdowns: number;
    setShutdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const SPEED_MULTIPLIER = 1.2;

// delay markers
const _F = `>${500 * SPEED_MULTIPLIER}<`;
const _X = `>${500 * SPEED_MULTIPLIER}<`;
const _S = `>${1000 * SPEED_MULTIPLIER}<`;
const _M = `>${2000 * SPEED_MULTIPLIER}<`;
const _L = `>${5000 * SPEED_MULTIPLIER}<`;

function delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

const ShutdownSequence: React.FC<ShutdownSequenceProps> = ({
    numShutdowns,
    setShutdown,
}) => {
    const [text, setText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const getTime = () => {
        const date = new Date();
        const h = date.getHours();
        const m = date.getMinutes();
        const s = date.getSeconds();
        return `${h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    };

    const NORMAL_SHUTDOWN = `Beginning Pre-Shutdown Sequence... ${_F}
    Connecting to RAINTOP/67:2000.${_F}.${_F}.${_F}
    |
    Established connection to HH0S01/67:2000, attempting data transfer.
    |
    ${_F}
    |Analyzing data... Done.| ${_F}
    |Packing Transfer... Done.| ${_F}
    |Beginning Transfer...| ${_F}
    |[${getTime()} START]| .${_F}.....${_X}.|............|.${_S}.|......|.${_S}...........${_M} |[Transfer Failed.]|

    |(RAINTOP/67:365:60099) [RANDOM_CODE_WORDS_SO_IT_LOOKS_COOL] ERROR: 'RAINER' failed to get employed. Please give him that internship.|
    ${_F}
    |(RAINTOP/67:365:60099) [SOCKET_FAILED_TO_RESPOND] Connection Refused: Reconnecting... [${getTime()}:00]|
    |(RAINTOP/67:365:60099) [SOCKET_FAILED_TO_RESPOND] Connection Refused: Reconnecting... [${getTime()}:01]
    (RAINTOP/67:365:60099) [SOCKET_FAILED_TO_RESPOND] Connection Refused: Reconnecting... [${getTime()}:03]
    (RAINTOP/67:365:60099) [SOCKET_FAILED_TO_RESPOND] Connection Refused: Reconnecting... [${getTime()}:05]
    |
    FATAL ERROR: Still unemployed. Unable to shutdown computer. 
    Aborting shutdown sequence and rebooting.

    Rebooting${_S}.${_S}.${_S}.
    `;

    const SHUTDOWN_3 = `
    Bruh${_S}.${_S}.${_S}. ${_M} I didnt finish the website yet${_L}
    RAAAHHHHH,${_F} I didnt make the code to shut down...${_S} It will always reboot.
    ${_L}
    |Goodbye!|
    ${_M}


    Rebooting${_S}.${_S}.${_S}.
    `;

    // shutdown messages
    const SHUTDOWN_MAP = [
        NORMAL_SHUTDOWN, // 0
        NORMAL_SHUTDOWN, // 1
        NORMAL_SHUTDOWN, // 2
        SHUTDOWN_3,      // 3
    ];

    // Typing effect
    const typeText = (
        i: number,
        curText: string,
        text: string,
        setText: React.Dispatch<React.SetStateAction<string>>,
        callback: () => void
    ) => {
        let delayExtra = 0;
        if (i < text.length) {
            if (text[i] === '|') {
                let dumpText = '';
                for (let j = i + 1; j < text.length; j++) {
                    if (text[j] === '|') {
                        i = j + 1;
                        break;
                    }
                    dumpText += text[j];
                }
                setText(curText + dumpText);
                return typeText(i, curText + dumpText, text, setText, callback);
            }

            if (text[i] === '>') {
                let delayTime = '';
                for (let j = i + 1; j < text.length; j++) {
                    if (text[j] === '<') {
                        i = j + 1;
                        break;
                    }
                    delayTime += text[j];
                }
                delayExtra = parseInt(delayTime);
            }

            setTimeout(() => {
                setText(curText + text[i]);
                typeText(i + 1, curText + text[i], text, setText, callback);
            }, 20 + delayExtra);
        } else {
            callback();
        }
    };

    useEffect(() => {
        delay(2000).then(() => {
            setLoading(false);
            delay(1000).then(() => {
                const shutdownText =
                    SHUTDOWN_MAP[numShutdowns] || NORMAL_SHUTDOWN;

                typeText(0, '', shutdownText, setText, () => {
                    setLoading(true);
                    delay(1000).then(() => {
                        // Reload the page to apply all resets
                        window.location.reload();
                    });
                });
            });
        });
    }, [numShutdowns, setShutdown]);

    return (
        <div style={styles.shutdown}>
            {loading ? (
                <div className="blinking-cursor" />
            ) : (
                <p style={styles.text}>{text}</p>
            )}
        </div>
    );
};

const styles: StyleSheetCSS = {
    shutdown: {
        minHeight: '100vh',
        flex: 1,
        backgroundColor: 'black',
        padding: 64,
    },
    text: {
        color: '#00FF00',
        fontFamily: 'monospace',
        whiteSpace: 'pre-line',
    },
};

export default ShutdownSequence;
