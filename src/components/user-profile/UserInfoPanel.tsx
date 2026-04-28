"use client";

export default function UserInfoPanel({ userName }: { userName: string }) {
    console.log("UserInfoPanel Rendered"); // 🔥 DEBUG

    return (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Full Name</p>
                    <p className="text-lg font-semibold text-gray-800">{userName || "Loading..."}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Email Address</p>
                    <p className="text-lg font-semibold text-gray-800">
                        {userName && userName !== "Guest User" && userName !== "Loading..."
                            ? `${userName.toLowerCase().replace(/\s/g, "")}@example.com`
                            : "loading..."}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Account Status</p>
                    <p className="text-lg font-semibold text-green-600">Active</p>
                </div>
            </div>
        </div>
    );
}
