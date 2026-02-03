
interface btnsProps {
    text: string;
    onClick: () => void;
}

export const SolidBtn = ({ text, onClick }: btnsProps) => {
    return (
        <button onClick={onClick} className="px-5 lg:px-6 cursor-pointer py-3 lg:py-3.5 bg-[#1E6FFF] hover:bg-blue-700 text-white rounded-lg transition-all ease-in-out duration-300 font-semibold text-sm">
            {text}
        </button>
    );
}

export const GrayBtn = ({ text, onClick }: btnsProps) => {
    return (
        <button onClick={onClick} className="px-5 lg:px-6 cursor-pointer py-3 lg:py-3.5 bg-gray-200 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg font-semibold text-sm hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all duration-300">
            {text}
        </button>
    )
}