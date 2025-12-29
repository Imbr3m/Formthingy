import React, { useEffect, useRef, useState } from 'react'
import SmallWindow from '../os/SmallWindow';

import Sunny from '../../assets/imgs/Sun.png';
import Windy from '../../assets/imgs/Wind.png';
import Humidity from '../../assets/imgs/Wave.png';
import Night from '../../assets/imgs/Moon.png';
import Cloudy from '../../assets/imgs/Cloudy  Day.png';
import CloudyNight from '../../assets/imgs/Cloudy Night.png';
import Rainy from '../../assets/imgs/Raining.png';
import Snowy from '../../assets/imgs/Snow.png';
import Thunderstorm from '../../assets/imgs/Thunder.png';
import Fog from '../../assets/imgs/Wave.png';


// Components import
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Frame, Tooltip, Button, TextInput, Separator, WindowHeader } from 'react95';

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


// tilt component - simple card tilt effect (matching old project)
const Tilt = ({children, onTransformChange}: {children: React.ReactNode, onTransformChange: (transform: string) => void}) => {
    const itemRef = useRef<HTMLDivElement>(null);
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if(!itemRef.current) return;

        const { left, top, width, height } = itemRef.current.getBoundingClientRect();

        const relativeX = (e.clientX - left) / width;
        const relativeY = (e.clientY - top) / height;

        const tiltX = (relativeY - 0.5) * 25;
        const tiltY = (relativeX - 0.5) * -25;

        const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        onTransformChange(newTransform);
    }
    
    const handleMouseLeave = () => {
        onTransformChange("");
    }

    return (
        <div 
            ref={itemRef} 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave} 
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'auto',
                zIndex: 1,
            }}
        >
            {children}
        </div>
    )
}





export interface WeatherProps extends WindowAppProps {}

export const Weather: React.FC<WeatherProps> = (props) => {
    const { currentTheme } = useTheme();
    const [weatherData, setWeatherData] = useState<any>(null);
    const [cityInput, setCityInput] = useState<string>('');
    const [tiltTransform, setTiltTransform] = useState<string>('');

    const allIcons: { [key: string]: string } = {
        "01d": Sunny,
        "01n": Night,
        "02d": Cloudy,
        "02n": CloudyNight,
        "03d": Cloudy,
        "03n": CloudyNight,
        "04d": Cloudy,
        "04n": CloudyNight,
        "09d": Rainy,
        "09n": Rainy,
        "10d": Rainy,
        "10n": Rainy,
        "11d": Thunderstorm,
        "11n": Thunderstorm,
        "13d": Snowy,
        "13n": Snowy,
        "50d": Fog,
        "50n": Fog,
    }

    // api calling
    const search = async (city: string) => {
        if (!city.trim()) {
            console.log('Please enter a city name');
            return;
        }
        
        try {
            const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
            console.log('API Key exists:', !!apiKey); // api check
            
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${apiKey}&units=metric`;
            console.log('Fetching from URL:', url.replace(apiKey, 'HIDDEN')); // url check

            const response = await fetch(url);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                return;
            }

            const data = await response.json();
            console.log(`Weather data for ${city}:`, data);

            const icon = allIcons[data.weather[0].icon] || Sunny;
            
            setWeatherData({
                humidity: data.main.humidity,
                weather: data.weather[0].description,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                city: data.name,
                country: data.sys.country,
                weatherIcon: icon,
            });
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    const handleSearch = () => {
        if (cityInput.trim()) {
            search(cityInput);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }
    
    useEffect(() => {
        search('Dubai');
    }, []);
    
    const styles: StyleSheetCSS = {
      weather: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
        overflow: 'hidden',
      },
      searchbox: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        gap: 10,
      },
      weatherFrame: {
        width: '90%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        paddingBottom: 30,
        gap: 10,
      },
      weatherIcon: {
        width: 150,
        height: 150,
      },
      weatherText: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      weatherinfo: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        gap: 10,
      },
      tooltip: {
        fontSize: 20,
        fontFamily: 'ms_sans_serif',
        padding: 10,
        color: currentTheme.materialText,
        backgroundColor: currentTheme.material,
      },
      humidity: {
        height: '70%',
        padding: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        width: '50%',
      },
      windSpeed: {
        height: '70%',
        padding: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        width: '50%',
      },
      humidityIcon: {
        width: 50,
        height: 50,
      },
      weatherHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      },
    };

  return (
    <SmallWindow
      top={25}
      left={550}
      width={400}
      height={550}
      windowTitle="Weather"
      windowBarIcon="weather"
      closeWindow={props.onClose}
      onInteract={props.onInteract}
      minimizeWindow={props.onMinimize}
      bottomLeftText={'© by Rainer (Santos)'}
    >
      <GlobalStyles />
      <ThemeProvider theme={currentTheme}>
        <Frame style={styles.weather} variant='well'>
          <div className="searchbox" style={styles.searchbox}>
            <TextInput 
              placeholder='Enter a city...' 
              fullWidth
              value={cityInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCityInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
        
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Frame variant='field' style={{...styles.weatherFrame, position: 'relative', overflow: 'hidden'}}>
            <WindowHeader style={styles.weatherHeader}>
                {weatherData?.weather
                    ? weatherData.weather.charAt(0).toUpperCase() + weatherData.weather.slice(1)
                    : '--'}
            </WindowHeader>
              <Tilt onTransformChange={setTiltTransform}>
                <div style={{ width: '100%', height: '100%' }} />
              </Tilt>
              <div 
                style={{
                  transform: tiltTransform,
                  transition: tiltTransform ? 'none' : 'transform 0.3s ease-out',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  position: 'relative',
                  zIndex: 0,
                }}
              >
                <img src={weatherData?.weatherIcon || Sunny} alt="Weather" style={styles.weatherIcon}/>
                <Separator size={'90%'}/>
                <p style={styles.weatherText}>{weatherData?.temperature ?? '--'}°C</p>
                <p>{weatherData?.city || '--'}, {weatherData?.country || '--'}</p>
              </div>
            </Frame>
          </div>
          
          <div style={styles.weatherinfo}>
            <Frame variant='status' style={styles.humidity}>
              <Tooltip text="Humidity" enterDelay={100} leaveDelay={100} style={styles.tooltip}> 
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={Humidity} alt="Humidity" style={styles.humidityIcon}/>
                  <p>{weatherData?.humidity ?? '--'}%</p>
                </div>
              </Tooltip>
            </Frame>
            <Frame variant='status' style={styles.windSpeed}>
              <Tooltip text="Wind Speed" enterDelay={100} leaveDelay={100} style={styles.tooltip}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={Windy} alt="wind" style={styles.humidityIcon}/>
                  <p>{weatherData?.windSpeed ?? '--'} km/h</p>
                </div>
              </Tooltip>
            </Frame>
          </div>
        </Frame>
      </ThemeProvider>
    </SmallWindow>
  );
};

export default Weather;