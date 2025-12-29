import Calendar from 'react-calendar';
import { useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import Colors from '../../contstants/colors';
/* Original Windows95 font */
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';


const CalendarStyles = createGlobalStyle<{ theme: any }>`

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


  /* Windows 95 style calendar */
  .react-calendar {
    width: 100% !important;
    background: transparent !important;
    border: none !important;
    font-family: 'ms_sans_serif', Arial, Helvetica, sans-serif !important;
    line-height: 1.125em !important;
    padding: 4px !important;
    display: block !important;
  }
  
  .react-calendar__viewContainer {
    width: 100% !important;
  }
  
  .react-calendar__month-view {
    width: 100% !important;
    display: block !important;
  }
  
  .react-calendar__navigation {
    display: flex !important;
    height: 24px !important;
    margin-bottom: 4px !important;
    justify-content: space-between !important;
    align-items: center !important;
  }
  
  .react-calendar__navigation button {
    min-width: 24px !important;
    height: 22px !important;
    background: transparent !important;
    border: 1px solid ${Colors.darkGray} !important;
    border-top-color: ${Colors.white} !important;
    border-left-color: ${Colors.white} !important;
    font-size: 11px !important;
    padding: 2px 6px !important;
    cursor: pointer !important;
    font-family: 'ms_sans_serif', Arial, Helvetica, sans-serif !important;
    display: inline-block !important;
    color: ${props => props.theme?.materialText || Colors.black} !important;
    margin: 0 !important;
  }
  
  .react-calendar__navigation button:enabled:hover {
    background: transparent !important;
  }
  
  .react-calendar__navigation button:enabled:active {
    border: 1px solid ${Colors.white} !important;
    border-top-color: ${Colors.darkGray} !important;
    border-left-color: ${Colors.darkGray} !important;
  }
  
  .react-calendar__navigation__label {
    font-size: 11px !important;
    font-weight: bold !important;
    padding: 2px 8px !important;
    pointer-events: none !important;
    display: inline-block !important;
    color: ${props => props.theme?.materialText || Colors.black} !important;
  }
  
  .react-calendar__month-view {
    display: block !important;
  }
  
  .react-calendar__month-view__weekdays {
    display: none !important;
  }
  
  .react-calendar__month-view__weekdays__weekday {
    display: none !important;
  }
  
  .react-calendar__month-view__weekdays__weekday abbr {
    display: none !important;
  }
  
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: repeat(7, 1fr) !important;
    gap: 0 !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
  
  .react-calendar__tile {
    aspect-ratio: 1 !important;
    width: 100% !important;
    padding: 6px 0 !important;
    background: transparent !important;
    text-align: center !important;
    line-height: 14px !important;
    font-size: 11px !important;
    border: 1px solid transparent !important;
    cursor: default !important;
    font-family: 'ms_sans_serif', Arial, Helvetica, sans-serif !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: ${props => props.theme?.materialText || Colors.black} !important;
    margin: 0 !important;
  }
  
  .react-calendar__tile abbr {
    display: block !important;
    color: inherit !important;
  }
  
  .react-calendar__tile:enabled:hover {
    background: transparent !important;
    color: ${props => props.theme?.materialText || Colors.black} !important;
  }
  
  .react-calendar__tile:enabled:hover abbr {
    color: ${props => props.theme?.materialText || Colors.black} !important;
  }
  
  .react-calendar__tile--active {
    background: ${Colors.purple} !important;
    color: ${Colors.white} !important;
  }
  
  .react-calendar__tile--active abbr {
    color: ${Colors.white} !important;
  }
  
  .react-calendar__tile--now,
  .react-calendar__tile--now:enabled {
    background: ${Colors.purple} !important;
    font-weight: bold !important;
    color: ${Colors.white} !important;
  }
  
  .react-calendar__tile--now abbr {
    color: ${Colors.white} !important;
    border-bottom: none !important;
    background: transparent !important;
  }
  
  .react-calendar__tile--now:enabled:hover {
    background: ${Colors.purple} !important;
    color: ${Colors.white} !important;
  }
  
  .react-calendar__tile--now:enabled:hover abbr {
    color: ${Colors.white} !important;
  }
  
  /* Ensure --now overrides --active when both are present */
  .react-calendar__tile--now.react-calendar__tile--active {
    background: ${Colors.purple} !important;
    color: ${Colors.white} !important;
  }
  
  .react-calendar__tile--now.react-calendar__tile--active abbr {
    color: ${Colors.white} !important;
  }
  
  /* Handle disabled tiles that are today */
  .react-calendar__tile--now.react-calendar__tile--disabled {
    background: ${Colors.purple} !important;
    color: ${Colors.white} !important;
    opacity: 1 !important;
  }
  
  .react-calendar__tile--now.react-calendar__tile--disabled abbr {
    color: ${Colors.white} !important;
  }
  
  .react-calendar__month-view__days__day--neighboringMonth {
    color: ${props => props.theme?.materialTextDisabled || Colors.darkGray} !important;
    opacity: 0.5 !important;
  }
  
  .react-calendar__month-view__days__day--neighboringMonth abbr {
    color: ${props => props.theme?.materialTextDisabled || Colors.darkGray} !important;
  }
  
  .react-calendar__month-view__days__day--neighboringMonth:hover abbr {
    color: ${props => props.theme?.materialText || Colors.black} !important;
  }
`;

export const DatePicker = () => {
    const today = new Date();
    const [activeStartDate, setActiveStartDate] = useState<Date>(today);
    const { currentTheme } = useTheme();

    const onActiveStartDateChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {
        if (activeStartDate) {
            setActiveStartDate(activeStartDate);
        }
    };

    return (
        <>
            <CalendarStyles theme={currentTheme} />
            <Calendar 
                value={today} 
                onChange={() => {}} 
                tileDisabled={() => true}
                showNeighboringMonth={false}
                activeStartDate={activeStartDate}
                onActiveStartDateChange={onActiveStartDateChange}
            />
        </>
    )
}
  