import Navbar from "../../Components/Navbar.jsx";
import { useState, useEffect } from "react";
import axios from "axios";
import Alert from "../../Components/Alert.jsx";
import ModalAddWorkedtime from '../calendar/ModalAddWorkedtime.jsx'

export default function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calendar, setCalendar] = useState(Array(42).fill(0));
  const [selectedDay, setSelectedDay] = useState({
    start: null,
    end: null,
  });
  const [alertData, setAlertData] = useState({
    type: "",
    message: "",
  });
  const [workedtimes, setWorkedtimes] = useState([]);
  const [filteredWorkedtimes, setFilteredWorkedtimes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isShowAddWorkedtimeModal, setIsShowAddWorkedtimeModal] = useState(false)

  useEffect(() => {
    
    feactData();
  }, []);
  useEffect(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const startDay = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    const adjustedStartDay = (startDay + 6) % 7;

    const monthArray = generateMonthArray(adjustedStartDay, daysInMonth);
    setCalendar(monthArray);
  }, [selectedMonth, selectedYear]);
  useEffect(() => {
    if (!selectedDay.end) {
      const date = new Date(
        Date.UTC(selectedYear, selectedMonth - 1, selectedDay.start)
      );

      setFilteredWorkedtimes(
        workedtimes.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate.getTime() === date.getTime(); // Сравниваем по времени
        })
      );
    } else {
      const startDate = new Date(
        Date.UTC(selectedYear, selectedMonth - 1, selectedDay.start)
      );
      const endDate = new Date(
        Date.UTC(selectedYear, selectedMonth - 1, selectedDay.end)
      );

      setFilteredWorkedtimes(
        workedtimes.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= startDate && itemDate <= endDate;
        })
      );
    }
  }, [selectedYear, selectedMonth, selectedDay, workedtimes]);

  async function feactData () {
    try {
      const responseWorkedtimes = await axios.get(
        "http://localhost:5050/workedtime"
      );
      setWorkedtimes(responseWorkedtimes.data);
      const responseemployees = await axios.get(
        "http://localhost:5050/employee"
      );
      setEmployees(responseemployees.data);
    } catch (error) {
      setAlertData({
        type: "error",
        message: error.message,
      });
    }
  };
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
    if (marker == "+") {
      setSelectedYear(selectedYear + 1);
    } else if (marker == "-" && selectedYear != 2025) {
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

  return (
    <>
      <ModalAddWorkedtime
        isShowModal={isShowAddWorkedtimeModal}
        setIsShowModal={setIsShowAddWorkedtimeModal}
        employees={employees}
        selectedDay={selectedDay}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setAlertData={setAlertData}
        feactData={feactData}
      />
      <Alert alertData={alertData} setAlertData={setAlertData} />
      <Navbar />
      <main className="flex overflow-y-hidden">
        <section
          className={`min-w-150 rounded-xs border-gray-100 border bg-gray-100 p-1 flex flex-col transition max-h-162 pb-10 ${
            selectedDay.start ? "" : "hidden"
          }`}
        >
          <header className="flex items-center justify-between p-2.5 bg-white rounded-md shadow-sm mb-2">
            <p className="font-semibold leading-6 text-gray-900">
              {new Date(2023, selectedMonth - 1).toLocaleString("ru-RU", {
                month: "long",
              })}{" "}
              {selectedDay.start && !selectedDay.end
                ? selectedDay.start
                : selectedDay.start + " - " + selectedDay.end}
            </p>
            <form className="w-100 mx-auto">
              <div>
                <div class="relative">
                  <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <i class="bx bx-search"></i>
                  </div>
                  <input
                    type="text"
                    class="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500 focus:outline-none"
                    placeholder="Поиск сотрудника"
                  />
                </div>
              </div>
            </form>
            <button
              className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition duration-200"
              onClick={() => {
                setSelectedDay({ start: null, end: null });
              }}
            >
              <i class="bx bx-x text-[20px]"></i>
            </button>
          </header>
          <main className="flex gap-1 h-full ">
            <div className="bg-white p-2.5 shadow-sm flex flex-col gap-1 rounded-md">
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition duration-200"
              >
                <i class="bx bx-laptop text-white"></i>
              </button>
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition duration-200"
              >
                <i class="bx bx-home  text-white"></i>
              </button>
            </div>
            <div className="bg-white p-2.5 shadow-sm  flex-grow rounded-md overflow-y-scroll h-147">
              <header className="p-2.5 rounded-md border border-gray-200 shadow-sm mb-2.5 flex gap-2.5 flex justify-between">
                <div className="flex gap-2.5">
                  <button
                    id="filterDropdownButton"
                    data-dropdown-toggle="filterDropdown"
                    className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 transition duration-200"
                    type="button"
                  >
                    <i class="bx bx-filter-alt me-1"></i>
                    Отдел
                    <i class="bx bx-chevron-down text-[20px] ms-3"></i>
                  </button>
                  <button
                    id="filterDropdownButton"
                    data-dropdown-toggle="filterDropdown"
                    className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 transition duration-200"
                    type="button"
                  >
                    <i class="bx bx-filter-alt me-1"></i>
                    Должность
                    <i class="bx bx-chevron-down text-[20px] ms-3"></i>
                  </button>
                </div>
                <button
                  onClick={() => setIsShowAddWorkedtimeModal(true)}
                  type="button"
                  className="rounded-md bg-indigo-600 px-3 py-1 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition duration-200"
                >
                  <i class="bx bx-plus text-white"></i>
                </button>
              </header>
              <ul>
                {filteredWorkedtimes.map((item) => {
                  return (
                    <li
                      key={item._id}
                      className="p-2.5 rounded-md border border-gray-200 font-semibold shadow-sm mb-2.5"
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-gray-900">
                            {item.employee_id.lastName +
                              " " +
                              item.employee_id.firstName +
                              " " +
                              item.employee_id.surname}
                          </p>
                          <p>{new Date(item.date).toLocaleDateString()}</p>
                          <p>
                            {item.time}{" "}
                            {item.time == 1
                              ? "час"
                              : item.time > 1 && item.time < 5
                              ? "часа"
                              : "часов"}
                          </p>
                        </div>
                        <div>
                          <button className="p-1 text-gray-400 rounded md hover:shadow-sm hover:bg-gray-100 hover:text-black transition duration-200 flex items-center">
                            <i class="bx bx-dots-horizontal-rounded text-[20px]  "></i>
                          </button>
                        </div>
                      </div>
                      <hr className="h-px my-1 bg-gray-200 border-0" />
                      <div className="flex flex-col">
                        <p className="text-gray-500 text-[10px]">
                          Отдел: {item.employee_id.department_id.name}
                        </p>
                        <p className="text-gray-500 text-[10px]">
                          Должность: {item.employee_id.position_id.name}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </main>
        </section>
        <div className="lg:flex lg:h-full w-full lg:flex-col mt-1">
          <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              <time dateTime="2022-01">
                {new Date(2023, selectedMonth - 1).toLocaleString("ru-RU", {
                  month: "long",
                })}{" "}
                {selectedYear}
              </time>
            </h1>
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
                {calendar.map((item, index) => {
                  return (
                    <div
                      onClick={() => (item != 0 ? handleSelectDay(item) : "")}
                      key={index}
                      className={`relative  px-3 py-2 text-gray-500 min-h-22 ${
                        item == 0 ? "bg-gray-100" : "bg-gray-50"
                      }${
                        (selectedDay.start != null &&
                          item == selectedDay.start) ||
                        (selectedDay.start != null &&
                          selectedDay.end != null &&
                          item >= selectedDay.start &&
                          item <= selectedDay.end &&
                          item != 0)
                          ? "border-indigo-600 border"
                          : ""
                      }`}
                    >
                      <time
                        dateTime="2021-12-27"
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          new Date().getFullYear() == selectedYear &&
                          new Date().getMonth() + 1 == selectedMonth &&
                          new Date().getDate() === item
                            ? "bg-indigo-600 font-semibold text-white"
                            : ""
                        }`}
                      >
                        {item === 0 ? "" : item}
                      </time>
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
