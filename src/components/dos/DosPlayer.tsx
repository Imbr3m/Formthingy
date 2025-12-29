//  got the idea and code from https://js-dos.com/DOOM/ and https://github.com/thedoggybrad/doom_on_js-dos

import { useEffect, useRef, useState } from 'react';0

declare global {
    interface Window {
        Dos: DosPlayerFactoryType;
    }
}

interface DosPlayerFactoryType {
    (root: HTMLDivElement): DosPlayerInstance;
}

interface DosPlayerInstance {
    run: (bundleUrl: string) => void;
    stop: () => void;
}

interface PlayerProps {
    bundleUrl: string;
}

export default function DosPlayer(props: PlayerProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [dos, setDos] = useState<DosPlayerInstance | null>(null);
    const instanceRef = useRef<DosPlayerInstance | null>(null);

    useEffect(() => {
        if (rootRef.current === null) {
            return;
        }

        if (instanceRef.current) {
            return;
        }

        let checkInterval: NodeJS.Timeout | null = null;
        let initTimeout: NodeJS.Timeout | null = null;
        let isCleanedUp = false;

        const initializeDos = () => {
            if (!rootRef.current || typeof window.Dos === 'undefined' || instanceRef.current || isCleanedUp) {
                return;
            }

            const root = rootRef.current as HTMLDivElement;
            
            root.innerHTML = '';
            
            const instance = window.Dos(root);

            if (isCleanedUp || instanceRef.current) {
                try {
                    instance.stop();
                } catch (e) {
                }
                return;
            }

            instanceRef.current = instance;
            setDos(instance);

            const elements = root.getElementsByClassName('flex-grow-0');
            while (elements.length > 0) {
                elements[0].remove();
            }
        };

        if (typeof window.Dos !== 'undefined') {
            initTimeout = setTimeout(initializeDos, 100);
        } else {
            checkInterval = setInterval(() => {
                if (typeof window.Dos !== 'undefined' && rootRef.current && !instanceRef.current && !isCleanedUp) {
                    if (checkInterval) {
                        clearInterval(checkInterval);
                    }
                    initializeDos();
                }
            }, 100);

            setTimeout(() => {
                if (checkInterval) {
                    clearInterval(checkInterval);
                    console.error('Dos failed to load - make sure js-dos.js is loaded');
                }
            }, 10000);
        }

        return () => {
            isCleanedUp = true;
            
            if (initTimeout) {
                clearTimeout(initTimeout);
            }
            if (checkInterval) {
                clearInterval(checkInterval);
            }
            if (instanceRef.current) {
                try {
                    instanceRef.current.stop();
                } catch (e) {
                }
                instanceRef.current = null;
                setDos(null);
            }
            if (rootRef.current) {
                rootRef.current.innerHTML = '';
            }
        };
    }, []); 

    const lastRunBundleUrl = useRef<string | null>(null);

    useEffect(() => {
        if (dos !== null && props.bundleUrl) {
            if (lastRunBundleUrl.current !== props.bundleUrl) {
                lastRunBundleUrl.current = props.bundleUrl;
                dos.run(props.bundleUrl);
            }
        }
    }, [dos, props.bundleUrl]);

    return (
        <div
            ref={rootRef}
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
            }}
        ></div>
    );
}
