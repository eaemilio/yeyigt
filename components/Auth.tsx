import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

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
            className="font-bold bg-red-200 rounded-lg text-red-400 px-30 py-3 w-full mt-20 hover:bg-red-100 ease-in-out duration-300 disabled:bg-gray-300 disabled:text-gray-400"
            disabled={loading || email.trim() === ''}
          >
            <span>{loading ? 'Loading' : 'Send magic link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
