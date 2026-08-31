export default function Grid({ isGuessed, guess }: { isGuessed: boolean; guess: string}) {
    return (
        <div className="grid grid-cols-5 gap-1">
            {new Array(5).fill(0).map((_, i) => (
                <div className= {isGuessed ? "h-15 w-15 border-3 border-neutral-700 bg-neutral-700 text-white flex justify-center items-center text-3xl font-bold uppercase" : "h-15 w-15 border-3 border-neutral-700 bg-neutral-950 text-white flex justify-center items-center text-3xl font-bold uppercase"}>
                    {guess[i]}
                </div>
            ))}
        </div>
    );
}