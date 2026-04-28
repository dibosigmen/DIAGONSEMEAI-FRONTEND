"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/supabase";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Package {
    id?: number;
    name: string;
    price: string;
    features: string[];
    created_at?: string;
}

// ✨ Animated Heading
const SlideInText = ({
    text = "Upgrade your health package",
}: {
    text?: string;
}) => {
    return (
        <h2 className="text-3xl md:text-5xl lg:text-5xl font-extrabold tracking-tight mb-4 text-[#202123] text-center">
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.03, ease: "easeOut" }}
                    className="inline-block"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </h2>
    );
};

export default function UserViewPackagesPage() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const { data, error } = await supabase
                .from("package_set")
                .select("*")
                .order("created_at", { ascending: true });

            if (error) throw error;

            const safePackages: Package[] = (data || []).map((pkg: any) => ({
                ...pkg,
                features: parseFeatures(pkg.features),
            }));

            setPackages(safePackages);
        } catch (err) {
            console.error("Error fetching packages:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Safe Feature Parser
    const parseFeatures = (features: any): string[] => {
        if (Array.isArray(features)) return features;

        if (typeof features === "string") {
            try {
                const parsed = JSON.parse(features);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }

        return [];
    };

    return (
        <div className="min-h-screen bg-[#F7F7F8] text-gray-900 font-sans p-8 lg:p-14 xl:p-20">
            <div className="max-w-[90rem] mx-auto">
                {/* HEADER */}
                <div className="text-center mb-20 flex flex-col items-center justify-center">
                    <SlideInText text="Upgrade your health package" />

                    <p className="text-xl text-[#353740] max-w-2xl mx-auto mt-2">
                        Choose the right package for your health
                    </p>
                </div>

                {/* LOADING */}
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10A37F]" />
                    </div>
                ) : packages.length === 0 ? (
                    <p className="text-center text-gray-500">No packages available</p>
                ) : (
                    /* GRID */
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 xl:gap-12 justify-items-center">
                        {packages.map((pkg, index) => {
                            const isPopular = packages.length > 1 && index === 1;

                            const isFree =
                                String(pkg.price) === "0" ||
                                String(pkg.price).toLowerCase() === "free" ||
                                !pkg.price;

                            return (
                                <div
                                    key={pkg.id || index}
                                    className={`relative flex flex-col p-10 rounded-2xl bg-white transition-all duration-300 w-full max-w-md ${isPopular
                                        ? "border-[#10A37F] shadow-2xl ring-1 ring-[#10A37F] scale-[1.05]"
                                        : "border border-gray-200 shadow-md hover:shadow-xl hover:scale-[1.03]"
                                        }`}
                                >
                                    {/* POPULAR */}
                                    {isPopular && (
                                        <span className="absolute top-0 right-6 -translate-y-1/2 bg-[#10A37F] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide shadow-md">
                                            Most Popular
                                        </span>
                                    )}

                                    {/* HEADER */}
                                    <div className="mb-10">
                                        <h2 className="text-3xl font-bold mb-3 text-[#202123]">
                                            {pkg.name}
                                        </h2>

                                        <p className="text-[#6E6E80] text-sm mb-6 min-h-[48px]">
                                            {index === 0
                                                ? "For individuals exploring advanced capabilities."
                                                : index === 1
                                                    ? "For professionals needing more power and speed."
                                                    : "For organizations requiring custom scale and security."}
                                        </p>

                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-extrabold text-[#202123]">
                                                {isFree ? "Free" : `₹${pkg.price}`}
                                            </span>
                                            {!isFree && (
                                                <span className="text-[#6E6E80] text-lg">/month</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* BUTTON */}
                                    <Link href={`/razor-pay?amount=${pkg.price}&packageName=${encodeURIComponent(pkg.name)}`}>
                                        <button
                                            className={`w-full py-4 px-6 rounded-lg font-semibold text-base transition-all mb-10 ${isPopular
                                                ? "bg-[#10A37F] hover:bg-[#0E906F] text-white"
                                                : "bg-white border border-gray-300 hover:bg-gray-50 text-[#202123]"
                                                }`}
                                        >
                                            {isPopular
                                                ? `Upgrade to ${pkg.name}`
                                                : isFree
                                                    ? "Your Current Plan"
                                                    : `Select ${pkg.name}`}
                                        </button>
                                    </Link>

                                    {/* FEATURES */}
                                    <div className="flex-1 space-y-5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-[#6E6E80]">
                                            Everything in {pkg.name} includes:
                                        </p>

                                        <ul className="space-y-4">
                                            {pkg.features.map((f, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-3 text-[#353740] text-sm"
                                                >
                                                    <svg
                                                        className={`w-5 h-5 mt-0.5 ${isPopular
                                                            ? "text-[#10A37F]"
                                                            : "text-gray-400"
                                                            }`}
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}