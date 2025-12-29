// compoment for the buttons onthe window bar: maximise minimise and close button
import React, { useState } from 'react';
import { IconName } from '../../assets/app-icons';
import Colors from '../../contstants/colors';
import { Icon } from '../general';

// props
export interface ButtonProps {
    icon?: IconName;       
    text?: string;          
    onClick?: () => void;   
}


const Button: React.FC<ButtonProps> = ({ icon, text, onClick }) => {
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };


    const outerBorderStyle = Object.assign(
        {},
        styles.outerBorder,
        icon && { width: 16, height: 14 } 
    );

    const innerBorderStyle = Object.assign(
        {},
        styles.innerBorder,
        icon && { width: 12, height: 12 }, 
        text && { padding: 4 }          
    );

    //click event handler
    const click = (e: any) => {
        e.preventDefault();
        onClick && onClick();
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={outerBorderStyle}
            onMouseDown={click}
        >
            <div
                style={Object.assign(
                    {},
                    isHovering && { backgroundColor: Colors.darkGray },  
                    innerBorderStyle
                )}
            >
                {icon && <Icon icon={icon} style={styles.icon} />}
                {text && (
                    <p>{text}</p>
                )}
            </div>
        </div>
    );
};


const styles: StyleSheetCSS = {
    outerBorder: {
        border: `1px solid ${Colors.black}`,
        borderTopColor: Colors.white,      
        borderLeftColor: Colors.white,    
        background: Colors.lightGray,     
        cursor: 'pointer',                 
    },
    innerBorder: {
        border: `1px solid ${Colors.darkGray}`,
        borderTopColor: Colors.lightGray,  
        borderLeftColor: Colors.lightGray,
        flex: 1,                         
    },
};

export default Button;
