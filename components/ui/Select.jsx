export default function Select(props) {
    return (
        <div className="flex flex-col">
            <label className="ml-1 block uppercase text-xs font-bold text-zinc-500 tracking-wide" htmlFor="description">
                {props.label ?? ''}
            </label>
            <select
                className={`border-zinc-200 border cursor-pointer form-select appearance-none block w-full px-3 py-2 text-base font-normal text-gray-700 bg-zinc-50 bg-clip-padding bg-no-repeat rounded-lg transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none ${props.className}`}
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
            >
                {props.children}
            </select>
        </div>
    );
}
