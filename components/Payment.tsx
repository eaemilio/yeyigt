import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../utils/supabaseClient';

export default function Payment({ retailerId, onSave }) {
    const [showInput, setShowInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState('');

    function makePayment() {
        toast.promise(createPayment(), {
            loading: 'Registrando pago...',
            success: <b>Se ha guardado el pago</b>,
            error: <b>No se pudo guardar el pago, inténtalo de nuevo.</b>,
        });
    }

    async function createPayment() {
        try {
            setIsLoading(true);
            const values = {
                retailer_id: retailerId,
                amount,
            };
            const { error } = await supabase.from('payments').insert(values, { returning: 'representation' });
            setAmount('');
            setShowInput(false);
            onSave();
            if (error) {
                return Promise.reject();
            }
            return Promise.resolve();
        } catch (error) {
            return Promise.reject();
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="absolute -bottom-3 w-4/5">
            {!showInput ? (
                <button
                    onClick={() => setShowInput(true)}
                    className="bg-teal-400 w-full rounded-lg py-3 px-14 text-white uppercase text-xs shadow-lg shadow-teal-300/50 tracking-widest"
                >
                    Abonar
                </button>
            ) : (
                <div className="bg-zinc-200 rounded-lg shadow-lg shadow-zinc-200/50 flex gap-1 overflow-hidden">
                    <span className="bg-zinc-200 flex justify-center items-center font-bold pl-5 text-zinc-400">Q</span>
                    <input
                        type="number"
                        className="bg-zinc-200 py-2 px-3 my-1 ml-1 outline-none w-full rounded-lg text-zinc-500"
                        placeholder="750.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <button
                        className="py-2 px-2 my-1 w-fit h-fit bg-zinc-300 rounded-lg flex items-center justify-center hover:bg-zinc-400"
                        onClick={() => setShowInput(false)}
                        disabled={isLoading}
                    >
                        <svg className="w-6 h-6 fill-zinc-500" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <button
                        className="py-2 px-2 my-1 mr-1 w-fit h-fit bg-teal-400 hover:bg-teal-500 rounded-lg flex justify-center items-center disabled:bg-zinc-300"
                        disabled={isLoading}
                        onClick={makePayment}
                    >
                        <svg className="w-6 h-6 fill-teal-600" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
