import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function NewProduct() {
    const [productTypes, setProductTypes] = useState([]);
    const [description, setDescription] = useState('');
    const [type, setType] = useState(0);
    const [price, setPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [created, setCreated] = useState({});

    useEffect(() => {
        getProductTypes();
    }, []);

    async function getProductTypes() {
        const { data: productTypes, error } = await supabase.from('product_types').select('*');
        setProductTypes(productTypes);
    }

    function save() {
        toast.promise(createProduct(), {
            loading: 'Guardando...',
            success: <b>El producto se ha guardado</b>,
            error: <b>Ocurrió un error, vuelve a intentarlo</b>,
        });
    }

    function isFormValid() {
        return description.trim() !== '' && !isNaN(price) && type > 0;
    }

    async function createProduct() {
        try {
            setIsLoading(true);
            const values = {
                type,
                description,
                price,
            };
            const { data, error } = await supabase.from('products').insert(values, { returning: 'representation' });
            toast.success(`Código de producto: ${data[0].id}`, { duration: 7000 });
            setCreated(data[0]);
            setDescription('');
            setType('');
            setPrice('');
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
                Nuevo Producto
            </span>
            <div className="flex flex-col mt-8">
                <div className="flex w-full gap-3">
                    <div className="flex-1">
                        <label
                            className="block my-2 uppercase text-xs font-bold text-zinc-500 tracking-wide"
                            htmlFor="description"
                        >
                            Descripción
                        </label>
                        <input
                            placeholder="Identifica el accesorio"
                            name="description"
                            className="w-full bg-zinc-200 py-3 px-5 outline-none rounded-lg text-zinc-500 tracking-wide"
                            value={description || ''}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex w-full gap-3 mt-6 flex-wrap-reverse">
                    <div className="flex-3 w-full sm:w-fit">
                        <label
                            className="block my-2 uppercase text-xs font-bold text-zinc-500 tracking-wide"
                            htmlFor="price"
                        >
                            Precio
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
                            />
                        </div>
                    </div>
                    <div className="flex-1 min-w-1/2">
                        <label
                            className="block my-2 uppercase text-xs font-bold text-zinc-500 tracking-wide flex-1"
                            htmlFor="description"
                        >
                            Tipo
                        </label>
                        <select
                            className="form-select appearance-none block w-full px-5 py-3 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat rounded-lg transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none flex-1"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="0">Selecciona un tipo</option>
                            {productTypes.map((product) => (
                                <option value={product.id} key={product.id}>
                                    {product.type}
                                </option>
                            ))}
                        </select>
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
        </div>
    );
}
