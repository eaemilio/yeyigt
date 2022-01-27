export default function Select(props) {
    return (
        <div className={`flex flex-col ${props.className}`}>
            <label className="ml-1 block text-xs font-bold text-zinc-500 tracking-wide" htmlFor="description">
                {props.label ?? ''}
            </label>
            <select
                className={`border-zinc-200 cursor-pointer form-select appearance-none block w-full px-4 py-2 text-xs font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat rounded-lg transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none ${props.className}`}
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
            >
                {props.children}
            </select>
        </div>
    );
}
