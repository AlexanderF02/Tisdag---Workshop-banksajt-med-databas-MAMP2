import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
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
                <a className="hover:text-red-500">Skapa användare</a>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="hero mt-10">
          <h1 className="text-4xl font-bold text-center">Välkommen till DBS banken</h1>
          <p className="mt-4 text-center">Skapa ett konto och börja spara pengar!</p>
          <div className="mt-6">
            <Image src="/spara pengar.jpg" alt="Savings" width={400} height={300} />
          </div>
          <Link href="/register">
            <button className="mt-6 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-700">
              Skapa användare
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
