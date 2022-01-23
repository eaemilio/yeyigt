import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Account({ session }) {
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [roleId, setRoleId] = useState('');
    const [avatar_url, setAvatarUrl] = useState('');
    const router = useRouter();

    useEffect(() => {
        getProfile();
    }, [session]);

    async function getProfile() {
        try {
            setLoading(true);
            const user = supabase.auth.user();

            let { data, error, status } = await supabase
                .from('profiles')
                .select(`first_name, last_name, avatar_url, role_id`)
                .eq('id', user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setAvatarUrl(data.avatar_url);
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setRoleId(data.role_id);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile({ first_name, last_name, role_id, avatar_url }) {
        try {
            setLoading(true);
            const user = supabase.auth.user();

            const updates = {
                id: user.id,
                first_name,
                last_name,
                role_id,
                avatar_url,
                updated_at: new Date(),
            };

            let { error } = await supabase.from('profiles').upsert(updates, {
                returning: 'minimal', // Don't return the value after inserting
            });

            if (error) {
                throw error;
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    function logOut() {
        supabase.auth.signOut();
        router.push('/');
    }

    return (
        <div className="form-widget">
            <h1 className="text-3xl font-bold underline">Hello world!</h1>
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={session.user.email} disabled />
            </div>
            <div>
                <label>First Name</label>
                <input value={firstName || ''} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
                <label>Last Name</label>
                <input value={lastName || ''} onChange={(e) => setLastName(e.target.value)} />
            </div>

            <div>
                <button
                    className="button block primary"
                    onClick={() =>
                        updateProfile({
                            avatar_url,
                            first_name: firstName,
                            last_name: lastName,
                            role_id: roleId,
                        })
                    }
                    disabled={loading}
                >
                    {loading ? 'Loading ...' : 'Update'}
                </button>
            </div>

            <div>
                <button className="button block" onClick={() => logOut()}>
                    Sign Out
                </button>
            </div>
        </div>
    );
}
