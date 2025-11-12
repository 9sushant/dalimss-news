import React from "react";

const ProfilePage = () => {
  return (
    <div className="max-w-3xl mx-auto py-20 text-center">
      <img
        src="https://i.imgur.com/6VBx3io.png"
        alt="User Avatar"
        className="h-24 w-24 mx-auto rounded-full"
      />

      <h1 className="mt-6 text-3xl font-bold text-white">Your Profile</h1>
      <p className="mt-2 text-slate-400">Welcome to your dashboard.</p>

      <div className="mt-6 space-x-4">
        <button className="px-5 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition">
          Edit Profile
        </button>

        <button className="px-5 py-2.5 rounded-full bg-red-600 text-white hover:bg-red-500 transition">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
