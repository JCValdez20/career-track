interface LoadingScreenProps {
    message?: string;
}

export default function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
    return (
        <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4">
            {/* Spinner */}
            <div className="relative flex items-center justify-center">
                <div className="h-14 w-14 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            </div>

            {/* Message */}
            <p className="text-sm font-semibold tracking-widest uppercase text-foreground/40 animate-pulse text-center">
                {message}
            </p>
        </div>
    );
}