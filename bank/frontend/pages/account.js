import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Account() {
  const [balance, setBalance] = useState(0);
  const [otp, setOtp] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedOtp = localStorage.getItem('otp') || '';
      setOtp(storedOtp);
    }
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch('http://localhost:3001/me/accounts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: otp }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Fetch Balance Response:', data); 
        if (data.accounts && data.accounts.length > 0) {
          setBalance(data.accounts[0].amount);
        } else {
          setError('Kunde inte hämta saldo.');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Ett fel inträffade vid hämtning av saldo.');
      }
    };

    if (otp) {
      fetchBalance();
    }
  }, [otp]);

  const handleDeposit = async () => {
    try {
      const response = await fetch('http://localhost:3001/me/accounts/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: otp, amount: parseFloat(amount) }),
      });

      if (!response.ok) {
        console.error('Response status:', response.status);
        console.error('Response message:', response.statusText);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Deposit Response:', data); 

      
      if (data.message === "Deposit successful") {
        setSuccess('Pengar insatta!');
        setError(''); 

        
        const balanceResponse = await fetch('http://localhost:3001/me/accounts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: otp }),
        });

        if (!balanceResponse.ok) {
          throw new Error('Failed to fetch balance after deposit');
        }

        const balanceData = await balanceResponse.json();
        if (balanceData.accounts && balanceData.accounts.length > 0) {
          setBalance(balanceData.accounts[0].amount);
        } else {
          setError('Kunde inte hämta saldo.');
        }

        
        setAmount('');
      } else {
        setError(data.message || 'Ett okänt fel inträffade.');
        setSuccess(''); 
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Det uppstod ett problem med insättningen.');
      setSuccess(''); 
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('otp');
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white-100">
      <nav className="w-full bg-white p-4 text-black flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-4">
          <Image src="/bank.jpg" alt="Logo" width={120} height={120} />
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logga ut
        </button>
      </nav>
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Ditt Konto</h1>
          <p className="text-lg mb-4">Saldo: {balance} SEK</p>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <input
            type="text"
            placeholder="Engångslösenord (OTP)"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Belopp att sätta in"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleDeposit}
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Sätt in pengar
          </button>
        </div>
      </div>
    </div>
  );
}




