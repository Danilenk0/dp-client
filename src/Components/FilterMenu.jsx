import { useState, useEffect, useRef } from "react";

export default function FilterDropdown({
  data,
  handleCheckboxChange,
  selectedDepartments,
  selectedPositions,
  children,
}) {
  const [isShowFilter, setIsShowFilter] = useState(false);
  const filterRef = useRef(null);

  const showFilter = () => {
    setIsShowFilter((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      setIsShowFilter(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center gap-2.5 w-full relative" ref={filterRef}>
      <button
        id="filterDropdownButton"
        className="w-full md:w-auto flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:border-gray-400 transition duration-200"
        type="button"
        onClick={showFilter}
      >
        <i className="bx bx-filter-alt"></i>
        {children}
        <i className="bx bx-chevron-down text-[20px]"></i>
      </button>
      {isShowFilter && (
        <div
          id="filterDropdown"
          className="absolute z-20 top-10 left-0 w-min h-70 p-3 bg-white rounded-lg shadow-md overflow-y-scroll"
        >
          <ul
            className="space-y-2 text-sm"
            aria-labelledby="filterDropdownButton"
          >
            {data.map((item) => (
              <li className="flex items-center" key={item._id}>
                <input
                  id={`department-${item._id}`}
                  type="checkbox"
                  checked={
                    (selectedDepartments &&
                      selectedDepartments.includes(item._id)) ||
                    (selectedPositions && selectedPositions.includes(item._id))
                  }
                  className="min-w-4 min-h-4 bg-gray-100 border-gray-300 rounded-sm text-primary-600 focus:ring-primary-500"
                  onChange={() =>
                    handleCheckboxChange(
                      item._id,
                      children === "Отдел" ? "Отдел" : "Должность"
                    )
                  }
                />
                <label
                  htmlFor={`department-${item._id}`}
                  className="ml-2 text-[12px] font-medium text-gray-900 wrap"
                >
                  {item.name}
                </label>
                <hr className="h-px my-2 bg-gray-200 border-0" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
