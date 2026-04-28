
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/supabase";
import { FaTrash } from "react-icons/fa";
import { MdUpdate } from "react-icons/md";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Package {
	id?: number;
	name: string;
	price: string;
	features: string[];
	created_at?: string;
}

const SlideInText = ({
	text = "ADMIN PACKAGE VIEW",
}: {
	text?: string;
}) => {
	return (
		<h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-center">
			{text.split("").map((char, i) => (
				<motion.span
					key={i}
					initial={{ x: -30, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ delay: i * 0.02 }}
				>
					{char === " " ? "\u00A0" : char}
				</motion.span>
			))}
		</h2>
	);
};

export default function UsersPackagePage() {
	const [packageName, setPackageName] = useState("");
	const [price, setPrice] = useState("");
	const [featureInput, setFeatureInput] = useState("");
	const [features, setFeatures] = useState<string[]>([]);
	const [packages, setPackages] = useState<Package[]>([]);
	const [editingPackage, setEditingPackage] = useState<Package | null>(null);
	const router = useRouter();

	useEffect(() => {
		fetchPackages();
	}, []);

	const fetchPackages = async () => {
		const { data, error } = await supabase
			.from("package_set")
			.select("*")
			.order("created_at", { ascending: false });

		if (!error) {
			const safePackages = (data || []).map((pkg: any) => ({
				...pkg,
				features: Array.isArray(pkg.features)
					? pkg.features
					: typeof pkg.features === "string"
						? JSON.parse(pkg.features || "[]")
						: [],
			}));
			setPackages(safePackages);
		}
	};

	const addFeature = () => {
		if (featureInput.trim()) {
			setFeatures([...features, featureInput]);
			setFeatureInput("");
		}
	};

	const removeFeature = (index: number) => {
		setFeatures(features.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const { error } = await supabase.from("package_set").insert([
			{
				name: packageName,
				price,
				features,
			},
		]);

		if (error) return alert(error.message);

		setPackageName("");
		setPrice("");
		setFeatures([]);
		fetchPackages();
	};

	const handleDelete = async (id?: number) => {
		if (!confirm("Delete this package?")) return;

		const { error } = await supabase
			.from("package_set")
			.delete()
			.eq("id", id);

		if (!error) fetchPackages();
	};

	const handleUpdate = async () => {
		if (!editingPackage) return;

		const { error } = await supabase
			.from("package_set")
			.update({
				name: editingPackage.name,
				price: editingPackage.price,
				features: editingPackage.features,
			})
			.eq("id", editingPackage.id);

		if (!error) {
			setEditingPackage(null);
			fetchPackages();
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-purple-100 p-6">
			<SlideInText />
			<div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow mb-10">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid md:grid-cols-2 gap-4">
						<input
							placeholder="Package Name"
							value={packageName}
							onChange={(e) => setPackageName(e.target.value)}
							className="input"
							required
						/>
						<input
							type="number"
							placeholder="Price ₹"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							className="input"
							required
						/>
					</div>
					<div className="flex gap-2">
						<input
							placeholder="Add Feature"
							value={featureInput}
							onChange={(e) => setFeatureInput(e.target.value)}
							className="input w-full"
						/>
						<button type="button" onClick={addFeature} className="btn-add">
							Add
						</button>
					</div>
					<div className="flex flex-wrap gap-2">
						{features.map((f, i) => (
							<span key={i} className="chip flex items-center gap-2">
								{f}
								<button onClick={() => removeFeature(i)}>❌</button>
							</span>
						))}
					</div>
					<button className="btn-primary w-full">
						➕ Create Package
					</button>
				</form>
			</div>
			<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
				{packages.map((pkg) => (
					<div key={pkg.id} className="relative p-6 rounded-2xl bg-gray-900 text-white shadow-xl">
						<div className="absolute top-4 right-4 flex gap-3">
							<button
								onClick={() => setEditingPackage(pkg)}
								className="text-yellow-400 hover:scale-110"
							>
								<MdUpdate size={20} />
							</button>
							<button
								onClick={() => handleDelete(pkg.id)}
								className="text-red-500 hover:scale-110"
							>
								<FaTrash size={18} />
							</button>
						</div>
						<h2 className="text-xl font-bold">{pkg.name}</h2>
						<p className="text-3xl font-bold mb-4">₹{pkg.price}</p>
						<ul className="space-y-2 text-sm">
							{pkg.features?.map((f, i) => (
								<li key={i}>✔ {f}</li>
							))}
						</ul>
					</div>
				))}
			</div>
			{editingPackage && (
				<div className="fixed inset-0 bg-black/50 flex justify-center items-center">
					<div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
						<h2 className="text-xl font-bold">Edit Package</h2>
						<input
							value={editingPackage.name}
							onChange={(e) =>
								setEditingPackage({ ...editingPackage, name: e.target.value })
							}
							className="input w-full"
						/>
						<input
							value={editingPackage.price}
							onChange={(e) =>
								setEditingPackage({ ...editingPackage, price: e.target.value })
							}
							className="input w-full"
						/>
						<textarea
							value={editingPackage.features.join(",")}
							onChange={(e) =>
								setEditingPackage({
									...editingPackage,
									features: e.target.value.split(",").map(f => f.trim()),
								})
							}
							className="input w-full"
						/>
						<div className="flex justify-between">
							<button onClick={handleUpdate} className="btn-primary">
								Update
							</button>
							<button
								onClick={() => setEditingPackage(null)}
								className="bg-gray-300 px-4 py-2 rounded"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
			{/* STYLES */}
			<style jsx>{`
				.input {
					@apply px-4 py-2 rounded-xl border border-gray-300 outline-none;
				}
				.btn-primary {
					@apply px-4 py-2 bg-blue-500 text-white rounded-xl;
				}
				.btn-add {
					@apply px-4 bg-green-500 text-white rounded-xl;
				}
				.chip {
					@apply bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm;
				}
			`}</style>
		</div>
	);
}
