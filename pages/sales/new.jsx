import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from '../../components/ui/Loading';
import TitleNav from '../../components/ui/Title';
import { useAuthSession } from '../../lib/hooks';
import { SOLD } from '../../utils/constants';
import { supabase } from '../../utils/supabaseClient';

export default function NewSale() {
    const [product, setProduct] = useState(null);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [price, setPrice] = useState(0);
    const [client, setClient] = useState('');
    const [retailer, setRetailer] = useState('');
    const [retailers, setRetailers] = useState([]);
    const [note, setNote] = useState('');
    const [productType, setProductType] = useState('');
    const router = useRouter();
    const { userMeta } = useAuthSession();

    useEffect(() => {
        getRetailers();
    }, []);

    useEffect(() => {
        if (product) {
            getProductType(product.type);
        }
    }, [product]);

    async function getProductType(type) {
        const { data: productType, error } = await supabase.from('product_types').select('*').eq('id', type).single();
        setProductType(productType.type);
    }

    async function getRetailers() {
        const { data, error } = await supabase.from('retailers').select('*');
        setRetailers(data);
    }

    function startSearch() {
        toast.promise(getProductById(search), {
            loading: 'Buscando el producto...',
            success: <b>Se encontró un producto.</b>,
            error: <b>No se encontró el producto, vuelve a intentarlo con otro código.</b>,
        });
    }

    async function getProductById(id) {
        try {
            setIsLoading(true);
            const { data: p, error } = await supabase.from('products').select('*').eq('id', id).single();
            if (error || !p) {
                return Promise.reject();
            }
            setSearch('');
            setPrice(p.price);
            setProduct(p);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject();
        } finally {
            setIsLoading(false);
        }
    }

    function startSaving() {
        toast.promise(saveSale(), {
            loading: 'Registrando la venta...',
            success: <b>Venta registrada.</b>,
            error: <b>Ocurrió un error al guardar la venta, inténtalo de nuevo.</b>,
        });
    }

    async function saveSale() {
        try {
            setIsLoading(true);

            const values = {
                sale_price: price,
                client,
                note,
                product_id: product.id,
                retailer,
            };
            const { error } = await supabase.from('sales').insert(values, { returning: 'minimal' });
            if (error) {
                return Promise.reject();
            }
            const { error: errorP } = await setProductStatus(product.id, SOLD);
            if (errorP) {
                return Promise.reject();
            }
            setPrice(0);
            setRetailer(0);
            setNote('');
            setClient('');
            setProduct(null);
        } catch (error) {
            return Promise.reject();
        } finally {
            setIsLoading(false);
        }
    }

    async function setProductStatus(id, status) {
        const { data, error } = await supabase.from('products').update({ status }).eq('id', id);
        return { error };
    }

    function goBack() {
        if (!product) {
            router.back();
        } else {
            setProduct(null);
        }
    }

    return (
        <div className="flex h-full w-full flex-col">
            <Loading isLoading={isLoading} />
            <TitleNav title="Nueva Venta" back={() => goBack()} showBack={userMeta?.roles?.id === 1 || !!product} />
            <div
                className={`flex-1 flex flex-col justify-center w-full items-center mx-auto ${
                    !product ? 'max-w-xs' : 'max-w-md'
                }`}
            >
                {!product ? (
                    <>
                        <p className="text-sm text-zinc-500 mb-6">Ingresa el código del producto que vendiste</p>
                        <input
                            className="text-center mb-20 w-full bg-gray-200 py-3 px-5 outline-none rounded-lg text-zinc-500 tracking-wide"
                            type="number"
                            placeholder="1479"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            tabIndex={0}
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                startSearch();
                            }}
                            className="relative flex justify-center items-center mb-40 font-bold bg-red-200 rounded-lg text-red-400 px-30 py-3 w-full hover:bg-red-100 ease-in-out duration-300 disabled:bg-gray-300 disabled:text-gray-400"
                            disabled={isLoading || search.trim() === ''}
                        >
                            <span>{isLoading ? 'Cargando...' : 'Siguiente'}</span>
                            <svg
                                className="w-5 h-5 ml-4 absolute right-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </>
                ) : (
                    <div className="mb-40 w-full">
                        <label className="uppercase text-xs block mb-1 font-bold text-zinc-400 tracking-wide">
                            {productType}
                        </label>
                        <label className="block mb-6 text-2xl font-bold text-zinc-800 tracking-wide">
                            {product.description}
                        </label>
                        <label className="block my-2 uppercase text-xs font-bold text-zinc-500 tracking-wide">
                            ¿A qué precio vendiste el accesorio?
                        </label>
                        <div className="w-full rounded-lg overflow-hidden flex">
                            <span className="bg-zinc-300 flex justify-center items-center font-bold px-5 text-zinc-500">
                                Q
                            </span>
                            <input
                                placeholder="175.00"
                                className="bg-gray-200 outline-none flex-1 py-3 px-5 text-zinc-500 tracking-wide"
                                value={price || ''}
                                onChange={(e) => setPrice(e.target.value)}
                                tabIndex={1}
                            />
                        </div>

                        <label className="block mt-6 mb-2 uppercase text-xs font-bold text-zinc-500 tracking-wide">
                            ¿A quién se lo vendiste?
                        </label>
                        <input
                            className="w-full bg-gray-200 py-3 px-5 outline-none rounded-lg text-zinc-500 tracking-wide"
                            placeholder="Yeraldy Recinos"
                            value={client || ''}
                            onChange={(e) => setClient(e.target.value)}
                            tabIndex={2}
                        />

                        <label className="block mt-6 mb-2 uppercase text-xs font-bold text-zinc-500 tracking-wide">
                            ¿Quién lo vendió?
                        </label>
                        <select
                            className="form-select appearance-none block w-full px-5 py-3 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat rounded-lg transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none flex-1"
                            value={retailer}
                            onChange={(e) => setRetailer(e.target.value)}
                        >
                            <option value="0">Selecciona una vendedora</option>
                            {retailers.map((r) => (
                                <option value={r.id} key={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>

                        <label className="block mt-6 mb-2 uppercase text-xs font-bold text-zinc-500 tracking-wide">
                            Observaciones:
                        </label>
                        <textarea
                            className="mb-20 h-24 w-full bg-gray-200 py-3 px-5 outline-none rounded-lg text-zinc-500 tracking-wide"
                            placeholder="Producto vendido con descuento..."
                            value={note || ''}
                            onChange={(e) => setNote(e.target.value)}
                            tabIndex={3}
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                startSaving();
                            }}
                            className="relative flex justify-center items-center mb-10 font-bold bg-red-200 rounded-lg text-red-400 px-30 py-3 w-full hover:bg-red-100 ease-in-out duration-300 disabled:bg-gray-300 disabled:text-gray-400"
                            disabled={isLoading || price === null || client.trim() === ''}
                        >
                            <span>{isLoading ? 'Cargando...' : 'Guardar'}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
