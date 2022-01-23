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
        <div className="max-w-md w-full mx-auto">
            <div>
                <label htmlFor="email" className="block my-2 uppercase text-xs font-bold text-zinc-500 tracking-wide">
                    Email
                </label>
                <input
                    id="email"
                    type="text"
                    value={session.user.email}
                    disabled
                    className="w-full bg-gray-200 py-3 px-5 outline-none rounded-lg text-zinc-500 tracking-wide"
                />
            </div>
            <div>
                <label className="block my-2 uppercase text-xs font-bold text-zinc-500 tracking-wide">First Name</label>
                <input
                    value={firstName || ''}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-gray-200 py-3 px-5 outline-none rounded-lg text-zinc-500 tracking-wide"
                />
            </div>
            <div>
                <label className="block my-2 uppercase text-xs font-bold text-zinc-500 tracking-wide">Last Name</label>
                <input
                    value={lastName || ''}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-gray-200 py-3 px-5 outline-none rounded-lg text-zinc-500 tracking-wide"
                />
            </div>

            <div>
                <button
                    className="font-bold bg-red-200 rounded-lg text-red-400 px-30 py-3 w-full mt-20 hover:bg-red-100 ease-in-out duration-300 disabled:bg-gray-300 disabled:text-gray-400"
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
                    {loading ? 'Cargando...' : 'Guardar Cambios'}
                </button>
            </div>

            <div>
                <button
                    className="font-bold bg-red-500 rounded-lg text-red-800 px-30 py-3 w-full mt-4 hover:bg-red-400 ease-in-out duration-300 disabled:bg-gray-800 disabled:text-gray-900"
                    onClick={() => logOut()}
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}
