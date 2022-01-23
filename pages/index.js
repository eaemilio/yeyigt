import { useState, useEffect } from 'react';
import Auth from '../components/Auth';
import { supabase } from '../utils/supabaseClient';

export default function Home() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        setSession(supabase.auth.session());

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    return !session ? <Auth /> : <div></div>;
}
