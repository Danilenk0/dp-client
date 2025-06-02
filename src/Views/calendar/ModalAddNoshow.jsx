import { useState, useEffect } from "react";
import axios from "axios";
import AlertValidation from "../../Components/AlertValidation.jsx";

export default function ModalAddWorkedtime({
  isShowModal,
  setIsShowModal,
  employees,
  selectedDay,
  selectedMonth,
  selectedYear,
  setAlertData,
  feactData,
  causes,
}) {
  const [searchString, setSearchString] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [noshowData, setNoshowData] = useState({
    type: "",
    cause_id: "",
  });
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (searchString.length === 0) {
      setFilteredEmployees([]);
    } else {
      setFilteredEmployees(
        employees.filter((item) => {
          const matchesSearch =
            item.firstName.toLowerCase().includes(searchString.toLowerCase()) ||
            item.lastName.toLowerCase().includes(searchString.toLowerCase()) ||
            item.surname.toLowerCase().includes(searchString.toLowerCase()) ||
            item.position_id.name
              .toLowerCase()
              .includes(searchString.toLowerCase()) ||
            item.department_id.name
              .toLowerCase()
              .includes(searchString.toLowerCase());

          const isNotSelected = !selectedEmployees.includes(item._id);

          return matchesSearch && isNotSelected;
        })
      );
    }
  }, [searchString, selectedEmployees, employees]);

  function handleSelectEmployee(id) {
    setSearchString("");
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((item) => item != id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  }
  function handleSelectChange(event) {
    setNoshowData({
      ...noshowData,
      cause_id: event.target.value,
    });
  }

  async function handleAddNoshow() {
    try {
      const data = {
        type: noshowData.type,
        cause_id: noshowData.cause_id,
        selectedDay,
        selectedMonth,
        selectedYear,
        selectedEmployees,
      };
      const response = await axios.post("http://localhost:5050/noshow", data);
      feactData();
      setAlertData({
        type: "success",
        message: response.data.message,
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setValidationErrors(error.response.data.errors);
      } else {
        setAlertData({
          type: "error",
          message: error.message,
        });
      }
    }
  }

  return (
    <>
      <AlertValidation
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
      />
      <div
        className={`fixed top-35 left-0 right-0  z-50 flex items-center justify-center ${
          isShowModal ? "" : "hidden"
        }`}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow-2xl p-2.5">
            <div className="flex items-center justify-between  md:p-5 border-b rounded-t border-gray-200">
              <div className=" font-semibold text-gray-900  flex gap-4">
                <p> Добавление неявки на </p>
                <p className="text-gray-500">
                  {!selectedDay.end
                    ? selectedDay.start
                    : selectedDay.start + "-" + selectedDay.end}{" "}
                  {new Date(2023, selectedMonth - 1).toLocaleString("ru-RU", {
                    month: "long",
                  })}{" "}
                  {selectedYear}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsShowModal(false);
                  setSelectedEmployees([]);
                  setNoshowData({});
                }}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition duration-200"
              >
                <i className="bx bx-x text-[20px]"></i>
              </button>
            </div>
            <main>
              <form action="" className="flex flex-col gap-2.5 py-2.5">
                <div className="flex gap-2.5">
                  <select
                    value={noshowData.cause_id}
                    onChange={(e) => handleSelectChange(e)}
                    className="bg-gray-50 border border-gray-300  text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-auto p-2.5 outline-gray-200"
                  >
                    {causes.map((cause) => (
                      <option value={cause._id}>{cause.name}</option>
                    ))}
                  </select>
                  <input
                    onChange={(e) =>
                      setNoshowData({
                        ...noshowData,
                        type: e.target.value,
                      })
                    }
                    value={noshowData.type}
                    type="text"
                    className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500 focus:outline-none"
                    placeholder="Тип неявки"
                  />
                </div>
                <div className="w-full">
                  <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <i class="bx bx-search"></i>
                    </div>
                    <input
                      onChange={(e) => setSearchString(e.target.value)}
                      value={searchString}
                      type="text"
                      class="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500 focus:outline-none"
                      placeholder="Поиск сотрудника"
                    />
                    <div
                      className={`absolute w-120 rounded-md border border-gray-200 bg-white p-2.5 top-11 shadow-sm max-h-[250px] ${
                        filteredEmployees.length == 0
                          ? "hidden"
                          : " overflow-y-scroll"
                      }`}
                    >
                      <ul>
                        {filteredEmployees.map((item) => {
                          return (
                            <li
                              key={item._id}
                              onClick={() => handleSelectEmployee(item._id)}
                              className="p-2.5 rounded-md border border-gray-200 font-semibold shadow-sm mb-2.5 hover:bg-gray-100 transition duration-200"
                            >
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-gray-900">
                                    {item.lastName +
                                      " " +
                                      item.firstName +
                                      " " +
                                      item.surname}
                                  </p>
                                </div>
                              </div>
                              <hr className="h-px my-1 bg-gray-200 border-0" />
                              <div className="flex flex-col">
                                <p className="text-gray-500 text-[10px]">
                                  Отдел: {item.department_id.name}
                                </p>
                                <p className="text-gray-500 text-[10px]">
                                  Должность: {item.position_id.name}
                                </p>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </form>
              <div
                className={`p-2.5 rounded-md border border-gray-200 shadow-sm max-h-[200px] overflow-y-scroll ${
                  selectedEmployees.length == 0 ? "hidden" : ""
                }`}
              >
                {employees.map(
                  (item) =>
                    selectedEmployees.includes(item._id) && (
                      <div
                        key={item._id}
                        className="p-2.5 rounded-md border border-gray-200 font-semibold shadow-sm mb-2.5 hover:bg-gray-100 transition duration-200"
                      >
                        <div className="flex justify-between">
                          <p className="text-gray-900">{`${item.lastName} ${item.firstName} ${item.surname}`}</p>
                          <button
                            onClick={() => handleSelectEmployee(item._id)}
                            className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition duration-200"
                          >
                            <i class="bx bx-x text-[20px]"></i>
                          </button>
                        </div>
                        <hr className="h-px my-1 bg-gray-200 border-0" />
                        <div className="flex flex-col">
                          <p className="text-gray-500 text-[10px]">
                            Отдел: {item.department_id.name}
                          </p>
                          <p className="text-gray-500 text-[10px]">
                            Должность: {item.position_id.name}
                          </p>
                        </div>
                      </div>
                    )
                )}
              </div>
            </main>

            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b ">
              <button
                onClick={() => {
                  handleAddNoshow();
                  setSelectedEmployees([]);
                  setNoshowData({});
                }}
                disabled={selectedEmployees.length == 0 ? true : false}
                type="button"
                className={`${
                  selectedEmployees.length == 0
                    ? "cursor-not-allowed bg-indigo-300"
                    : ""
                } text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-200`}
              >
                Сохранить
              </button>
              <button
                onClick={() => {
                  setIsShowModal(false);
                  setSelectedEmployees([]);
                  setNoshowData({});
                }}
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-indigo-600 focus:z-10 focus:ring-4 focus:ring-gray-100 transition duration-200"
              >
                отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
