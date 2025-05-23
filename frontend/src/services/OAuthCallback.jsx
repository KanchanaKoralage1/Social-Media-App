import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(decodeURIComponent(window.location.hash.substring(1)));
    
    if (data.token && data.username && data.email) {
      // Store authentication data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        username: data.username,
        email: data.email
      }));

      // Close popup and navigate in parent window
      if (window.opener) {
        window.opener.postMessage({ type: 'oauth-success' }, window.location.origin);
        window.close();
      } else {
        navigate('/home');
      }
    }
  }, [navigate]);

  return <div>Processing login...</div>;
};

export default OAuthCallback;