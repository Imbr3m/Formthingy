import React, { useState, useEffect } from 'react'
import SmallWindow from '../os/SmallWindow';


// Components import
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Frame, Button, GroupBox, Select, Tab, TabBody, Tabs } from 'react95';

// Import background options
import { backgroundOptions, selectOptions } from '../../assets/bg';
// Import effects options
import { effectOptions, effectSelectOptions } from '../../assets/effects';
// Import themes options
import { themeSelectOptions } from '../../assets/general/themes';
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

// what tab we on
export interface SettingsProps extends WindowAppProps {}

export const Settings: React.FC<SettingsProps> = (props) => {
  const [state, setState] = useState({
    activeTab: 0
  });

  // Background selection state
  const [selectedBackground, setSelectedBackground] = useState<number>(1);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);

  // Effects selection state
  const [selectedEffect, setSelectedEffect] = useState<number>(1);
  const [effectPreview, setEffectPreview] = useState<string | null>(null);

  // Use global theme context
  const { currentTheme, selectedTheme, setSelectedTheme, applyTheme } = useTheme();

  const handleChange = (
    value: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    console.log({ value, event });
    setState({ activeTab: value });
  };

  const handleBackgroundChange = (selectedOption: any) => {
    const value = selectedOption.value;
    setSelectedBackground(value);
    const option = backgroundOptions.find(opt => opt.value === value);
    if (option) {
      setBackgroundPreview(option.image);
    }
  };

  const handleEffectChange = (selectedOption: any) => {
    const value = selectedOption.value;
    setSelectedEffect(value);
    const option = effectOptions.find(opt => opt.value === value);
    if (option) {
      setEffectPreview(option.image);
    }
  };

  const applyBackground = () => {
    const option = backgroundOptions.find(opt => opt.value === selectedBackground);
    if (option) {
      if (option.image) {
        document.body.style.backgroundImage = `url(${option.image})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
      } else {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = option.color;
      }
      localStorage.setItem('selected-background', selectedBackground.toString());
    }
  };

  const applyEffect = () => {
    const option = effectOptions.find(opt => opt.value === selectedEffect);
    if (option) {
      const bodyElement = document.body;
      if (bodyElement) {
        if (option.image) {
          bodyElement.style.setProperty('--before-bg-image', `url(${option.image})`);
        } else {
          bodyElement.style.setProperty('--before-bg-image', 'none');
        }
      }
      // Persist selected effect
      localStorage.setItem('selected-effect', selectedEffect.toString());
    }
  };


  // Initialize saved effects and themes on component mount
  useEffect(() => {
    // Initialize saved effects
    const savedEffect = localStorage.getItem('selected-effect');
    if (savedEffect) {
      const option = effectOptions.find(opt => opt.value === Number(savedEffect));
      if (option) {
        setSelectedEffect(option.value);
        setEffectPreview(option.image);
        if (option.image) {
          document.body.style.setProperty('--before-bg-image', `url(${option.image})`);
        } else {
          document.body.style.setProperty('--before-bg-image', 'none');
        }
      }
    }

  }, []);

  const handleThemeChange = (selectedOption: any) => {
    const value = selectedOption.value;
    setSelectedTheme(value);
  };

  const { activeTab } = state;
  return (
    <SmallWindow
      top={228}
      left={258}
      width={300}
      height={400}
      windowTitle="Setting"
      windowBarIcon="settings"
      closeWindow={props.onClose}
      onInteract={props.onInteract}
      minimizeWindow={props.onMinimize}
      bottomLeftText={'© by Rainer (Santos)'}
    >
      <GlobalStyles />
      <ThemeProvider theme={currentTheme}>
        <Frame style={styles.setting} variant='well'>
          <Tabs value={activeTab} onChange={handleChange} style={{ display: 'flex', width: '100%' }}>
            <Tab value={0} style={{ flex: 1, textAlign: 'center' }}>Background</Tab>
            <Tab value={1} style={{ flex: 1, textAlign: 'center' }}>Effects</Tab>
            <Tab value={2} style={{ flex: 1, textAlign: 'center' }}>Themes</Tab>
          </Tabs>
          <TabBody style={{ height: '100%' }}>
            {activeTab === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
                {/* Top - Preview */}
                <div style={{ 
                  width: '100%',
                  height: '80px', 
                  backgroundColor: backgroundOptions.find(opt => opt.value === selectedBackground)?.color || '#098684',
                  backgroundImage: backgroundPreview ? `url(${backgroundPreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '2px solid #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '12px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}>
                  Preview
                </div>

                {/* Middle - Controls */}
                <div style={{display: 'flex', flexDirection: 'column', gap: 15}}>
                  <GroupBox label='Wallpaper' style={{ width: '100%', height: '90%' }}>
                    <div style={{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Dropdown Select */}
                      <div>
                        <Select
                          value={selectedBackground}
                          options={selectOptions}
                          menuMaxHeight={130}
                          width={'100%'} 
                          onChange={handleBackgroundChange}
                        />
                      </div>
                    </div>
                  </GroupBox>
                  {/* Bottom - Buttons */}
                  <div style={{ display: 'flex',}}>
                    <Button onClick={() => {
                      // Cancel - restore previous background
                      const savedBg = localStorage.getItem('selected-background');
                      if (savedBg) {
                        const option = backgroundOptions.find(opt => opt.value === Number(savedBg));
                        if (option) {
                          setSelectedBackground(option.value);
                          setBackgroundPreview(option.image);
                        }
                      }
                    }}>Cancel</Button>
                    <Button onClick={applyBackground}>Apply</Button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
                {/* Top - Preview */}
                <div style={{ 
                  width: '100%',
                  height: '80px', 
                  backgroundColor: '#000',
                  backgroundImage: effectPreview ? `url(${effectPreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '2px solid #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '12px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}>
                  Effect Preview
                </div>

                {/* Middle - Controls */}
                <div style={{display: 'flex', flexDirection: 'column', gap: 15}}>
                  <GroupBox label='Effects' style={{ width: '100%', height: '90%' }}>
                    <div style={{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Dropdown Select */}
                      <div>
                        <Select
                          value={selectedEffect}
                          options={effectSelectOptions}
                          menuMaxHeight={130}
                          width={'100%'} 
                          onChange={handleEffectChange}
                        />
                      </div>
                    </div>
                  </GroupBox>
                  {/* Bottom - Buttons */}
                  <div style={{ display: 'flex',}}>
                    <Button onClick={() => {
                      // Cancel - restore previous effect
                      const savedEffect = localStorage.getItem('selected-effect');
                      if (savedEffect) {
                        const option = effectOptions.find(opt => opt.value === Number(savedEffect));
                        if (option) {
                          setSelectedEffect(option.value);
                          setEffectPreview(option.image);
                        }
                      }
                    }}>Cancel</Button>
                    <Button onClick={applyEffect}>Apply</Button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
                {/* Middle - Controls */}
                <div style={{display: 'flex', flexDirection: 'column', gap: 15}}>
                  <GroupBox label='Themes' style={{ width: '100%', height: '90%' }}>
                    <div style={{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Dropdown Select */}
                      <div>
                        <Select
                          value={selectedTheme}
                          options={themeSelectOptions}
                          menuMaxHeight={130}
                          width={'100%'} 
                          onChange={handleThemeChange}
                        />
                      </div>
                    </div>
                  </GroupBox>
                  {/* Bottom - Buttons */}
                  <div style={{ display: 'flex', gap: '5px'}}>
                    <Button onClick={() => {
                      // Cancel - restore previous theme from global context
                      const savedTheme = localStorage.getItem('selected-theme');
                      if (savedTheme) {
                        setSelectedTheme(Number(savedTheme));
                      }
                    }}>Cancel</Button>
                    <Button onClick={() => applyTheme(selectedTheme)}>Apply</Button>
                  </div>
                </div>
              </div>
            )}
          </TabBody>
        </Frame>
      </ThemeProvider>
    </SmallWindow>
  );
};

const styles: StyleSheetCSS = {
  setting: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
  }
};

export default Settings;