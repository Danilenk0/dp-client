import Navbar from "../../Components/Navbar.jsx";
import Loader from "../../Components/Loader.jsx";
import Alert from "../../Components/Alert.jsx";
import FilterMenu from "../../Components/FilterMenu.jsx";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";

function Employee() {
  const [data, setData] = useState([]);
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
  const [positions, setPositions] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  useEffect(() => {
    feachData();
  }, []);

  useEffect(() => {
    let filteredData = data;
    if (selectedDepartments.length > 0) {
      filteredData = filteredData.filter((item) =>
        selectedDepartments.includes(item.department_id._id)
      );
    }
    if (selectedPositions.length > 0) {
      filteredData = filteredData.filter((item) =>
        selectedPositions.includes(item.position_id._id)
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
  }, [page, data, searchString, selectedDepartments, selectedPositions]);

 async function feachData(){
    try {
      const responseEmployee = await axios.get(
        "http://localhost:5050/employee"
      );
      const responseDepartment = await axios.get(
        "http://localhost:5050/department"
      );
      const responsePositions = await axios.get(
        "http://localhost:5050/position"
      )
      setDepartments(responseDepartment.data);
      setPositions(responsePositions.data);

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
  function handleCheckboxChange(id, marker) {
    if (marker == "Отдел") {
      setSelectedDepartments((prevSelected) => {
        if (prevSelected.includes(id)) {
          return prevSelected.filter((deptId) => deptId !== id);
        } else {
          return [...prevSelected, id];
        }
      });
    } else if (marker == 'Должность') {
      setSelectedPositions((prevSelected) => {
        if (prevSelected.includes(id)) {
          return prevSelected.filter((posId) => posId !== id);
        } else {
          return [...prevSelected, id];
        }
      });
    }
   
  }
  function handleShowItemMenu(id) {
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
            <div className="mx-auto max-w-700 px-4 lg:px-12">
              <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                  <div className="w-full md:w-1/2">
                    <form className="flex items-center">
                      <label htmlFor="simple-search" className="sr-only">
                        Поиск..
                      </label>
                      <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <i className="bx bx-search-alt-2 text-gray-900 text-[20px]"></i>
                        </div>
                        <input
                          onInput={(event) =>
                            setSearchString(event.target.value)
                          }
                          type="text"
                          id="simple-search"
                          className="bg-gray-100 border border-gray-200 shadow-sm text-gray-900 text-sm rounded-md focus:ring-gray-500 focus:border-gray-500 outline-none block w-full pl-10 p-2 transition duration-200"
                          placeholder="Поиск"
                          required=""
                        />
                      </div>
                    </form>
                  </div>
                  <div className="w-full md:w-auto flex  flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <Link
                      to="/employee/add"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg py-2 px-4 text-sm focus:outline-none flex items-center gap-1 transition duration-200"
                    >
                      <i class="bx bx-plus text-[20px]"></i>
                      <p>Создать</p>
                    </Link>
                    <FilterMenu
                      data={departments}
                      handleCheckboxChange={handleCheckboxChange}
                    >
                      Отдел
                    </FilterMenu>
                    <FilterMenu
                      data={positions}
                      handleCheckboxChange={handleCheckboxChange}
                    >
                      Должность
                    </FilterMenu>
                  </div>
                </div>
                {data.length === 0 ? (
                  ""
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <div className="overflow-x-auto min-h-119">
                        <table className="w-full text-sm text-left text-gray-500">
                          <thead className="text-xs text-gray-800 uppercase bg-gray-100">
                            <tr>
                              <th scope="col" className="px-4 py-3">
                                Фамилия
                              </th>
                              <th scope="col" className="px-4 py-3">
                                Имя
                              </th>
                              <th scope="col" className="px-4 py-3">
                                Отчество
                              </th>
                              <th scope="col" className="px-4 py-3">
                                Адрес
                              </th>
                              <th scope="col" className="px-4 py-3">
                                Почта
                              </th>
                              <th scope="col" className="px-4 py-3">
                                Номер телефона
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
                                    className="px-4 py-2 font-medium text-gray-700 whitespace-nowrap"
                                  >
                                    {item.lastName}
                                  </th>
                                  <th className="px-4 py-2 font-medium text-gray-700 whitespace-nowrap">
                                    {item.firstName}
                                  </th>
                                  <th className="px-4py-2 font-medium text-gray-700 whitespace-nowrap">
                                    {item.surname}
                                  </th>
                                  <td className="px-4 py-2 text-gray-700 text-[10px]">
                                    {item.address}
                                  </td>
                                  <td className="px-4 py-2 text-gray-700 text-[10px]">
                                    {item.email}
                                  </td>
                                  <td className="px-4 py-2 text-gray-700 text-[10px]">
                                    {item.phone}
                                  </td>
                                  <td className="px-4 py-2 text-[10px]">
                                    {item.position_id.name}
                                  </td>
                                  <td className="px-4 py-2 text-[10px]">
                                    {item.department_id.name}
                                  </td>
                                  <td className="px-4 py-2 flex items-center justify-end">
                                    <button
                                      onClick={() =>
                                        handleShowItemMenu(item._id)
                                      }
                                      className="inline-flex items-center p-2.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none"
                                      type="button"
                                    >
                                      <i class="bx bx-dots-horizontal-rounded text-[20px]"></i>
                                    </button>
                                    <div
                                      className={`${
                                        itemMenyId == item._id ? "" : "hidden"
                                      } absolute end-15 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow`}
                                    >
                                      <ul className="py-1 text-sm text-gray-700">
                                        <li>
                                          <Link
                                            to={`/employee/edit/${item._id}`}
                                            className="block py-2 px-4 hover:bg-gray-100 flex items-center gap-2 transition duration-200"
                                          >
                                            <i class="bx bx-edit-alt"></i>
                                            <p> Редактировать</p>
                                          </Link>
                                        </li>
                                        <li>
                                          {" "}
                                          <a
                                            onClick={() =>
                                              handleDeleteData(item._id)
                                            }
                                            href="#"
                                            className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition duration-200"
                                          >
                                            <i class="bx bx-folder-minus"></i>
                                            <p>Удалить</p>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
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
                            <i className="bx bx-chevron-left text-[20px]"></i>
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
                            <i className="bx bx-chevron-right text-[20px]"></i>
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
