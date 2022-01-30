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
        if (session && session.user) {
            supabase
                .from('profiles')
                .select(
                    `
                id,
                avatar_url,
                first_name,
                last_name,
                roles (
                    id,
                    name
                )
            `,
                )
                .eq('id', session.user.id)
                .single()
                .then(({ data }) => {
                    setUserMeta(data);
                });
        }
    }, [session]);

    return { ...session, userMeta };
}
