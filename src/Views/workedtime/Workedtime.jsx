import Navbar from "../../Components/Navbar.jsx";
import { useState, useEffect } from "react";

export default function Workedtime() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calendar, setCalendar] = useState(Array(42).fill(0));
  const [selectedDay, setSelectedDay] = useState({
    start: null,
    end: null,
  });

  useEffect(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const startDay = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    const adjustedStartDay = (startDay + 6) % 7;

    const monthArray = generateMonthArray(adjustedStartDay, daysInMonth);
    setCalendar(monthArray);
  }, [selectedMonth, selectedYear]);

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
      } else if (
        !selectedDay.start &&
        selectedDay.end &&
        day < selectedDay.end
      ) {
        setSelectedDay({
          ...selectedDay,
          start: day,
        });
      } else if (
        !selectedDay.start &&
        selectedDay.end &&
        day > selectedDay.end
      ) {
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
            end:null
        });
      }
  }

  return (
    <>
      <Navbar />
      <main className="flex ">
        <section
          className={`min-w-120 rounded-xs border-gray-100 border bg-gray-100 p-1 flex flex-col ${
            selectedDay.start ? "" : "hidden"
          }`}
        >
          <header className="flex items-center justify-between p-2.5 bg-white rounded-md shadow-sm mb-2">
            <p className="font-semibold leading-6 text-gray-900">
              {new Date(2023, selectedMonth - 1).toLocaleString("ru-RU", {
                month: "long",
              })}{" "}
              {selectedDay.start && !selectedDay.end ? selectedDay.start : selectedDay.start + ' - '+ selectedDay.end}
            </p>
                      <button
                      onClick={()=>{setSelectedDay({start:null, end:null})}}>
              <svg
                className="w-6 h-6 text-gray-600 dark:text-white"
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
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
            </button>
          </header>
          <main className="flex gap-1 h-full">
            <div className="bg-white p-2.5 shadow-sm flex flex-col gap-1 h-full rounded-md">
              <button
                type="button"
                className=" rounded-md bg-indigo-600 px-3 py-2 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                <svg
                  className="w-5 h-5 text-white text-sm dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m20.9532 11.7634-2.0523-2.05225-2.0523 2.05225 2.0523 2.0523 2.0523-2.0523Zm-1.3681-2.73651-4.1046-4.10457L12.06 8.3428l4.1046 4.1046 3.4205-3.42051Zm-4.1047 2.73651-2.7363-2.73638-8.20919 8.20918 2.73639 2.7364 8.2091-8.2092Z"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m12.9306 3.74083 1.8658 1.86571-2.0523 2.05229-1.5548-1.55476c-.995-.99505-3.23389-.49753-3.91799.18657l2.73639-2.73639c.6841-.68409 1.9901-.74628 2.9229.18658Z"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                <svg
                  className="w-5 h-5 text-white text-sm dark:text-white"
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
                    d="M16.125 6H20v3.85927c0 1.33743-.6684 2.58633-1.7812 3.32823l-1.5791 1.0468M4.18754 17H16.8125M9.00004 7v7M12 7v7M4.94144 4.93762l-.875 13.99998C4.03046 19.5133 4.48767 20 5.06449 20H15.9356c.5768 0 1.034-.4867.998-1.0624l-.875-13.99998C16.0257 4.41059 15.5887 4 15.0606 4H5.93949c-.52806 0-.96511.41059-.99805.93762Z"
                  />
                </svg>
              </button>
            </div>
            <div className="bg-white p-2.5 shadow-sm h-full flex-grow rounded-md"></div>
          </main>
        </section>
        <div className="lg:flex lg:h-full w-full lg:flex-col mt-1">
          <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              <time datetime="2022-01">
                {new Date(2023, selectedMonth - 1).toLocaleString("ru-RU", {
                  month: "long",
                })}{" "}
                {selectedYear}
              </time>
            </h1>
            <div className="flex items-center">
              <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
                <button
                  onClick={() => handleSelectMonth("-")}
                  type="button"
                  className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
                >
                  {selectedMonth}
                </button>
                <button
                  onClick={() => handleSelectMonth("+")}
                  type="button"
                  className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="hidden md:ml-4 md:flex md:items-center">
                <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
                  <button
                    onClick={() => handleSelectYear("-")}
                    type="button"
                    className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
                  >
                    {selectedYear}
                  </button>
                  <button
                    onClick={() => handleSelectYear("+")}
                    type="button"
                    className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="ml-6 h-6 w-px bg-gray-300"></div>
                <button
                  type="button"
                  className="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Add event
                </button>
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
                      onClick={() => handleSelectDay(item)}
                      key={index}
                      className={`relative  px-3 py-2 text-gray-500 min-h-22 ${
                        item == 0 ? "bg-gray-100" : "bg-gray-50"
                      }${
                        (selectedDay.start !== null &&
                          item === selectedDay.start) ||
                        (selectedDay.start !== null &&
                          selectedDay.end !== null &&
                          item >= selectedDay.start &&
                          item <= selectedDay.end &&
                          item !== 0)
                          ? "border-indigo-600 border"
                          : ""
                      }`}
                    >
                      <time
                        datetime="2021-12-27"
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
