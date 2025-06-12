import { Link } from "react-router-dom";

function Navbar({ theme, onThemeChange, handleLogout }) {
  // toggleTheme logic remains unchanged

  return (
    <div className="navbar bg-base-200 accent-content">
      <div className="flex-1">
        <a
          className="text-xl font-cormorant font-semibold py-2 px-4 text-accent-content"
          style={{ fontFamily: "Newsreader", fontSize: "25px" }}
        >
          SILPAKORN UNIVERSITY
        </a>
      </div>

      <div className="flex-none gap-2">
        {/* THEME TOGGLE */}
        <div className="Theme-control text-accent-content">
          <label className="flex cursor-pointer gap-2">
            {/* Sun icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2 M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4 M1 12h2M21 12h2 M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>

            <input
              type="checkbox"
              className="toggle theme-controller text-accent-content"
              onChange={() => {
                const newTheme = theme === "medicalDeepBlue" ? "medicalDeepBlueDark" : "medicalDeepBlue";
                onThemeChange(newTheme);
              }}
              checked={theme === "medicalDeepBlueDark"}
            />

            {/* Moon icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </label>
        </div>

        {/* PROFILE DROPDOWN */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/profile" className="justify-between">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <a onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
