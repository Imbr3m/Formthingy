// Desktop app shortcut component
import React, { useCallback, useEffect, useRef, useState } from 'react';
import getIconByName, { IconName } from '../../assets/app-icons';
import colors from '../../contstants/colors';
import { Icon } from '../general';

// props
export interface DesktopShortcutProps {
    icon: IconName;
    shortcutName: string;
    invertText?: boolean;
    onOpen: () => void;
}

const DesktopShortcut: React.FC<DesktopShortcutProps> = ({
    icon,
    shortcutName,
    invertText,
    onOpen,
}) => {
    const [isSelected, setIsSelected] = useState(false);

    const [shortcutId, setShortcutId] = useState('');

    const [lastSelected, setLastSelected] = useState(false);

    // ref to the root element for measuring the bounding box
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [scaledStyle, setScaledStyle] = useState({});

    // uses the project's helper so bundlers (Vite/ESM) return a proper URL
    // instead of using `require` which is not defined in the browser.
    const requiredIcon = getIconByName(icon) as unknown as string;

    // detects if double clickss
    const [doubleClickTimerActive, setDoubleClickTimerActive] = useState(false);

    // memoized function that creates a stable DOM id from the name
    const getShortcutId = useCallback(() => {
        const shortcutId = shortcutName.replace(/\s/g, '');
        return `desktop-shortcut-${shortcutId}`;
    }, [shortcutName]);

    // keeps `shortcutId` state in the same as the `shortcutName`.
    useEffect(() => {
        setShortcutId(getShortcutId());
    }, [shortcutName, getShortcutId]);

    // handles scaling and centering of a desktop shortcut icon when itss clicked
    useEffect(() => {
        if (containerRef.current && Object.keys(scaledStyle).length === 0) {
            // Read element size and compute offsets so the scaled icon stays centered
            const boundingBox = containerRef.current.getBoundingClientRect();
            setScaledStyle({
                transformOrigin: 'center',
                transform: 'scale(1.5)',
                left: boundingBox.width / 4,
                top: boundingBox.height / 4,

            });
        }
    }, [scaledStyle]);

    // handles the same but if you click outside that window
    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            // @ts-ignore - idk why its ts is giving error i defined it already
            const targetId = event.target.id;
            if (targetId !== shortcutId) {
                setIsSelected(false);
            }
            // makes the last selected window grayy
            if (!isSelected && lastSelected) {
                setLastSelected(false);
            }
        },
        [isSelected, setIsSelected, setLastSelected, lastSelected, shortcutId]
    );

    // called when the user clicks the shortcut and opens depending if u double clikcked
    const handleClickShortcut = useCallback(() => {
        if (doubleClickTimerActive) {
            // second click opens
            onOpen && onOpen();
            setIsSelected(false);
            setDoubleClickTimerActive(false);
            return;
        }
        // highlights the app shortcut
        setIsSelected(true);
        setLastSelected(true);
        setDoubleClickTimerActive(true);
        // clears double click timer if u take too long
        setTimeout(() => {
            setDoubleClickTimerActive(false);
        }, 300);
    }, [doubleClickTimerActive, setIsSelected, onOpen]);

    // global mousedown listener to detect clicks outside the shortcut
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSelected, handleClickOutside]);


    return (
        <div
            id={`${shortcutId}`}
            style={Object.assign({}, styles.appShortcut, scaledStyle)}
            onMouseDown={handleClickShortcut}
            ref={containerRef}
        >
            {/* Icon area */}
            <div id={`${shortcutId}`} style={styles.iconContainer}>
                <div
                    id={`${shortcutId}`}
                    className="desktop-shortcut-icon"
                    style={Object.assign(
                        {},
                        styles.iconOverlay,
                        // when checkerboard background car vroom
                        isSelected && styles.checkerboard,
                        isSelected && {
                            WebkitMask: `url(${requiredIcon})`,
                        }
                    )}
                />
                <Icon icon={icon} style={styles.icon} />
            </div>

            <div
                className={
                    isSelected
                        ? 'selected-shortcut-border'
                        : lastSelected
                        ? 'shortcut-border'
                        : ''
                }
                id={`${shortcutId}`}
                style={isSelected ? { backgroundColor: colors.blue } : {}}
            >
                <p
                    id={`${shortcutId}`}
                    style={Object.assign(
                        {},
                        styles.shortcutText,
                        invertText && !isSelected && { color: 'black' }
                    )}
                >
                    {shortcutName}
                </p>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    appShortcut: {
        position: 'absolute',
        width: 56,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
    },
    shortcutText: {
        cursor: 'pointer',
        textOverflow: 'wrap',
        fontFamily: 'MSSerif',
        color: 'white',
        fontSize: 8,
        paddingRight: 2,
        paddingLeft: 2,
    },
    iconContainer: {
        cursor: 'pointer',
        paddingBottom: 3,
    },
    iconOverlay: {
        position: 'absolute',
        top: 0,
        width: 32,
        height: 32,
    },
    checkerboard: {
        backgroundImage: `linear-gradient(45deg, ${colors.blue} 25%, transparent 25%),
        linear-gradient(-45deg, ${colors.blue} 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, ${colors.blue} 75%),
        linear-gradient(-45deg, transparent 75%, ${colors.blue} 75%)`,
        backgroundSize: `2px 2px`,
        backgroundPosition: `0 0, 0 1px, 1px -1px, -1px 0px`,
        pointerEvents: 'none',
    },
};

export default DesktopShortcut;
