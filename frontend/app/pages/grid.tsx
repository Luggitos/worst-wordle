type GridProps = {
    guess: string;
    statuses?: LetterResult[];
};

export default function Grid({ guess, statuses = [] }: GridProps) {
    const getCellClassName = (index: number) => {
        const status = statuses[index]?.status;

        if (status === "CORRECT") {
            return "h-15 w-15 border-3 border-green-600 bg-green-600 text-white flex justify-center items-center text-3xl font-bold uppercase";
        }

        if (status === "PRESENT") {
            return "h-15 w-15 border-3 border-yellow-500 bg-yellow-500 text-white flex justify-center items-center text-3xl font-bold uppercase";
        }

        if (status === "ABSENT") {
            return "h-15 w-15 border-3 border-neutral-700 bg-neutral-700 text-white flex justify-center items-center text-3xl font-bold uppercase";
        }

        return "h-15 w-15 border-3 border-neutral-700 bg-neutral-950 text-white flex justify-center items-center text-3xl font-bold uppercase";
    };

    return (
        <div className="grid grid-cols-5 gap-1">
            {new Array(5).fill(0).map((_, index) => (
                <div className={getCellClassName(index)} key={index}>
                    {guess[index]}
                </div>
            ))}
        </div>
    );
}