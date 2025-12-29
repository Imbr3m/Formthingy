// defining a set of named CSS style objects
declare interface StyleSheetCSS {
    [key: string]: React.CSSProperties;
}

// props for the window buttons
declare interface WindowAppProps {
    onClose: () => void;      
    onInteract: () => void;   
    onMinimize: () => void; 
}

// all open desktop windows, separated by window id
declare type DesktopWindows = {
    [key in string]: {
        zIndex: number;                
        component: React.ReactElement; 
        minimized: boolean;
        name: string;                 
        icon: IconName;                
    };
};
