import React from "react";

function Settings() {
  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Settings</h2>
          <p>Configure application settings.</p>
          <div className="divider"></div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Enable Notifications</span>
            </label>
            <input type="checkbox" className="toggle toggle-primary" />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Dark Mode</span>
            </label>
            <input type="checkbox" className="toggle toggle-secondary" />
          </div>
          <div className="mt-4">
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
