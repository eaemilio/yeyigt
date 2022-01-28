import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../utils/supabaseClient';

export default function NewRetailer() {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(false);
    const [dueDay, setDueDay] = useState('');
    const [dueAmount, setDueAmount] = useState('');

    async function createRetailer() {
        try {
            setIsLoading(true);
            const values = {
                name,
                due_date: dueDay,
                due_amount: dueAmount,
            };
            const { error } = await supabase.from('retailers').insert(values, { returning: 'minimal' });
            if (error) {
                return Promise.reject();
            }
            setDueDay('');
            setName('');
        } catch (error) {
            return Promise.reject();
        } finally {
            setIsLoading(false);
        }
    }

    function save() {
        toast.promise(createRetailer(), {
            loading: 'Guardando...',
            success: <b>La vendedora se ha guardado</b>,
            error: <b>Ocurrió un error, vuelve a intentarlo</b>,
        });
    }

    function isFormValid() {
        return true;
    }

    return (
        <div className="max-w-screen-sm mx-auto">
            <span className="text-2xl font-bold text-zinc-700 mb-10 flex items-center">
                <Link href="./">
                    <a className="bg-red-400 rounded-full text-white p-4 mr-6">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                    </a>
                </Link>
                Nueva vendedora
            </span>
            <div className="flex w-full gap-3 mt-6 flex-wrap">
                <div className="flex-1 w-full sm:w-fit">
                    <label className="block mt-6 mb-2 uppercase text-xs font-bold text-zinc-500 tracking-wide">
                        Nombre
                    </label>
                    <input
                        className="w-full bg-gray-200 py-3 px-5 outline-none rounded-lg text-zinc-500 tracking-wide"
                        placeholder="Yeraldy Recinos"
                        value={name || ''}
                        onChange={(e) => setName(e.target.value)}
                        tabIndex={2}
                    />
                </div>
                <div className="flex-3 w-full sm:w-fit">
                    <label className="block mt-6 mb-2 uppercase text-xs font-bold text-zinc-500 tracking-wide">
                        Día de corte
                    </label>
                    <input
                        className="w-full bg-gray-200 py-3 px-5 outline-none rounded-lg text-zinc-500 tracking-wide"
                        placeholder="27"
                        value={dueDay || ''}
                        onChange={(e) => setDueDay(e.target.value)}
                        tabIndex={2}
                    />
                </div>
            </div>
            <div className="flex w-full gap-3 mt-6 flex-wrap">
                <div className="flex-3 w-full sm:w-fit">
                    <label className="block mt-6 mb-2 uppercase text-xs font-bold text-zinc-500 tracking-wide">
                        Precio del Gramo
                    </label>
                    <div className="w-full rounded-lg overflow-hidden flex">
                        <span className="bg-zinc-300 flex justify-center items-center font-bold px-5 text-zinc-500">
                            Q
                        </span>
                        <input
                            placeholder="40.00"
                            className="bg-gray-200 outline-none flex-1 py-3 px-5 text-zinc-500 tracking-wide"
                            value={dueAmount || ''}
                            onChange={(e) => setDueAmount(e.target.value)}
                            tabIndex={3}
                        />
                    </div>
                </div>
            </div>
            <button
                className="font-bold bg-red-200 rounded-lg text-red-400 px-30 py-3 w-full mt-20 hover:bg-red-100 ease-in-out duration-300 disabled:bg-gray-300 disabled:text-gray-400"
                onClick={() => save()}
                disabled={isLoading || !isFormValid()}
            >
                Guardar
            </button>
        </div>
    );
}
