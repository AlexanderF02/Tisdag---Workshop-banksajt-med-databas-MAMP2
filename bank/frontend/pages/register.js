import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      alert('Användare skapad!');
    } catch (error) {
      console.error('Error:', error);
      alert('Ett fel inträffade vid skapandet av användaren.');
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
      <div className="flex flex-col items-center justify-center flex-grow bg-white-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Skapa Användare</h1>
          <input
            type="text"
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            onClick={handleRegister}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Skapa Användare
          </button>
        </div>
      </div>
    </div>
  );
}
