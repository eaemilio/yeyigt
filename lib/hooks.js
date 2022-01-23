import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export function useAuthSession() {
    const [session, setSession] = useState(supabase.auth.session());
    const [userMeta, setUserMeta] = useState(null);

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getUserMeta();
    }, [session]);

    const getUserMeta = async () => {
        if (session && session.user) {
            const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            setUserMeta(data);
        }
    };

    return { ...session, userMeta };
}
