import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DebtIcon from '../../components/dashboard/icons/DebtIcon';
import RingIcon from '../../components/dashboard/icons/RingIcon';
import SalesIcon from '../../components/dashboard/icons/Sales';
import RetailerChart from '../../components/RetailerChart';
import Loading from '../../components/ui/Loading';
import { findTotalSum, getDebt, numberWithCommas } from '../../utils/helpers';
import { supabase } from '../../utils/supabaseClient';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';
import { BAR_STYLE, options } from '../../utils/constants';
import Payment from '../../components/Payment';
import { useAuthSession } from '../../lib/hooks';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS.defaults.font.family = 'Outfit';
ChartJS.defaults.font.weight = 'bold';
ChartJS.defaults.defaultFontColor = '#333';

const labels = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGT', 'SEP', 'OCT', 'NOV', 'DIC'];

export default function Retailer({}) {
    const [isLoading, setIsLoading] = useState(false);
    const [retailer, setRetailer] = useState(null);
    const [sales, setSales] = useState([]);
    const [totalSalesNoPandora, setTotalSalesNoPandora] = useState(0.0);
    const [totalSalesPandora, setTotalSalesPandora] = useState(0.0);
    const [totalSales, setTotalSales] = useState(0.0);
    const [debt, setDebt] = useState(0);
    const [totalPayments, setTotalPayments] = useState(0);
    const { query } = useRouter();
    const id = +query.id;

    const { userMeta } = useAuthSession();

    // CHART
    const [chartData, setChartData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [chart, setChart] = useState({
        labels,
        datasets: [
            {
                data: [],
                ...BAR_STYLE,
            },
        ],
    });

    useEffect(() => {
        if (!id) {
            return;
        }
        getRetailerInfo(id);
        getRetailerSales(id);
        getTotalPayments(id);
    }, [id]);

    function getAllRetailerInfo(id) {
        getRetailerInfo(id);
        getRetailerSales(id);
        getTotalPayments(id);
    }

    useEffect(() => {
        if (!retailer) {
            return;
        }
        setTotalSales(totalSalesNoPandora + totalSalesPandora);
        setDebt(
            getDebt(retailer.due_amount, totalSalesNoPandora, false) +
                getDebt(retailer.due_amount_pandora, totalSalesPandora, true) -
                totalPayments,
        );
    }, [retailer, totalSalesNoPandora, totalSalesPandora, totalPayments]);

    useEffect(() => {
        const aux = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        sales
            .filter((d) => moment(d.created_at).isSame(new Date(), 'year'))
            .forEach((d) => {
                aux[moment(d.created_at).month()] = aux[moment(d.created_at).month()] + d.sale_price;
                setChartData(aux);
            });
    }, [sales]);

    useEffect(() => {
        setChart({
            labels,
            datasets: [
                {
                    data: chartData,
                    ...BAR_STYLE,
                },
            ],
        });
    }, [chartData]);

    async function getTotalPayments(id) {
        try {
            setIsLoading(true);
            const { data } = await supabase.from('payments').select('*').eq('retailer_id', id);
            setTotalPayments(findTotalSum(data.map((d) => d.amount)));
        } catch (error) {
            toast.error('Ocurrió un error al consultar la información del vendedor, recarga para intentarlo de nuevo');
        } finally {
            setIsLoading(false);
        }
    }

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
            const { data } = await supabase
                .from('sales')
                .select(
                    `
                    id,
                    sale_price,
                    created_at,
                    note,
                    client,
                    products (
                      description,
                      id,
                      price,
                      pandora
                    ),
                    retailer
            `,
                )
                .eq('retailer', id);
            setSales(data);
            setTotalSalesNoPandora(findTotalSum(data.filter((d) => !d.products.pandora).map((d) => d.sale_price)));
            setTotalSalesPandora(findTotalSum(data.filter((d) => d.products.pandora).map((d) => d.sale_price)));
        } catch (error) {
            console.log(error);
            toast.error('Ocurrió un error al consultar la información del vendedor, recarga para intentarlo de nuevo');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Loading isLoading={isLoading} />
            <span className="text-2xl font-bold text-zinc-700 mb-10 flex items-center">
                {userMeta?.roles?.id === 1 && (
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
                )}
                {retailer?.name}
            </span>
            <div className="flex gap-6 sm:gap-2 flex-col sm:flex-row">
                <div className="flex-1 py-12 flex rounded-lg flex-col justify-center items-center bg-white">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                        <SalesIcon className={`ease-in-out duration-300 w-5 h-5 fill-red-400`} />
                    </div>
                    <span className="text-4xl mt-4 text-zinc-800 font-bold">
                        Q. {numberWithCommas(totalSales.toFixed(2))}
                    </span>
                    <span className="uppercase mt-2 text-xs text-zinc-400 tracking-wider">Total de ventas</span>
                </div>
                <div className="flex-1 py-12 flex rounded-lg flex-col justify-center items-center bg-white relative">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                        <DebtIcon className={`ease-in-out duration-300 w-5 h-5 fill-red-400`} />
                    </div>
                    <span className="text-4xl mt-4 text-zinc-800 font-bold">
                        Q. {numberWithCommas(debt.toFixed(2))}
                    </span>
                    <span className="uppercase mt-2 text-xs text-zinc-400 tracking-wider">Total a Pagar</span>
                    {userMeta?.roles?.id === 1 && <Payment retailerId={id} onSave={() => getAllRetailerInfo(id)} />}
                </div>
                <div className="flex-1 py-12 flex rounded-lg flex-col justify-center items-center bg-white">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                        <RingIcon className={`ease-in-out duration-300 w-5 h-5 fill-red-400`} />
                    </div>
                    <span className="text-4xl mt-4 text-zinc-800 font-bold">{sales?.length}</span>
                    <span className="uppercase mt-2 text-xs text-zinc-400 tracking-wider">Piezas vendidas</span>
                </div>
            </div>
            <div className="flex flex-col w-lg h-80 px-10 py-6 bg-white mt-10 rounded-xl shadow-xl shadow-zinc-200/10 relative">
                <span className="text-xl font-bold text-zinc-700 mb-6">Resumen de Ventas</span>
                <div className="flex-1">{sales.length > 0 && <Bar options={options} data={chart} />}</div>
            </div>
        </>
    );
}
