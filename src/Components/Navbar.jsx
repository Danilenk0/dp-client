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
            to="/noshow"
            className={`text-sm font-semibold text-gray-900 pb-2 ${
              pathSegment == "noshow" ? "border-b-3 border-indigo-600" : ""
            }`}
          >
            Неявки
          </Link>
          <Link
            to="/workedtime"
            className={`text-sm font-semibold text-gray-900 pb-2 ${
              pathSegment == "workedtime" ? "border-b-3 border-indigo-600" : ""
            }`}
          >
            Рабочее время
          </Link>
        </div>
      </nav>
    );
}