import React from "react";

function Profile() {
  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Profile</h2>
          <p>Welcome to profile page!</p>
          <div className="divider"></div>
          <div className="flex items-center space-x-4">
            <img
              className="w-16 h-16 rounded-full"
              src="https://img.daisyui.com/avatars/lee-neutral.png"
              alt="User avatar"
            />
            <div>
              <h3 className="text-lg font-semibold">Aekanat Kaewnuch</h3>
              <p className="text-sm text-gray-500">kaewnuch_a@silpakorn.edu</p>
            </div>
          </div>
          <div className="mt-4">
            <button className="btn btn-primary">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
