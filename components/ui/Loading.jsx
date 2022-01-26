import Image from 'next/image';

export default function Loading({ isLoading, className }) {
    return (
        <div
            className={`absolute bg-white/80 flex justify-center items-center inset-0 ease-in-out duration-300 pointer-events-none ${
                isLoading ? 'opacity-1' : 'opacity-0'
            } ${className}`}
        >
            <Image src="/loading.svg" width={120} height={120} alt="loading-indicator" />
        </div>
    );
}
