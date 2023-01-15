import '../../styles/Select.module.css';

export default function Select(props) {
  return (
    <div className={`flex flex-col relative ${props.className}`}>
      <label
        className="ml-1 block text-xs font-bold text-red-800 tracking-wide"
        htmlFor="description"
      >
        {props.label ?? ''}
      </label>
      <div className="select-wrapper">
        <select
          className="appearance-none block p-2 w-min text-sm text-gray-900 bg-red-200 rounded-lg border border-red-300"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        >
          {props.children}
        </select>
      </div>
    </div>
  );
}
