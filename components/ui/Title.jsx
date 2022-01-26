export default function TitleNav(props) {
    return (
        <span className="text-2xl font-bold text-zinc-700 mb-10 flex items-center">
            {props.showBack && (
                <button className="bg-red-400 rounded-full text-white p-4 mr-6" onClick={props.back}>
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
                </button>
            )}
            {props.title}
        </span>
    );
}
