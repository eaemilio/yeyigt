import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import BraceletIcon from '../../components/dashboard/icons/Bracelet';
import DebtIcon from '../../components/dashboard/icons/DebtIcon';
import RingIcon from '../../components/dashboard/icons/RingIcon';
import SalesIcon from '../../components/dashboard/icons/Sales';
import Loading from '../../components/ui/Loading';
import { findTotalSum, numberWithCommas } from '../../utils/helpers';
import { supabase } from '../../utils/supabaseClient';

export default function Retailer({}) {
    const [isLoading, setIsLoading] = useState(false);
    const [retailer, setRetailer] = useState(null);
    const [sales, setSales] = useState([]);
    const [totalSales, setTotalSales] = useState(0.0);
    const { query } = useRouter();
    const id = +query.id;

    useEffect(() => {
        if (!id) {
            return;
        }
        getRetailerInfo(id);
        getRetailerSales(id);
    }, [id]);

    async function getRetailerInfo(id) {
        try {
            setIsLoading(true);
            const { data } = await supabase.from('retailers').select('*').eq('id', id).single();
            setRetailer(data);
        } catch (error) {
            toast.error('Ocurrió un error al consultar la información del vendedor, recarga para intentarlo de nuevo');
        } finally {
            setIsLoading(false);
        }
    }

    async function getRetailerSales(id) {
        try {
            setIsLoading(true);
            const { data } = await supabase.from('sales').select('*').eq('retailer', id);
            setSales(data);
            setTotalSales(findTotalSum(data.map((d) => d.sale_price)));
        } catch (error) {
            toast.error('Ocurrió un error al consultar la información del vendedor, recarga para intentarlo de nuevo');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Loading isLoading={isLoading} />
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
                {retailer?.name}
            </span>
            <div className="flex gap-2 flex-col sm:flex-row">
                <div className="flex-1 py-10 flex rounded-lg flex-col justify-center items-center bg-white">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                        <SalesIcon className={`ease-in-out duration-300 w-5 h-5 fill-red-400`} />
                    </div>
                    <span className="text-4xl mt-6 text-zinc-800 font-bold">
                        Q. {numberWithCommas(totalSales.toFixed(2))}
                    </span>
                    <span className="uppercase mt-2 text-xs text-zinc-400 tracking-wider">Total de ventas</span>
                </div>
                <div className="flex-1 py-10 flex rounded-lg flex-col justify-center items-center bg-white">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                        <DebtIcon className={`ease-in-out duration-300 w-5 h-5 fill-red-400`} />
                    </div>
                    <span className="text-4xl mt-6 text-zinc-800 font-bold">
                        Q. {numberWithCommas(totalSales.toFixed(2))}
                    </span>
                    <span className="uppercase mt-2 text-xs text-zinc-400 tracking-wider">Total a Pagar</span>
                </div>
                <div className="flex-1 py-10 flex rounded-lg flex-col justify-center items-center bg-white">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                        <RingIcon className={`ease-in-out duration-300 w-5 h-5 fill-red-400`} />
                    </div>
                    <span className="text-4xl mt-6 text-zinc-800 font-bold">{sales?.length}</span>
                    <span className="uppercase mt-2 text-xs text-zinc-400 tracking-wider">Piezas vendidas</span>
                </div>
            </div>
        </>
    );
}
