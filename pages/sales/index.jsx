import Link from 'next/link';
import { useState } from 'react';
import SalesTable from '../../components/SalesTable';
import Loading from '../../components/ui/Loading';

export default function Sales() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <Loading isLoading={isLoading} />
      <span className="text-2xl font-bold text-zinc-700 mb-6 flex justify-between items-center">
        Ventas
        <Link href="/sales/new">
          <button className="bg-red-400 rounded-full text-white p-4" type="button">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </Link>
      </span>
      <SalesTable setIsLoading={setIsLoading} />
    </>
  );
}
