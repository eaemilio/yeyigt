import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Text } from '@nextui-org/react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn(
        { email },
        { redirectTo: process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL },
      );
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error) {
      alert((error as any).error_description || (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    const { error } = await supabase.auth.signIn(
      {
        provider: 'google',
      },
      { redirectTo: process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL },
    );
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="px-6 py-6">
        <p className="text-3xl font-bold text-zinc-800">Bienvinido a Yeyi</p>
        <p className="font-xs text-zinc-800 my-6">
          Ingresa tu correo y te enviaremos un link mágico para iniciar sesión.
        </p>
        <div>
          <input
            className="w-full bg-gray-200 py-3 px-5 outline-none rounded-lg text-zinc-500 tracking-wide"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleLogin(email);
            }}
            className="font-bold bg-red-200 rounded-lg text-red-400 px-30 py-3 w-full mt-6 hover:bg-red-100 ease-in-out duration-300 disabled:bg-gray-300 disabled:text-gray-400"
            disabled={loading || email.trim() === ''}
          >
            <span>{loading ? 'Loading' : 'Send magic link'}</span>
          </button>

          <Text className="w-full text-center py-10"> o también </Text>

          <button
            onClick={(e) => {
              e.preventDefault();
              googleLogin();
            }}
            className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
          >
            <svg
              className="mr-2 -ml-1 w-4 h-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Inicia Sesión con Google<div></div>
          </button>
        </div>
      </div>
    </div>
  );
}
