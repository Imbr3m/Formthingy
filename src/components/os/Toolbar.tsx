import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../general';
import Colors from '../../contstants/colors';

import { DatePicker } from '../applications/Date';


// react-95 compoments
// Components import
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Frame, Window,
  WindowHeader,
  WindowContent } from 'react95';
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
`;

// props for toolbar (the types are in constanst)
export interface ToolbarProps {
	windows: DesktopWindows; 
	toggleMinimize: (key: string) => void; 
	shutdown: () => void; 
	settings: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
	windows,
	toggleMinimize,
	shutdown,
	settings,
}) => {
	// react-95 theme
	const { currentTheme } = useTheme();



	// gets time and returns it a string
	const getTime = () => {
		const date: Date = new Date();
		let hours = date.getHours();
		let minutes = date.getMinutes();
		let amPm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12;
		let mins = minutes < 10 ? '0' + minutes : minutes;
		const strTime = hours + ':' + mins + ' ' + amPm;
		return strTime;
	};

	// STATES AND REFS
	const [startWindowOpen, setStartWindowOpen] = useState(false);
	const lastClickInside = useRef(false);
	const [lastActive, setLastActive] = useState('');

	const [time, setTime] = useState(getTime());
	const [calendarOpen, setCalendarOpen] = useState(false);
	const lastClickInsideCalendar = useRef(false);

	// USE EFFECTS
	useEffect(() => {
		let max = 0;
		let k = '';
		Object.keys(windows).forEach((key) => {
			if (windows[key].zIndex >= max) {
				max = windows[key].zIndex;
				k = key;
			}
		});
		setLastActive(k);
	}, [windows]);    

	// updates ur time every 5 seconds
	const updateTime = () => {
		setTime(getTime());
		setTimeout(() => {
			updateTime();
		}, 5000);
	};

	useEffect(() => {
		updateTime();
	});



	// start menu click handlers
	const onCheckClick = () => {
		if (lastClickInside.current) {
			setStartWindowOpen(true);
		} else {
			setStartWindowOpen(false);
		}
		lastClickInside.current = false;
	};

	useEffect(() => {
		window.addEventListener('mousedown', onCheckClick, false);
		return () => {
			window.removeEventListener('mousedown', onCheckClick, false);
		};
	}, []);

	const onStartWindowClicked = () => {
		setStartWindowOpen(true);
		lastClickInside.current = true;
	};

	const toggleStartWindow = () => {
		if (!startWindowOpen) {
			lastClickInside.current = true;
		} else {
			lastClickInside.current = false;
		}
	};

	// calendar toggle onCalendarWindowClicked
	// fixed the calendar logic
const onCalendarWindowClicked = () => {
	lastClickInsideCalendar.current = true;
  };
  
  useEffect(() => {
	const onCheckCalendarClick = () => {
	  if (lastClickInsideCalendar.current) {
		setCalendarOpen(true);
	  } else {
		setCalendarOpen(false);
	  }
	  lastClickInsideCalendar.current = false;
	};
  
	window.addEventListener('mousedown', onCheckCalendarClick, false);
	return () => {
	  window.removeEventListener('mousedown', onCheckCalendarClick, false);
	};
  }, []);
  
  // toggle calendar
  const toggleCalendar = (e: React.MouseEvent) => {
	e.stopPropagation();
  
	if (!calendarOpen) {
	  lastClickInsideCalendar.current = true;
	  setCalendarOpen(true);
	  setStartWindowOpen(false); 
	} else {
	  lastClickInsideCalendar.current = false;
	  setCalendarOpen(false);
	}
  };

  

	return (
        <div style={styles.toolbarOuter}>
            {/* Start menu popup */}
            {startWindowOpen && (
                <div
                    onMouseDown={onStartWindowClicked}
                    style={styles.startWindow}
                >
                    <div style={styles.startWindowInner}>
                        {/* purple side text */}
                        <div style={styles.verticalStartContainer}>
                            <p style={styles.verticalText}>Raintop</p>
                        </div>
                        <div style={styles.startWindowContent}>
                            <div style={styles.startMenuSpace} />
							<div style={styles.startMenuLine} />
							{/* settings option */}
							<div
                                className="start-menu-option"
                                style={styles.startMenuOption}
                                onMouseDown={settings}
                            >
                                <Icon
                                    style={styles.startMenuIcon}
                                    icon="settings"
                                />
                                <p style={styles.startMenuText}>
                                    Settings
                                </p>
                            </div>
                            <div style={styles.startMenuLine} />
                            {/* Shutdown option */}
                            <div
                                className="start-menu-option"
                                style={styles.startMenuOption}
                                onMouseDown={shutdown}
                            >
                                <Icon
                                    style={styles.startMenuIcon}
                                    icon="computerBig"
                                />
                                <p style={styles.startMenuText}>
                                    Sh<u>u</u>t down...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Toolbar bar itself */}
            <div style={styles.toolbarInner}>
                <div style={styles.toolbar}>
                    {/* Start button */}
                    <div
                        style={Object.assign(
                            {},
                            styles.startContainerOuter,
                            startWindowOpen && styles.activeTabOuter
                        )}
                        onMouseDown={toggleStartWindow}
                    >
                        <div
                            style={Object.assign(
                                {},
                                styles.startContainer,
                                startWindowOpen && styles.activeTabInner
                            )}
                        >
                            <Icon
                                size={18}
                                icon="windowsStartIcon"
                                style={styles.startIcon}
                            />
                            <p className="toolbar-text">Start</p>
                        </div>
                    </div>
                    {/* Window tabs for each open window */}
                    <div style={styles.toolbarTabsContainer}>
                        {Object.keys(windows).map((key) => {
                            return (
                                <div
                                    key={key}
                                    style={Object.assign(
                                        {},
                                        styles.tabContainerOuter,
                                        lastActive === key &&
                                            !windows[key].minimized &&
                                            styles.activeTabOuter
                                    )}
                                    onMouseDown={() => toggleMinimize(key)}
                                >
                                    <div
                                        style={Object.assign(
                                            {},
                                            styles.tabContainer,
                                            lastActive === key &&
                                                !windows[key].minimized &&
                                                styles.activeTabInner
                                        )}
                                    >
                                        {/* Window icon and name */}
                                        <Icon
                                            size={18}
                                            icon={windows[key].icon}
                                            style={styles.tabIcon}
                                        />
                                        <p className='no-hi' style={styles.tabText}>
                                            {windows[key].name}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* Time and volume section */}
                <div style={styles.time}>
                    <Icon style={styles.volumeIcon} icon="volumeOn" />
					<div 
						className="date-button"
						onMouseDown={toggleCalendar}
						style={styles.dateButton}
					>
                    	<p className='no-hi' style={styles.timeText}>{time}</p>
					</div>
                </div>
            </div>
            {/* date popup calendar pop up */}
			
            {calendarOpen && (
				<div>
					<GlobalStyles />
					<ThemeProvider theme={currentTheme}>
						{/* main frame */}
						<Window style={styles.calendarWindow} onMouseDown={onCalendarWindowClicked}>
						<WindowHeader>
							<span style={{marginLeft: 4}}>
								Date
							</span>
						</WindowHeader>
						
						<WindowContent className='calendar-box'>
							{/* calendar will be here */}
							<Frame variant='field' className='calendar'>
								<DatePicker />
							</Frame>
						</WindowContent>
						</Window>
					</ThemeProvider>
				</div>
            )}
        </div>
    );
};

// styles css
const styles: StyleSheetCSS = {
	toolbarOuter: {
		boxSizing: 'border-box',
		position: 'absolute',
		bottom: 0,
		width: '100%',
		height: 32,
		background: Colors.lightGray,
		borderTop: `1px solid ${Colors.lightGray}`,
		zIndex: 100000,
	},
	verticalStartContainer: {
		height: '100%',
		background: Colors.purple,
	},
	verticalText: {
		fontFamily: 'Brush Script MT, cursive',
		textOrientation: 'sideways',
		fontSize: 32,
		padding: 4,
		paddingBottom: 64,
		paddingTop: 8,
		letterSpacing: 1,
		color: Colors.lightGray,
		transform: 'scale(-1)',
		WebkitTransform: 'scale(-1)',
		MozTransform: 'scale(-1)',
		msTransform: 'scale(-1)',
		OTransform: 'scale(-1)',
		// @ts-ignore
		writingMode: 'tb-rl',
	},
	startWindowContent: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
	},
	startWindow: {
		// Start menu popup styling
		position: 'absolute',
		bottom: 28,
		display: 'flex',
		flex: 1,
		width: 256,
		left: 4,
		boxSizing: 'border-box',
		border: `1px solid ${Colors.white}`,
		borderBottomColor: Colors.black,
		borderRightColor: Colors.black,
		background: Colors.lightGray,
	},
	activeTabOuter: {
		// Highlight for active tab or Start button
		border: `1px solid ${Colors.black}`,
		borderBottomColor: Colors.white,
		borderRightColor: Colors.white,
	},
	startWindowInner: {
		border: `1px solid ${Colors.lightGray}`,
		borderBottomColor: Colors.darkGray,
		borderRightColor: Colors.darkGray,
		flex: 1,
	},
	startMenuIcon: {
		width: 32,
		height: 32,
	},
	startMenuText: {
		fontSize: 14,
		fontFamily: 'MSSerif',
		marginLeft: 8,
		//stops the highlighting of the text
		userSelect: 'none', 
		WebkitUserSelect: 'none', 
		MozUserSelect: 'none', 
		msUserSelect: 'none', 
	},
	startMenuOption: {
		alignItems: 'center',
		height: 48,
		padding: 12,
	},
	startMenuSpace: {
		flex: 1,
	},
	startMenuLine: {
		height: 1,
		background: Colors.white,
		borderTop: `1px solid ${Colors.darkGray}`,
	},
	activeTabInner: {
		// Inner highlight for active tab
		border: `1px solid ${Colors.darkGray}`,
		borderBottomColor: Colors.lightGray,
		borderRightColor: Colors.lightGray,
		backgroundImage: `linear-gradient(45deg, white 25%, transparent 25%),
		linear-gradient(-45deg,  white 25%, transparent 25%),
		linear-gradient(45deg, transparent 75%,  white 75%),
		linear-gradient(-45deg, transparent 75%,  white 75%)`,
		backgroundSize: `4px 4px`,
		backgroundPosition: `0 0, 0 2px, 2px -2px, -2px 0px`,
		pointerEvents: 'none',
	},
	tabContainerOuter: {
		// Tab for each window
		display: 'flex',
		flex: 1,
		maxWidth: 300,
		marginRight: 4,
		boxSizing: 'border-box',
		cursor: 'pointer',
		border: `1px solid ${Colors.white}`,
		borderBottomColor: Colors.black,
		borderRightColor: Colors.black,
	},
	tabContainer: {
		display: 'flex',
		border: `1px solid ${Colors.lightGray}`,
		borderBottomColor: Colors.darkGray,
		borderRightColor: Colors.darkGray,
		alignItems: 'center',
		paddingLeft: 4,
		flex: 1,
	},
	tabIcon: {
		marginRight: 6,
	},
	startContainer: {
		// Start button styling
		alignItems: 'center',
		flexShrink: 1,
		border: `1px solid ${Colors.lightGray}`,
		borderBottomColor: Colors.darkGray,
		borderRightColor: Colors.darkGray,
		padding: 1,
		paddingLeft: 5,
		paddingRight: 5,
	},
	startContainerOuter: {
		marginLeft: 3,
		boxSizing: 'border-box',
		cursor: 'pointer',
		border: `1px solid ${Colors.white}`,
		borderBottomColor: Colors.black,
		borderRightColor: Colors.black,
	},
	toolbarTabsContainer: {
		// Container for window tabs
		flex: 1,
		marginLeft: 4,
		marginRight: 4,
	},
	startIcon: {
		marginRight: 4,
	},
	toolbarInner: {
		borderTop: `1px solid ${Colors.white}`,
		alignItems: 'center',
		flex: 1,
	},
	toolbar: {
		flexGrow: 1,
		width: '100%',
	},
	time: {
		// Time and volume section
		flexShrink: 1,
		width: 86,
		height: 24,
		boxSizing: 'border-box',
		marginRight: 4,
		paddingLeft: 4,
		paddingRight: 4,
		border: `1px solid ${Colors.white}`,
		borderTopColor: Colors.darkGray,
		justifyContent: 'space-between',
		alignItems: 'center',
		borderLeftColor: Colors.darkGray,
	},
	volumeIcon: {
		cursor: 'pointer',
		height: 18,
	},
	tabText: {
		fontSize: 14,
		fontFamily: 'MSSerif',

		userSelect: 'none', 
		WebkitUserSelect: 'none', 
		MozUserSelect: 'none', 
		msUserSelect: 'none',
	},
	timeText: {
		fontSize: 12,
		fontFamily: 'MSSerif',

		userSelect: 'none', 
		WebkitUserSelect: 'none', 
		MozUserSelect: 'none', 
		msUserSelect: 'none',
	},
	dateButton: {
		cursor: 'pointer',
	},
	calendarWindow: {
		position: 'absolute',
		bottom: 28,
		right: 4,
		width: 280,
		boxSizing: 'border-box',
		zIndex: 100001,
		boxShadow: '2px 2px 0px rgba(0, 0, 0, 0.1)',
	},
};

export default Toolbar;
