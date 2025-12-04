import { Database, Flame } from "lucide-react";
import type { FC } from "react";

interface DatabaseSwitchProps {
    isFirestore: boolean;
    setIsFirestore: (value: boolean) => void;
}

const DatabaseSwitch: FC<DatabaseSwitchProps> = ({ isFirestore, setIsFirestore }) => {
    const toggleSwitch = () => {
        const newValue = !isFirestore;
        setIsFirestore(newValue);
        console.log("Seçilen DB:", newValue ? "Firestore" : "PostgreSQL");
    };

    return (
        <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer select-none w-52 h-9">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={isFirestore}
                    onChange={toggleSwitch}
                />

                <div
                    className={`absolute inset-0 rounded-full border transition-colors duration-500 ease-in-out shadow-inner overflow-hidden
                            ${
                                isFirestore
                                    ? "bg-orange-950/30 border-orange-500/30 shadow-[inset_0_0_10px_rgba(249,115,22,0.2)]"
                                    : "bg-blue-950/30 border-blue-500/30 shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]"
                            }
                        `}
                >
                    <div className="absolute inset-0 flex items-center justify-between px-4 font-bold font-mono text-[10px] z-0">
                        <span
                            className={`transition-opacity duration-300 ${
                                !isFirestore ? "opacity-0" : "opacity-50 text-blue-300"
                            }`}
                        >
                            POSTGRES
                        </span>
                        <span
                            className={`transition-opacity duration-300 ${
                                isFirestore ? "opacity-0" : "opacity-50 text-orange-300"
                            }`}
                        >
                            FIRESTORE
                        </span>
                    </div>
                </div>

                <div
                    className={`absolute top-0.5 left-0.5 w-[100px] h-8 rounded-full flex items-center justify-center gap-1.5
                        shadow-md transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) z-10 border border-opacity-50
                        ${
                            isFirestore
                                ? "translate-x-[104px] bg-gradient-to-r from-orange-600 to-red-600 border-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                                : "translate-x-0 bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                        }
                        `}
                >
                    {isFirestore ? (
                        <>
                            <Flame size={14} className="text-white animate-pulse" />
                            <span className="text-white font-bold tracking-wide text-[10px]">
                                FIRESTORE
                            </span>
                        </>
                    ) : (
                        <>
                            <Database size={14} className="text-white" />
                            <span className="text-white font-bold tracking-wide text-[10px]">
                                POSTGRES
                            </span>
                        </>
                    )}
                </div>
            </label>
        </div>
    );
};

export default DatabaseSwitch;



