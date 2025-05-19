import { Link } from 'react-router'
import { useLocation } from 'react-router';

export default function Navbar() {
    const location = useLocation();
    const pathSegment = location.pathname.split("/")[1];
    return (
      <nav
        aria-label="Global"
        className="flex items-center justify-center p-6 lg:px-8 shadow-sm"
      >
        <div className="lg:flex lg:gap-x-12">
          <Link
            to="/employee"
            className={`text-sm font-semibold text-gray-900 pb-2 ${
              pathSegment == "employee" ? "border-b-3 border-indigo-600" : ""
            }`}
          >
            Сотрудники
          </Link>
          <Link
            to="/calendar"
            className={`text-sm font-semibold text-gray-900 pb-2 ${
              pathSegment == "calendar" ? "border-b-3 border-indigo-600" : ""
            }`}
          >
           Календарь
          </Link>
        </div>
      </nav>
    );
}