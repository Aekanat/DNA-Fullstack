import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { 
  EmailAuthProvider, 
  linkWithCredential, 
  updateProfile, 
  updatePassword 
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const CreateUsername = () => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const db = getFirestore();

  // signed in via Google.
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        // Check if the password provider is linked.
        if (user.providerData.some((p) => p.providerId === "password")) {
          // update the password.
          await updatePassword(user, newPassword);
        } else {
          // Link email/password to the Google account.
          const credential = EmailAuthProvider.credential(user.email, newPassword);
          await linkWithCredential(user, credential);
        }
        // Update the user's displayName with the chosen username.
        await updateProfile(user, { displayName: username });
        // Save the mapping (username and email) in Firestore.
        await setDoc(doc(db, "users", user.uid), { username, email: user.email });
        navigate("/");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">Create Username & Password</h2>
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Your Username"
                className="input input-bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="New Password"
                className="input input-bordered"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Finish Registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUsername;
