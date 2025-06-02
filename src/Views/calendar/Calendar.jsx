import Navbar from "../../Components/Navbar.jsx";
import Alert from "../../Components/Alert.jsx";
import ControlCalendarBlock from "./ControlCalendarBlock.jsx";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calendarNumbers, setCalendarNumbers] = useState(Array(42).fill(0));
  const [selectedDay, setSelectedDay] = useState({
    start: null,
    end: null,
  });
  const [alertData, setAlertData] = useState({
    type: "",
    message: "",
  });
  const [workedtimes, setWorkedtimes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [noshows, setNoshows] = useState([]);
  const [causes, setCauses] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null); 
  const [filteredWorkedtimes, setFilteredWorkedtimes] = useState([]);
  const [filteredNoshows, setFilteredNoshows] = useState([]);

  useEffect(() => {
    feactData();
  }, []);
  useEffect(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const startDay = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    const adjustedStartDay = (startDay + 6) % 7;

    const monthArray = generateMonthArray(adjustedStartDay, daysInMonth);
    setCalendarNumbers(monthArray);
  }, [selectedMonth, selectedYear]);
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
            item.position_id.name.toLowerCase().includes(searchString.toLowerCase()) ||
            item.department_id.name.toLowerCase().includes(searchString.toLowerCase());
  
          const isNotSelected = selectedEmployee ? !selectedEmployee.includes(item._id) : true;
  
          return matchesSearch && isNotSelected;
        })
      );
    }
  }, [searchString, employees, selectedEmployee]);
  useEffect(() => {
    if (selectedEmployee) {

      const filteredNoshows = noshows.filter(
        (item) => item.employee_id._id === selectedEmployee
      );
      const filteredWorkedtimes = workedtimes.filter(
        (item) => item.employee_id._id === selectedEmployee
      );

      setFilteredNoshows(filteredNoshows);
      setFilteredWorkedtimes(filteredWorkedtimes);
    }
  }, [selectedEmployee,workedtimes, noshows]);

  async function fetchData() {
    // Ваш код для получения данных
  }
  async function feactData() {
    try {
      const responseWorkedtimes = await axios.get(
        "http://localhost:5050/workedtime"
      );
      setWorkedtimes(responseWorkedtimes.data);
      const responseemployees = await axios.get(
        "http://localhost:5050/employee"
      );
      setEmployees(responseemployees.data);

      const responsePositions = await axios.get(
        "http://localhost:5050/position"
      );
      setPositions(responsePositions.data);

      const responseDepartments = await axios.get(
        "http://localhost:5050/department"
      );
      setDepartments(responseDepartments.data);

      const responseNoshows = await axios.get("http://localhost:5050/noshow");
      setNoshows(responseNoshows.data);
      const responseCauses = await axios.get("http://localhost:5050/cause");
      setCauses(responseCauses.data);
    } catch (error) {
      setAlertData({
        type: "error",
        message: error.message,
      });
    }
  }
  function generateMonthArray(startDay, daysInMonth) {
    const totalDays = 42;
    const monthArray = Array(totalDays).fill(0);

    let startIndex = startDay;

    for (let day = 1; day <= daysInMonth; day++) {
      monthArray[startIndex] = day;
      startIndex++;
    }

    return monthArray;
  }
  function handleSelectMonth(marker) {
    if (marker == "+" && selectedMonth < 12) {
      setSelectedMonth(selectedMonth + 1);
    } else if (marker == "+" && selectedMonth == 12) {
      setSelectedMonth(1);
    } else if (marker == "-" && selectedMonth > 1) {
      setSelectedMonth(selectedMonth - 1);
    } else setSelectedMonth(12);
  }
  function handleSelectYear(marker) {
    if (marker == "+" && selectedYear != 2025) {
      setSelectedYear(selectedYear + 1);
    } else if (marker == "-") {
      setSelectedYear(selectedYear - 1);
    }
  }
  function handleSelectDay(day) {
    if (!selectedDay.start && !selectedDay.end) {
      setSelectedDay({
        ...selectedDay,
        start: day,
      });
    } else if (
      selectedDay.start &&
      !selectedDay.end &&
      selectedDay.start == day
    ) {
      setSelectedDay({
        start: null,
        end: null,
      });
    } else if (
      selectedDay.start &&
      !selectedDay.end &&
      day > selectedDay.start
    ) {
      setSelectedDay({
        ...selectedDay,
        end: day,
      });
    } else if (
      selectedDay.start &&
      !selectedDay.end &&
      day < selectedDay.start
    ) {
      setSelectedDay({
        end: selectedDay.start,
        start: day,
      });
    } else if (!selectedDay.start && selectedDay.end && day < selectedDay.end) {
      setSelectedDay({
        ...selectedDay,
        start: day,
      });
    } else if (!selectedDay.start && selectedDay.end && day > selectedDay.end) {
      setSelectedDay({
        start: selectedDay.end,
        end: day,
      });
    } else if (
      selectedDay.start &&
      selectedDay.end &&
      selectedDay.start != day &&
      selectedDay.end != day &&
      day > selectedDay.start &&
      day < selectedDay.end &&
      Math.abs(day - selectedDay.start) < Math.abs(day - selectedDay.end)
    ) {
      setSelectedDay({
        ...selectedDay,
        start: day,
      });
    } else if (
      selectedDay.start &&
      selectedDay.end &&
      selectedDay.start != day &&
      selectedDay.end != day &&
      day > selectedDay.start &&
      day < selectedDay.end &&
      Math.abs(day - selectedDay.start) > Math.abs(day - selectedDay.end)
    ) {
      setSelectedDay({
        ...selectedDay,
        end: day,
      });
    } else if (
      selectedDay.start &&
      selectedDay.end &&
      selectedDay.start != day &&
      selectedDay.end != day &&
      day > selectedDay.start &&
      day < selectedDay.end &&
      Math.abs(day - selectedDay.start) == Math.abs(day - selectedDay.end)
    ) {
      setSelectedDay({
        ...selectedDay,
        end: day,
      });
    } else if (day < selectedDay.start) {
      setSelectedDay({
        ...selectedDay,
        start: day,
      });
    } else if (day > selectedDay.end) {
      setSelectedDay({
        ...selectedDay,
        end: day,
      });
    } else if (day == selectedDay.start) {
      setSelectedDay({
        start: null,
        end: null,
      });
    }
  }
  function handleSelectEmployee(id) {
    setSearchString("");

    setSelectedEmployee(id);
  }
  function isWorkedtime(day) {
    if (selectedEmployee) {
      const filteredDays = filteredWorkedtimes.filter((item) => {
        const itemDate = new Date(item.date);
        const selectedDate = new Date(
          Date.UTC(selectedYear, selectedMonth - 1, day)
        );
        return itemDate.getTime() === selectedDate.getTime();
      });
      return filteredDays;
    }
    return []; 
  }

  function isNoshow(day) {
    if (selectedEmployee) {
      const filteredDays = filteredNoshows.filter((item) => {
        const itemDate = new Date(item.date);
        const selectedDate = new Date(
          Date.UTC(selectedYear, selectedMonth - 1, day)
        );
        return itemDate.getTime() === selectedDate.getTime();
      });
      return filteredDays;
    }
    return []; 
  }

  return (
    <>
      <Alert alertData={alertData} setAlertData={setAlertData} />
      <Navbar />
      <main className="flex overflow-y-hidden">
        <ControlCalendarBlock
          selectedDay={selectedDay}
          selectedMonth={selectedMonth}
          setSelectedDay={setSelectedDay}
          selectedYear={selectedYear}
          positions={positions}
          departments={departments}
          workedtimes={workedtimes}
          setAlertData={setAlertData}
          feactData={feactData}
          employees={employees}
          noshows={noshows}
          causes={causes}
        ></ControlCalendarBlock>
        <div className="lg:flex lg:h-full w-full lg:flex-col mt-1">
          <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
            <h1 className="text-base font-semibold leading-6 text-gray-900 me-4">
              <time dateTime="2022-01" className="whitespace-nowrap">
                {new Date(2023, selectedMonth - 1).toLocaleString("ru-RU", {
                  month: "long",
                })}{" "}
                {selectedYear}
              </time>
            </h1>
            {selectedEmployee ? (
              employees.map((item) =>
                selectedEmployee == item._id ? (
                  <div
                    key={item._id}
                    className="ps-2 pb-1 pt-1 flex-start rounded-md border border-gray-200 font-semibold shadow-sm  hover:bg-gray-100 transition duration-200 w-full"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-gray-900 text-[15px]">{`${item.lastName} ${item.firstName} ${item.surname}`}</p>
                      <button
                        onClick={() => setSelectedEmployee(null)}
                        className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition duration-200"
                      >
                        <i className="bx bx-x text-[20px]"></i>
                      </button>
                    </div>
                  </div>
                ) : null
              )
            ) : (
              <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <i className="bx bx-search"></i>
                </div>
                <input
                  onChange={(e) => setSearchString(e.target.value)}
                  value={searchString}
                  type="text"
                  className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500 focus:outline-none"
                  placeholder="Поиск сотрудника"
                />
                <div
                  className={`absolute w-120 z-100 rounded-md border border-gray-200 bg-white p-2.5 top-11 shadow-sm max-h-[250px] ${
                    filteredEmployees.length === 0
                      ? "hidden"
                      : "overflow-y-scroll"
                  }`}
                >
                  <ul>
                    {filteredEmployees.map((item) => (
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
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="flex items-center">
              <div className="ml-6 mr-6 h-6 w-px bg-gray-300"></div>
              <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
                <button
                  onClick={() => handleSelectMonth("-")}
                  type="button"
                  className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50 transition duration-200"
                >
                  <i class="bx bx-chevron-left text-[20px]"></i>
                </button>
                <p className="border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 flex items-center ">
                  {selectedMonth}
                </p>
                <button
                  onClick={() => handleSelectMonth("+")}
                  type="button"
                  className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50 transition duration-200"
                >
                  <i class="bx bx-chevron-right text-[20px]"></i>
                </button>
              </div>
              <div className="hidden md:ml-4 md:flex md:items-center">
                <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
                  <button
                    onClick={() => handleSelectYear("-")}
                    type="button"
                    className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50 transition duration-200"
                  >
                    <i class="bx bx-chevron-left text-[20px]"></i>
                  </button>
                  <p className=" border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900  flex items-center">
                    {selectedYear}
                  </p>
                  <button
                    onClick={() => handleSelectYear("+")}
                    type="button"
                    className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50 transition duration-200"
                  >
                    <i class="bx bx-chevron-right text-[20px]"></i>
                  </button>
                </div>
                <div className="ml-6 h-6 w-px bg-gray-300"></div>
              </div>
            </div>
          </header>
          <div className="shadow-lg ring-0.1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
            <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
              <div className="flex justify-center bg-white py-2">
                <span>Понедельник</span>
              </div>
              <div className="flex justify-center bg-white py-2">
                <span>Вторник</span>
              </div>
              <div className="flex justify-center bg-white py-2">
                <span>Среда</span>
              </div>
              <div className="flex justify-center bg-white py-2">
                <span>Четверг</span>
              </div>
              <div className="flex justify-center bg-white py-2">
                <span>Пятница</span>
              </div>
              <div className="flex justify-center bg-white py-2">
                <span>Суббота</span>
              </div>
              <div className="flex justify-center bg-white py-2">
                <span>Воскресенье</span>
              </div>
            </div>
            <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
              <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
                {calendarNumbers.map((item, index) => {
                  const currentDate = new Date(
                    selectedYear,
                    selectedMonth - 1,
                    item
                  );
                  const dayOfWeek = currentDate.getDay(); 

                  return (
                    <div
                      onClick={() =>
                        item !== 0 ? handleSelectDay(item) : null
                      }
                      key={index}
                      className={`relative px-3 py-2 text-gray-500 min-h-22 ${
                        item === 0 ? "bg-gray-100" : "bg-gray-50"
                      } ${
                        (selectedDay.start !== null &&
                          item === selectedDay.start) ||
                        (selectedDay.start !== null &&
                          selectedDay.end !== null &&
                          item >= selectedDay.start &&
                          item <= selectedDay.end &&
                          item !== 0)
                          ? "border-indigo-600 border bg-indigo-50"
                          : "border-transparent"
                      }`}
                    >
                      <time
                        dateTime="2021-12-27"
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          new Date().getFullYear() === selectedYear &&
                          new Date().getMonth() + 1 === selectedMonth &&
                          new Date().getDate() === item
                            ? "bg-indigo-600 font-semibold text-white"
                            : ""
                        }`}
                      >
                        {item === 0 ? "" : item}
                      </time>

                      {item !== 0 &&
                      selectedEmployee &&
                      (dayOfWeek === 0 || dayOfWeek === 6) ? (
                        <div className="absolute bottom-3 left-4 flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <p className="font-semibold">вых.</p>
                        </div>
                      ) : null}

                      {item !== 0 &&
                      selectedEmployee &&
                      isWorkedtime(item)?.length > 0 ? (
                        <div className="absolute bottom-3 left-4 flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <p className="font-semibold ">
                            {isWorkedtime(item)[0].time}{" "}
                            {isWorkedtime(item)[0].time === 1
                              ? "час"
                              : isWorkedtime(item)[0].time > 1 &&
                                isWorkedtime(item)[0].time < 5
                              ? "часа"
                              : "часов"}
                          </p>
                        </div>
                      ) : null}
                      {item !== 0 &&
                      selectedEmployee &&
                      isNoshow(item)?.length > 0 ? (
                        <div className="absolute bottom-3 left-4 flex items-center gap-1">
                          <div className="min-h-3 min-w-3 rounded-full bg-blue-500"></div>
                          <p className="font-semibold leading-tight">
                            {isNoshow(item)[0].cause_id.name}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
