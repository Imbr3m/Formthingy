import React, { useEffect, useRef, useState } from 'react';
import { IconName } from '../../assets/app-icons';
import colors from '../../contstants/colors';
import Colors from '../../contstants/colors';
import Icon from '../general/Icon';
import Button from './Button';
import DragIndicator from './DragIndicator';

//props
export interface SmallWindowProps {
    closeWindow: () => void;         
    minimizeWindow: () => void;       
    onInteract: () => void;            
    width: number;                     
    height: number;                     
    top: number;                        
    left: number;                      
    windowTitle?: string;               
    bottomLeftText?: string;            
    windowBarColor?: string;           
    windowBarIcon?: IconName;          
    onWidthChange?: (width: number) => void;   // callback when window width changes
    onHeightChange?: (height: number) => void; // callback when window height changes
    children?: React.ReactNode;        // content inside the window
}


const SmallWindow: React.FC<SmallWindowProps> = (props) => {
    // Refs for DOM elements
    const windowRef = useRef<any>(null);      // main window container
    const dragRef = useRef<any>(null);        // drag indicator overlay
    const contentRef = useRef<any>(null);    // content area
    
    // @ts-ignore idk
    const dragProps = useRef<{
        dragStartX: any;    
        dragStartY: any;    
    }>();

    // window position state
    const [top, setTop] = useState(props.top);     
    const [left, setLeft] = useState(props.left);  

    // noting if last click was inside this window
    const lastClickInside = useRef(false);


    // window state
    const [windowActive, setWindowActive] = useState(true);  

    const [isDragging, setIsDragging] = useState(false);   // window is being dragged




   
    // triggers when u use the topbar to drag
    const startDrag = (event: any) => {
        const { clientX, clientY } = event;
        setIsDragging(true);
        event.preventDefault();
        
        dragProps.current = {
            dragStartX: clientX,
            dragStartY: clientY,
        };
        
        window.addEventListener('mousemove', onDrag, false);
        window.addEventListener('mouseup', stopDrag, false);
    };

    
    const onDrag = ({ clientX, clientY }: any) => {
        let { x, y } = getXYFromDragProps(clientX, clientY);
        dragRef.current.style.transform = `translate(${x}px, ${y}px)`;
        dragRef.current.style.opacity = 1; 
    };

    // updates the new positions
    const stopDrag = ({ clientX, clientY }: any) => {
        setIsDragging(false);
        const { x, y } = getXYFromDragProps(clientX, clientY);
        setTop(y);      
        setLeft(x);     
        window.removeEventListener('mousemove', onDrag, false);
        window.removeEventListener('mouseup', stopDrag, false);
    };

    
    const getXYFromDragProps = (
        clientX: number,
        clientY: number
    ): { x: number; y: number } => {
        if (!dragProps.current) return { x: 0, y: 0 };
        const { dragStartX, dragStartY } = dragProps.current;

        
        const x = clientX - dragStartX + left;
        const y = clientY - dragStartY + top;

        return { x, y };
    };


    // UPDATES WHEN RESIZES OR DRAGS
    useEffect(() => {
        dragRef.current.style.transform = `translate(${left}px, ${top}px)`;
    });






    // window is active function
    const onCheckClick = () => {
        if (lastClickInside.current) {
            setWindowActive(true);    // if window was clicked, it is a active
        } else {
            setWindowActive(false);  
        }
        lastClickInside.current = false;
    };

   
    useEffect(() => {
        window.addEventListener('mousedown', onCheckClick, false);
        return () => {
            window.removeEventListener('mousedown', onCheckClick, false);
        };
    }, []);

    // brings window to front and make it active
    const onWindowInteract = () => {
        props.onInteract();           
        setWindowActive(true);      
        lastClickInside.current = true; 
    };

    return (
        <div onMouseDown={onWindowInteract} style={styles.container}>
            <div
                style={Object.assign({}, styles.window, {
                    width: props.width,    
                    height: props.height,   
                    top,      
                    left,    
                })}
                ref={windowRef}
            >
                <div style={styles.windowBorderOuter}>
                    {/* inner border fot that inset effect */}
                    <div style={styles.windowBorderInner}>
                        {/* invisible border for dragging the window */}
                        <div
                            style={styles.dragHitbox}
                            onMouseDown={startDrag}
                        ></div>
                        
                        <div
                            style={Object.assign(
                                {},
                                styles.topBar,
                                props.windowBarColor && {
                                    backgroundColor: props.windowBarColor,
                                },
                                !windowActive && {
                                    backgroundColor: Colors.darkGray,  // gray if not activce
                                }
                            )}
                        >
                            {/* title and icon area */}
                            <div style={styles.windowHeader}>
                                {props.windowBarIcon ? (
                                    <Icon
                                        icon={props.windowBarIcon}
                                        style={Object.assign(
                                            {},
                                            styles.windowBarIcon,
                                            !windowActive && { opacity: 0.5 }
                                        )}
                                        size={16}
                                    />
                                ) : (
                                    <div style={{width: 16, height: 16}} />
                                )}
                                <p
                                    style={
                                        windowActive
                                            ? {}
                                            : { color: colors.lightGray }  // text will be gray if not active
                                    }
                                    className="showcase-header"
                                >
                                    {props.windowTitle}
                                </p>
                            </div>
                            
                            {/* window control buttons */}
                            <div style={styles.windowTopButtons}>
                                <div style={{ paddingLeft: 2 }}>
                                    <Button
                                        icon="close"
                                        onClick={props.closeWindow}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div
                            style={Object.assign({}, styles.contentOuter, {
                            })}
                        >
                            <div style={styles.contentInner}>
                                <div style={styles.content} ref={contentRef}>
                                    {props.children}  {/* window content */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* overlays when resizin or draging */}    
            <div
                style={
                    !isDragging
                        ? {
                              zIndex: -10000,       
                              pointerEvents: 'none',
                          }
                        : {
                              zIndex: 1000,         
                              cursor: 'move',
                              mixBlendMode: 'difference',
                          }
                }
            >
                <DragIndicator
                    width={props.width}
                    height={props.height}
                    dragRef={dragRef}
                />
            </div>
        </div>
    );
};


const styles: StyleSheetCSS = {
    window: {
        backgroundColor: Colors.lightGray,
        position: 'absolute',
    },
    dragHitbox: {
        position: 'absolute',
        width: 'calc(100% - 25px)',
        height: 48,
        zIndex: 10000,
        top: -8,
        left: -4,
        cursor: 'move',
    },
    windowBorderOuter: {
        border: `1px solid ${Colors.black}`,
        borderTopColor: colors.lightGray,
        borderLeftColor: colors.lightGray,
        flex: 1,
    },
    windowBorderInner: {
        border: `1px solid ${Colors.darkGray}`,
        borderTopColor: colors.white,
        borderLeftColor: colors.white,
        flex: 1,
        padding: 2,
        flexDirection: 'column',
    },
    resizeHitbox: {
        position: 'absolute',
        width: 60,
        height: 60,
        bottom: -20,
        right: -20,
        cursor: 'nwse-resize',
    },
    topBar: {
        backgroundColor: Colors.purple,
        width: '100%',
        height: 20,
        alignItems: 'center',
        paddingRight: 2,
        boxSizing: 'border-box',
    },
    contentOuter: {
        border: `1px solid ${Colors.white}`,
        borderTopColor: colors.darkGray,
        borderLeftColor: colors.darkGray,
        flexGrow: 1,
        marginTop: 8,
        marginBottom: 8,
        overflow: 'hidden',
    },
    contentInner: {
        border: `1px solid ${Colors.lightGray}`,
        borderTopColor: colors.black,
        borderLeftColor: colors.black,
        flex: 1,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        position: 'relative',
        overflowX: 'hidden',
        backgroundColor: Colors.white,
    },
    bottomBar: {
        flexShrink: 1,
        width: '100%',
        height: 20,
    },
    bottomSpacer: {
        width: 16,
        marginLeft: 2,
    },
    insetBorder: {
        border: `1px solid ${Colors.white}`,
        borderTopColor: colors.darkGray,
        borderLeftColor: colors.darkGray,
        padding: 2,
    },
    bottomResizeContainer: {
        flex: 2 / 7,
        justifyContent: 'flex-end',
        padding: 0,
        marginLeft: 2,
    },
    windowTopButtons: {
        alignItems: 'center',
    },
    windowHeader: {
        flex: 1,
        alignItems: 'center',
    },
    windowBarIcon: {
        paddingLeft: 4,
        paddingRight: 4,
    },
};

export default SmallWindow;
