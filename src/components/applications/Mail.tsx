import React, { useState, useRef, useEffect } from 'react'
import Window from '../os/Window';

import emailjs from '@emailjs/browser';

// Components import
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Frame, Button, Toolbar as Toolbar95, TextInput, Handle, ProgressBar} from 'react95';

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



export interface MailProps extends WindowAppProps {}

export const Mail: React.FC<MailProps> = (props) => {
    const { currentTheme } = useTheme(); // theme that is current haha
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // EmailJS IDs
    const serviceID = 'service_02icbrj';
    const templateID = 'template_6izop6n';
    const publicKey = '5zw5rqiSjsdyFoJRr';

    const nameInputRef = useRef<HTMLInputElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);

    // Animate progress bar
    useEffect(() => {
        if (showProgress && isSending) {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return 90; // Don't go to 100 until email is actually sent
                    }
                    return prev + 10;
                });
            }, 200);
            return () => clearInterval(interval);
        }
    }, [showProgress, isSending]);

    const handleNew = () => {
        setName('');
        setEmail('');
        setSubject('');
    };

    const handleDelete = () => {
        setSubject('');
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setSubject(text);
        } catch (err) {
            console.error('Failed to read clipboard:', err);
            // Fallback: try to use document.execCommand for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = '';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('paste');
                setSubject(textarea.value);
            } catch (e) {
                console.error('Fallback paste failed:', e);
            }
            document.body.removeChild(textarea);
        }
    };

    const handleNameClick = () => {
        if (nameInputRef.current) {
            nameInputRef.current.focus();
            nameInputRef.current.select();
        }
    };

    const handleEmailClick = () => {
        if (emailInputRef.current) {
            emailInputRef.current.focus();
            emailInputRef.current.select();
        }
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate fields
        if (!name.trim() || !email.trim() || !subject.trim()) {
            setMessage({ text: 'Please fill in all fields', type: 'error' });
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage({ text: 'Please enter a valid email address', type: 'error' });
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        setIsSending(true);
        setShowProgress(true);
        setProgress(0);
        setMessage(null);

        // Template params with current state values
        const templateParams = {
            from_name: name,
            from_email: email,
            subject: subject,
        };
        
        emailjs.send(serviceID, templateID, templateParams, publicKey)
            .then((result) => {
                console.log(result.text);
                // Complete the progress bar first
                setProgress(100);
                setIsSending(false);
                
                // Wait for progress bar to reach 100% and be visible, then hide it and show message
                setTimeout(() => {
                    setShowProgress(false);
                    setProgress(0);
                    
                    // Show success message after progress bar disappears
                    setTimeout(() => {
                        setMessage({ text: 'Email sent successfully!', type: 'success' });
                        
                        // Clear form after showing message
                        setTimeout(() => {
                            setName('');
                            setEmail('');
                            setSubject('');
                            setTimeout(() => setMessage(null), 1500);
                        }, 1500);
                    }, 300);
                }, 800);
            }, (error) => {
                console.log(error.text);
                // Complete progress bar first
                setProgress(100);
                setIsSending(false);
                
                // Wait for progress bar to complete, then hide it and show error
                setTimeout(() => {
                    setShowProgress(false);
                    setProgress(0);
                    
                    // Show error message after progress bar disappears
                    setTimeout(() => {
                        setMessage({ text: 'Failed to send email. Please try again.', type: 'error' });
                        setTimeout(() => setMessage(null), 3000);
                    }, 300);
                }, 800);
            });
    };

    return (
        <Window
            top={100}
            left={600}
            width={500}
            height={450}
            windowTitle="Mail"
            windowBarIcon="mailIcon"
            // rainbow={true}
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={'Send an email to someone you love~'}
        >
            <GlobalStyles />
            <ThemeProvider theme={currentTheme}>
                <Frame style={styles.mail} variant='well'>
                    <Toolbar95 style={styles.toolbar}>
                        <Button variant='thin' onClick={handleNew}>New</Button>
                        <Handle size={30} />
                        <Button variant='thin' onClick={handleDelete}>Delete</Button>
                        <Handle size={30} />
                        <Button variant='thin' onClick={handlePaste}>Paste</Button>
                    </Toolbar95>
                    <form style={styles.form} onSubmit={handleSend}>
                        {showProgress && (
                            <div style={styles.progressContainer}>
                                <ProgressBar variant='tile' value={progress} />
                            </div>
                        )}
                        {message && (
                            <div style={{
                                ...styles.message,
                                color: message.type === 'success' ? currentTheme.materialText : '#c00000'
                            }}>
                                {message.text}
                            </div>
                        )}
                        <div style={styles.send}>
                            <Button 
                                variant='raised' 
                                style={styles.button} 
                                type="submit"
                                disabled={isSending}
                            >
                                {isSending ? 'Sending...' : 'Send'}
                            </Button>
                            <TextInput value='rainertoviel@gmail.com' disabled={true} fullWidth />
                        </div>
                        <div style={styles.name}>
                            <Button variant='raised' style={styles.button} onClick={handleNameClick}>Name</Button>
                            <TextInput 
                                ref={nameInputRef}
                                value={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                fullWidth 
                                placeholder="Enter your name here..."
                            />
                        </div>
                        <div style={styles.email}>
                            <Button variant='raised' style={styles.button} onClick={handleEmailClick}>Email</Button>
                            <TextInput 
                                ref={emailInputRef}
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                fullWidth 
                                placeholder="Enter your email here..."
                            />
                        </div>
                        <div style={styles.subject}>
                            <TextInput 
                                value={subject}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSubject(e.target.value)}
                                multiline 
                                rows={4} 
                                placeholder="Enter your messege here..." 
                                fullWidth 
                                style={styles.subjectInput}
                            />
                        </div>
                    </form>
                        

                </Frame>
            </ThemeProvider>
        </Window>
    );
}
const styles: StyleSheetCSS = {
    mail: {
        width: '100%', 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    form: {
        width: '95%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    toolbar: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    button: {
        width: '100px',
        maxWidth: '100px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressContainer: {
        width: '100%',
        padding: '10px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center',
    },
    message: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '5px 10px',
        transition: 'opacity 0.3s ease',
    },
    send: {
        width: '100%',
        display: 'flex',
        gap: '10px',
    },
    name: {
        width: '100%',
        display: 'flex',
        gap: '10px',
    },
    email: {
        width: '100%',
        display: 'flex',
        gap: '10px',
    },
    subject: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    subjectInput: {
        width: '100%',
        height: '95%',
    },
};

export default Mail;
