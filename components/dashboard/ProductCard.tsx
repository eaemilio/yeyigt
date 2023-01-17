import Image from 'next/image';

export default function ProductCard({ Icon, count, title, active, onClick }) {
  return (
    <button
      className={`ease-in-out duration-300 py-10 rounded-lg justify-center items-center flex flex-col ${
        active ? 'bg-red-400' : 'bg-white'
      }`}
      onClick={() => onClick()}
    >
      <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
        <Icon
          className={`ease-in-out duration-300 w-5 h-5 ${
            active ? 'fill-red-400' : 'fill-zinc-400'
          }`}
        />
      </div>
      <span
        className={`ease-in-out duration-300 text-3xl mt-2 ${
          active ? 'text-white' : 'text-zinc-700'
        } font-bold`}
      >
        {count}
      </span>
      <span
        className={`ease-in-out duration-300 text-sm ${active ? 'text-white' : 'text-zinc-400'}`}
      >
        {title}
      </span>
    </button>
  );
}
