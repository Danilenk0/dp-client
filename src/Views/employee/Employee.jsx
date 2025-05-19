import Navbar from "../../Components/Navbar.jsx";
import Loader from "../../Components/Loader.jsx";
import Alert from "../../Components/Alert.jsx";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";

function Employee() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [outputData, setOutputData] = useState([]);
  const [alertData, setAlertData] = useState({
    type: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [itemMenyId, setItemMenyId] = useState(null);
  const [searchString, setSearchString] = useState();
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  useEffect(() => {
    const feachData = async () => {
      try {
        const responseEmployee = await axios.get(
          "http://localhost:5050/employee"
        );
        const responseDepartment = await axios.get(
          "http://localhost:5050/department"
        );
        setDepartments(responseDepartment.data);

        if (responseEmployee.data.length == 0) {
          setAlertData({
            type: "error",
            message: "Нет данных для отображения, добавьте данные!",
          });
        }
        setData(responseEmployee.data);
      } catch (error) {
        setAlertData({
          type: "error",
          message: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    feachData();
  }, []);

  useEffect(() => {
    let filteredData = data;

    if (selectedDepartments.length > 0) {
      filteredData = data.filter((item) =>
        selectedDepartments.includes(item.department_id._id)
      );
    }

    if (searchString) {
      filteredData = filteredData.filter(
        (item) =>
          item.firstName.toLowerCase().includes(searchString) ||
          item.lastName.toLowerCase().includes(searchString) ||
          item.surname.toLowerCase().includes(searchString) ||
          item.position_id.name.toLowerCase().includes(searchString) ||
          item.department_id.name.toLowerCase().includes(searchString)
      );
    }

    setOutputData(filteredData.slice(page * 10 - 10, page * 10));
  }, [page, data, searchString, selectedDepartments]);

  async function handleDeleteData(id) {
    try {
      const response = await axios.delete(
        `http://localhost:5050/employee/${id}`
      );

      setData((prevData) => prevData.filter((item) => item._id !== id));

      setAlertData({
        type: "success",
        message: response.data.message,
      });
    } catch (error) {
      setAlertData({
        type: "error",
        message: error.message,
      });
    }
  }

  function handleNextPage() {
    setPage(page + 1);
  }
  function handlePrevPage() {
    setPage(page - 1 || 1);
  }
  function handleCheckboxChange(id) {
    setSelectedDepartments((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((deptId) => deptId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
    console.log(selectedDepartments);
  }
  function showFilter() {
    setIsShowFilter(!isShowFilter);
  }
  function showItemMenu(id) {
    if (itemMenyId === id) {
      setItemMenyId(null);
    } else {
      setItemMenyId(id);
    }
  }

  return (
    <>
      <Alert alertData={alertData}></Alert>
      <Navbar></Navbar>
      <main>
        {isLoading ? (
          <Loader size="16" />
        ) : (
          <section className="bg-gray-50 p-3 sm:p-5">
            <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
              <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                  <div className="w-full md:w-1/2">
                    <form className="flex items-center">
                      <label htmlFor="simple-search" className="sr-only">
                        Поиск..
                      </label>
                      <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          onInput={(event) =>
                            setSearchString(event.target.value)
                          }
                          type="text"
                          id="simple-search"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2"
                          placeholder="Search"
                          required=""
                        />
                      </div>
                    </form>
                  </div>
                  <div className="w-full md:w-auto flex  flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <Link
                      to="/employee/add"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg py-2 px-4 text-sm focus:outline-none flex gap-1"
                    >
                      <svg
                        className="w-6 h-6 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 12h14m-7 7V5"
                        />
                      </svg>
                      <p>Создать</p>
                    </Link>
                    <div className="flex items-center space-x-3 w-full md:w-auto">
                      <button
                        id="filterDropdownButton"
                        data-dropdown-toggle="filterDropdown"
                        className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                        type="button"
                        onClick={showFilter}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          className="h-4 w-4 mr-2 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Фильтр
                        <svg
                          className="-mr-1 ml-1.5 w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            clipRule="evenodd"
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          />
                        </svg>
                      </button>
                      <div
                        id="filterDropdown"
                        className={`z-10 absolute top-16  end-2 w-70 p-3 bg-white rounded-lg shadow h-100 overflow-y-scroll ${
                          isShowFilter ? "" : "hidden"
                        }`}
                      >
                        <h6 className="mb-3  text-sm font-medium text-gray-900">
                          Выберите отдел
                        </h6>
                        <ul
                          className="space-y-2 text-sm"
                          aria-labelledby="filterDropdownButton"
                        >
                          {departments.map((item, index) => (
                            <>
                              <li className="flex items-center" key={item._id}>
                                <input
                                  id="apple"
                                  type="checkbox"
                                  value=""
                                  className="min-w-4 min-h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 "
                                  onChange={() =>
                                    handleCheckboxChange(item._id)
                                  }
                                />
                                <label
                                  htmlFor="apple"
                                  className="ml-2 text-sm font-medium text-gray-900 wrap"
                                >
                                  {item.name}
                                </label>
                              </li>
                              <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                            </>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                {data.length === 0 ? (
                  ""
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-800 uppercase bg-gray-100">
                          <tr>
                            <th scope="col" className="px-4 py-3">
                              Имя
                            </th>
                            <th scope="col" className="px-4 py-3">
                              Фамилия
                            </th>
                            <th scope="col" className="px-4 py-3">
                              Отчество
                            </th>
                            <th scope="col" className="px-4 py-3">
                              Должность
                            </th>
                            <th scope="col" className="px-4 py-3">
                              Отдел
                            </th>
                            <th scope="col" className="px-4 py-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {outputData.map((item, index) => {
                            return (
                              <tr key={item._id} className="border-b">
                                <th
                                  scope="row"
                                  className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap"
                                >
                                  {item.firstName}
                                </th>
                                <td className="px-4 py-3 text-gray-700">
                                  {item.lastName}
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                  {item.surname}
                                </td>
                                <td className="px-4 py-3">
                                  {item.position_id.name}
                                </td>
                                <td className="px-4 py-3">
                                  {item.department_id.name}
                                </td>
                                <td className="px-4 py-3 flex items-center justify-end">
                                  <button
                                    onClick={() => showItemMenu(item._id)}
                                    id={`dropdown-button-${index}`}
                                    className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none"
                                    type="button"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      aria-hidden="true"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                  </button>
                                  <div
                                    id={`dropdown-${index}`}
                                    className={`${
                                      itemMenyId == item._id ? "" : "hidden"
                                    } absolute end-15 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow`}
                                  >
                                    <ul
                                      className="py-1 text-sm text-gray-700"
                                      aria-labelledby={`dropdown-button-${index}`}
                                    >
                                      <li>
                                        <Link
                                          to={`/employee/edit/${item._id}`}
                                          className="block py-2 px-4 hover:bg-gray-100"
                                        >
                                          Редактировать
                                        </Link>
                                      </li>
                                    </ul>
                                    <div className="py-1">
                                      <a
                                        onClick={() =>
                                          handleDeleteData(item._id)
                                        }
                                        href="#"
                                        className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        Удалить
                                      </a>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <nav
                      className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                      aria-label="Table navigation"
                    >
                      <span className="text-sm font-normal text-gray-500 flex gap-1">
                        Показано
                        <span className="font-semibold text-gray-900">
                          {page == 1 ? 1 : page * 10 - 10} -{" "}
                          {outputData == 10
                            ? page * 10
                            : page * 10 - 10 + outputData.length}{" "}
                        </span>
                        из
                        <span className="font-semibold text-gray-900">
                          {data.length}
                        </span>
                      </span>
                      <ul className="inline-flex items-stretch -space-x-px">
                        <li>
                          <button
                            type="button"
                            onClick={handlePrevPage}
                            className={`flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300  ${
                              data.length > 10
                                ? "hover:bg-gray-100 hover:text-gray-700"
                                : "cursor-not-allowed opacity-50"
                            }`}
                          >
                            <span className="sr-only">Previous</span>
                            <svg
                              className="w-5 h-5"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={handleNextPage}
                            className={`flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 ${
                              data.length > 10
                                ? "hover:bg-gray-100 hover:text-gray-700"
                                : "cursor-not-allowed opacity-50"
                            } `}
                          >
                            <span className="sr-only">Next</span>
                            <svg
                              className="w-5 h-5"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      
    </>
  );
}

export default Employee;
