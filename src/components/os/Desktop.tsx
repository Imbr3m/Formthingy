import React, { useCallback, useEffect, useState } from 'react';
import Toolbar from "./Toolbar"
import ShutdownSequence from './ShutdownSequence';
import { Settings } from "../applications/Settings";
import { Camera } from "../applications/Camera";
import { Miyabi } from "../applications/Miyabi";
import { Profile } from "../applications/Profile";
import { IconName } from '../../assets/app-icons';
import { Weather } from "../applications/Weather";
import DesktopShortcut, { DesktopShortcutProps } from './DesktopShortcut';
import colors from '../../contstants/colors';
import { GlobalThemeProvider } from '../../contexts/ThemeContext';
import { Mail } from '../applications/Mail';
import { Paint } from '../applications/Paint';
import { Doom } from '../applications/Doom';


export interface DesktopProps {}


type ExtendedWindowAppProps<T> = T & WindowAppProps;

// the app shortcuts details
const APPLICATIONS: {
    [key in string]: {
        key: string;
        name: string;
        shortcutIcon: IconName;
        component: React.FC<ExtendedWindowAppProps<any>>;
    };
} = {
    profile: {
        key: 'profile',
        name: 'SURVEY FORM',
        shortcutIcon: 'account',
        component: Profile,
    },
    miyabi: {
        key: 'miyabi',
        name: 'Miyabi',
        shortcutIcon: 'miyabiIcon',
        component: Miyabi,
    },
    mail: {
        key: 'mail',
        name: 'Mail',
        shortcutIcon: 'mailIcon',
        component: Mail,
    },
    weather: {
        key: 'weather',
        name: 'Weather',
        shortcutIcon: 'weather',
        component: Weather,
    },
    camera: {
        key: 'camera',
        name: 'Camera',
        shortcutIcon: 'camera',
        component: Camera,
    },
    paint: {
        key: 'paint',
        name: 'Paint',
        shortcutIcon: 'paint',
        component: Paint,
    },
    doom: {
        key: 'doom',
        name: 'Doom',
        shortcutIcon: 'doomIcon',
        component: Doom,
    },
};


const Desktop: React.FC<DesktopProps> = () => {
  // window properties state
  const [windows, setWindows] = useState<DesktopWindows>({});

  // sjortcut properties state
  const [shortcuts, setShortcuts] = useState<DesktopShortcutProps[]>([]);

  // shutdown sequence state
  const [shutdown, setShutdown] = useState(false);
    // detect mobile users
    const [isMobile, setIsMobile] = useState(false);
  // shutdown sewuence counter
  const [numShutdowns, setNumShutdowns] = useState(1);
  // shutdown sequence effect
  useEffect(() => {
      if (shutdown === true) {
          rebootDesktop();
      }
  }, [shutdown]);

  useEffect(() => {
      try {
          if (typeof navigator !== 'undefined' && navigator.userAgent) {
              const ua = navigator.userAgent || '';
              const mobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/.test(ua);
              setIsMobile(mobile);
          } else if (typeof window !== 'undefined') {
              setIsMobile(window.innerWidth <= 768);
          }
      } catch (e) {
          setIsMobile(false);
      }
  }, []);

 
  useEffect(() => {
      const newShortcuts: DesktopShortcutProps[] = [];
      
      // Create shortcuts for each registered application
      Object.keys(APPLICATIONS).forEach((key) => {
          const app = APPLICATIONS[key];
          newShortcuts.push({
              shortcutName: app.name,
              icon: app.shortcutIcon,
              onOpen: () => {
                  // When shortcut is clicked, open the application window with a delay
                  setTimeout(() => {
                      addWindow(
                          app.key,
                          <app.component
                              onInteract={() => onWindowInteract(app.key)}
                              onMinimize={() => minimizeWindow(app.key)}
                              onClose={() => removeWindow(app.key)}
                              key={app.key}
                          />
                      );
                  }, 40); // 40ms delay
              },
          });
      });

      // auto opens account on start haha
      newShortcuts.forEach((shortcut) => {
          if (shortcut.shortcutName === 'SURVEY FORM') {
              shortcut.onOpen();
          }
      });

      setShortcuts(newShortcuts);
      // copies shortcuts to the state
  }, []);


  // clears the windows array like a reboot
  const rebootDesktop = useCallback(() => {
      setWindows({});
      
      // Reset background to original
      document.body.style.backgroundImage = '';
      document.body.style.backgroundColor = '#169886'; // Original desktop color
      
      // Reset effects to none
      document.documentElement.style.removeProperty('--before-bg-image');
      if (document.body) {
          document.body.style.removeProperty('--before-bg-image');
          document.body.style.setProperty('--before-bg-image', 'none');
      }
      
      // Reset theme to original
      localStorage.removeItem('selected-theme');
      localStorage.removeItem('selected-background');
      localStorage.removeItem('selected-effect');
      
      // Note: Page reload will happen after shutdown sequence completes
  }, []);

  
  // closes app window
  const removeWindow = useCallback((key: string) => {
      // Absolute hack and a half
      setTimeout(() => {
          setWindows((prevWindows) => {
              const newWindows = { ...prevWindows };
              delete newWindows[key];
              return newWindows;
          });
      }, 100);
  }, []);

  // minimizes app window
  const minimizeWindow = useCallback((key: string) => {
      setWindows((prevWindows) => {
          const newWindows = { ...prevWindows };
          newWindows[key].minimized = true;
          return newWindows;
      });
  }, []);

  // gets the highest z-index
  const getHighestZIndex = useCallback((): number => {
      let highestZIndex = 0;
      Object.keys(windows).forEach((key) => {
          const window = windows[key];
          if (window) {
              if (window.zIndex > highestZIndex)
                  highestZIndex = window.zIndex;
          }
      });
      return highestZIndex;
  }, [windows]);

  // toggles app window minimize from toolbar
  const toggleMinimize = useCallback(
      (key: string) => {
          const newWindows = { ...windows };
          const highestIndex = getHighestZIndex();
          if (
              newWindows[key].minimized ||
              newWindows[key].zIndex === highestIndex
          ) {
              newWindows[key].minimized = !newWindows[key].minimized;
          }
          newWindows[key].zIndex = getHighestZIndex() + 1;
          setWindows(newWindows);
      },
      [windows, getHighestZIndex]
  );

  // brings app window to front if clicked 
  const onWindowInteract = useCallback(
      (key: string) => {
          setWindows((prevWindows) => ({
              ...prevWindows,
              [key]: {
                  ...prevWindows[key],
                  zIndex: 1 + getHighestZIndex(),
              },
          }));
      },
      [setWindows, getHighestZIndex]
  );

  // starts the shutdown sequence with a delay
  const startShutdown = useCallback(() => {
      // Clear effects immediately when shutdown button is clicked
      document.documentElement.style.removeProperty('--before-bg-image');
      if (document.body) {
          document.body.style.removeProperty('--before-bg-image');
          document.body.style.setProperty('--before-bg-image', 'none');
      }
      
      setTimeout(() => {
          setShutdown(true);
          setNumShutdowns(numShutdowns + 1);
      }, 100);
  }, [numShutdowns]);

  // adds a new app window
  const addWindow = useCallback(
      (key: string, element: React.ReactElement, name?: string, icon?: IconName) => {
          setWindows((prevState) => {
              // Calculate highest z-index from current state
              let highestZ = 0;
              Object.keys(prevState).forEach((windowKey) => {
                  if (prevState[windowKey] && prevState[windowKey].zIndex > highestZ) {
                      highestZ = prevState[windowKey].zIndex;
                  }
              });
              
              return {
                  ...prevState,
                  [key]: {
                      zIndex: highestZ + 1,
                      minimized: false,
                      component: element,
                      name: name || APPLICATIONS[key]?.name || key,
                      icon: icon || APPLICATIONS[key]?.shortcutIcon || 'computerBig',
                  },
              };
          });
      },
      []
  );

  // opens the Settings window
  const settings = useCallback(() => {
      setTimeout(() => {
          addWindow(
              'settings',
              <Settings
                  onInteract={() => onWindowInteract('settings')}
                  onMinimize={() => minimizeWindow('settings')}
                  onClose={() => removeWindow('settings')}
                  key="settings"
              />,
              'Settings',
              'computerBig'
          );
      }, 40); // 40ms delay
  }, [addWindow, onWindowInteract, minimizeWindow, removeWindow]);

  if (isMobile) {
      return (
          <div style={styles.mobileOverlay}>
              <div style={styles.mobileText}>Please use desktop for the best experience.</div>
          </div>
      );
  }

  return !shutdown ? (
        <GlobalThemeProvider>
        <div style={styles.desktop}>
            {/* Render all open windows with proper z-index and minimize state */}
            {Object.keys(windows).map((key) => {
                const element = windows[key].component;
                if (!element) return <div key={`win-${key}`}></div>;
                return (
                    <div
                        key={`win-${key}`}
                        style={Object.assign(
                            {},
                            { zIndex: windows[key].zIndex },  
                            windows[key].minimized && styles.minimized 
                        )}
                    >
                        {React.cloneElement(element as React.ReactElement<any>, {
                            key,
                            onInteract: () => onWindowInteract(key),
                            onClose: () => removeWindow(key),
                        })}
                    </div>
                );
            })}
            
            {/* app shortcuts */}
            <div style={styles.shortcuts}>
                {shortcuts.map((shortcut, i) => {
                    const column = i % 2; // 0 for right column, 1 for left column
                    const row = Math.floor(i / 2); // Row within the column
                    return (
                        <div
                            style={Object.assign({}, styles.shortcutContainer, {
                                top: row * 110,  // desktop app spacing
                                right: column === 0 ? 100 : 200,  
                            })}
                            key={shortcut.shortcutName}
                        >
                            <DesktopShortcut
                                icon={shortcut.icon}
                                shortcutName={shortcut.shortcutName}
                                onOpen={shortcut.onOpen}
                            />
                        </div>
                    );
                })}
            </div>
            
            
            <Toolbar 
                windows={windows}
                toggleMinimize={toggleMinimize}
                shutdown={startShutdown}
                settings={settings}
            />
        </div>
        </GlobalThemeProvider>
    ) : (
        <ShutdownSequence // the shutdown compoment
            setShutdown={setShutdown}
            numShutdowns={numShutdowns}
        />
    );
} 


const styles: StyleSheetCSS = {
    desktop: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: colors.turquoise, 
    },
    shutdown: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: '#000000',  
    },
    shortcutContainer: {
        position: 'absolute',  
    },
    shortcuts: {
        position: 'absolute',
        top: 30,      
        right: 0,   
    },
    minimized: {
        pointerEvents: 'none',  // disable the interaaction with minimized windows
        opacity: 0,             // hides minimized windows completely
    },
    mobileOverlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
    },
    mobileText: {
        color: '#ffffff',
        fontSize: 18,
        textAlign: 'center',
        padding: 20,
    },
};

export default Desktop
