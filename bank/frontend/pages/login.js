import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        console.error('Response status:', response.status);
        console.error('Response message:', response.statusText);
        setError('Fel användarnamn eller lösenord!');
        return;
      }

      const data = await response.json();

      if (data.otp) {
        setError('');
        setOtp(data.otp); 
        localStorage.setItem('otp', data.otp); 
        router.push('/account'); 
      } else {
        setError('Fel användarnamn eller lösenord!');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Ett fel inträffade vid inloggningen.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white-100">
      <nav className="w-full bg-white p-4 text-black flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-4">
          <Image src="/bank.jpg" alt="Logo" width={120} height={120} />
          <ul className="flex space-x-4 font-extrabold">
            <li>
              <Link href="/" legacyBehavior>
                <a className="hover:text-red-500">Hem</a>
              </Link>
            </li>
            <li>
              <Link href="/login" legacyBehavior>
                <a className="hover:text-red-500">Logga in</a>
              </Link>
            </li>
            <li>
              <Link href="/register" legacyBehavior>
                <a className="hover:text-red-500">Registrera dig</a>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="flex items-center justify-center flex-grow bg-white-100">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Logga In</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <input
            type="text"
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logga In
          </button>
          {otp && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
              <p>OTP: {otp}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


