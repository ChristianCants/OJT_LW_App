
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SecretRouteListener = () => {
  const navigate = useNavigate();
  // Sequence: 'l', 'i', 'f', 'e', ' ', ' '
  // We'll track the last few keystrokes

  useEffect(() => {
    let keyBuffer = '';
    const secretCode = 'life  '; // life followed by double space
    const maxBufferLength = 20;

    const handleKeyDown = (event) => {
      // Use event.key to get the character
      // For space, event.key is ' '
      // We need to be careful with casing, let's convert to lowercase for the letters
      // but keep space as is.

      const key = (event.key && event.key.length === 1) ? event.key.toLowerCase() : '';

      if (!key) return; // Ignore non-character keys like Shift, Control, etc. if they don't produce a char we want to track easily

      keyBuffer += key;

      // Keep buffer from growing indefinitely
      if (keyBuffer.length > maxBufferLength) {
        keyBuffer = keyBuffer.slice(-maxBufferLength);
      }

      // Check for the secret code
      if (keyBuffer.endsWith(secretCode)) {
        console.log("Secret route activated!");
        navigate('/admin/signin');
        keyBuffer = ''; // Reset buffer
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default SecretRouteListener;
