import Navbar from "../../Components/Navbar.jsx";
import Alert from "../../Components/Alert.jsx";
import ModalAddWorkedtime from "../calendar/ModalAddWorkedtime.jsx";
import ControlCalendarBlock from "../../Components/ControlCalendarBlock.jsx";
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
  const [filteredWorkedtimes, setFilteredWorkedtimes] = useState([]);
  const [outputWorkedtimes, setOutputWorkedtimes] = useState({});
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [isShowAddWorkedtimeModal, setIsShowAddWorkedtimeModal] =
    useState(false);
  const [isShowEditWorkedtimeModa, setIsShowEditWorkedtimeModal] = useState(false)
  const [searchWorkedtimeString, setSearchWorkedtimeString] = useState("");
  const [itemMenuId, setItemMenuId] = useState();
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
    let filteredData = [...workedtimes];

    if (selectedDay.start) {
      const startDate = new Date(
        Date.UTC(selectedYear, selectedMonth - 1, selectedDay.start)
      );
      const endDate = selectedDay.end
        ? new Date(Date.UTC(selectedYear, selectedMonth - 1, selectedDay.end))
        : startDate;

      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    if (searchWorkedtimeString) {
      filteredData = filteredData.filter(
        (item) =>
          item.employee_id.firstName
            .toLowerCase()
            .includes(searchWorkedtimeString.toLowerCase()) ||
          item.employee_id.lastName
            .toLowerCase()
            .includes(searchWorkedtimeString.toLowerCase()) ||
          item.employee_id.surname
            .toLowerCase()
            .includes(searchWorkedtimeString.toLowerCase()) ||
          item.employee_id.position_id.name
            .toLowerCase()
            .includes(searchWorkedtimeString.toLowerCase()) ||
          item.employee_id.department_id.name
            .toLowerCase()
            .includes(searchWorkedtimeString.toLowerCase())
      );
    }

    if (selectedDepartments.length > 0) {
      filteredData = filteredData.filter(({ employee_id }) =>
        selectedDepartments.includes(employee_id.department_id._id)
      );
    }

    if (selectedPositions.length > 0) {
      filteredData = filteredData.filter(({ employee_id }) =>
        selectedPositions.includes(employee_id.position_id._id)
      );
    }

    setFilteredWorkedtimes(filteredData);
  }, [
    selectedYear,
    selectedMonth,
    selectedDay.start,
    selectedDay.end,
    searchWorkedtimeString,
    selectedDepartments,
    selectedPositions,
    workedtimes,
  ]);
  useEffect(() => {
    const newWorkedtimeOutputData = {};
    if (!selectedDay.end) {
      setOutputWorkedtimes({
        [selectedYear + "-" + selectedMonth + "-" + selectedDay.start]:
          filteredWorkedtimes,
      });
    } else {
      for (let i = selectedDay.start; i <= selectedDay.end; i++) {
        newWorkedtimeOutputData[selectedYear + "-" + selectedMonth + "-" + i] =
          filteredWorkedtimes.filter((item) =>
            isSameDate(
              new Date(item.date),
              new Date(Date.UTC(selectedYear, selectedMonth - 1, i))
            )
          );
      }
      setOutputWorkedtimes(newWorkedtimeOutputData);
    }
  }, [filteredWorkedtimes]);

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
  function isSameDate(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  function clearAllFilter() {
    setSelectedDepartments([]);
    setSelectedPositions([]);
    setSearchWorkedtimeString("");
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

  function handleFilterCheckboxChange(id, marker) {
    if (marker == "Отдел") {
      setSelectedDepartments((prevSelected) => {
        if (prevSelected.includes(id)) {
          return prevSelected.filter((deptId) => deptId !== id);
        } else {
          return [...prevSelected, id];
        }
      });
    } else if (marker == "Должность") {
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
    setItemMenuId(itemMenuId == id ? null : id);
  }
  async function handleDeleteWorkedtimeData(id) {
    try {
      await axios.delete(
        `http://localhost:5050/workedtime/${id}`
      );
      setAlertData({
        type: "success",
        message: "Рабочее время успешно удалено",
      });
      feactData();
    } catch (error) {
      setAlertData({
        type: "error",
        message: error.message,
      });
    }
  }

  function handleShowEditWorkedtieModal() {}

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
        <ControlCalendarBlock
          selectedDay={selectedDay}
          selectedMonth={selectedMonth}
          setSelectedDay={setSelectedDay}
          positions={positions}
          departments={departments}
          handleFilterCheckboxChange={handleFilterCheckboxChange}
          outputWorkedtimes={outputWorkedtimes}
          setIsShowAddWorkedtimeModal={setIsShowAddWorkedtimeModal}
          handleDeleteWorkedtimeData={handleDeleteWorkedtimeData}
          handleShowEditWorkedtieModal={handleShowEditWorkedtieModal}
          searchWorkedtimeString={searchWorkedtimeString}
          setSearchWorkedtimeString={setSearchWorkedtimeString}
          clearAllFilter={clearAllFilter}
          selectedDepartments={selectedDepartments}
          selectedPositions={selectedPositions}
          handleShowItemMenu={handleShowItemMenu}
          itemMenuId={itemMenuId}
          setItemMenuId={setItemMenuId}
        ></ControlCalendarBlock>
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
                {calendarNumbers.map((item, index) => {
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
