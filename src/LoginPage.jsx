import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './LoginPage.css';

const LoginPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://garbage-tracking-backend.onrender.com/driver-login/get-all-drivers/')
      .then(response => response.json())
      .then(data => setDrivers(data))
      .catch(error => console.error('Error fetching drivers:', error));
  }, []);

  const handleLogin = () => {
    if (!selectedDriver || !password) return;

    setIsLoading(true);
    const loginData = {
      driverId: selectedDriver,
      password: password,
    };

    console.log('Login Data:', loginData);

    fetch('https://garbage-tracking-backend.onrender.com/driver-login/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Login Response:', data);
        setIsLoading(false);
        if (data.message === 'Login successful') {
          navigate('/home', { state: { ...data } });
        } else {
          alert('Login failed');
        }
      })
      .catch(error => {
        console.error('Error during login:', error);
        setIsLoading(false);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading && selectedDriver && password) {
      handleLogin();
    }
  };

  return (
    <div className="login-container" onKeyDown={handleKeyPress}>
      <div className="login-card">
        <h1>Login</h1>
        <select
          onChange={(e) => setSelectedDriver(e.target.value)}
          value={selectedDriver}
          required
        >
          <option value="" disabled>Select Driver</option>
          {drivers.map(driver => (
            <option key={driver.driverId} value={driver.driverId}>
              {driver.name}
            </option>
          ))}
        </select>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)} className="password-icon">
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>
        <button
          onClick={handleLogin}
          disabled={!selectedDriver || !password || isLoading}
        >
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            'Login'
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
