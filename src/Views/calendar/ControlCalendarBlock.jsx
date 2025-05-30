import AlertValidation from "../../Components/AlertValidation";
import FilterMenu from "../../Components/FilterMenu";
import ModalAddWorkedtime from "./ModalAddWorkedtime";
import WorkedtimeOutputList from "../../Components/WorkedtimeOutputList";
import { useState, useEffect } from "react";
import axios from 'axios'

export default function ControlCalendarBlok({
  selectedDay,
  selectedMonth,
  setSelectedDay,
  positions,
  departments,
  workedtimes,
  employees,
  selectedYear,
  setAlertData,
  feactData,
  noshows
}) {
  const [validationErrors, setValidationErrors] = useState([])
  const [itemMenuId, setItemMenuId] = useState();
  const [updateItemId, setUpdateItemId] = useState('')
  const [workedtimeUpdateData, setWorkedtimeUpdateData] = useState({
    id:'',
    data: '',
    employee_id:'',
    time:''
  })
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [outputWorkedtimes, setOutputWorkedtimes] = useState({});
  const [outputNoshows, setOutputNoshows] = useState({});
  const [searchWorkedtimeString, setSearchWorkedtimeString] = useState("");
  const [isShowAddWorkedtimeModal, setIsShowAddWorkedtimeModal] =
    useState(false);
  const [markerShowBlock, setmarkerShowBlock] = useState('noshow')
  
  

  useEffect(() => {
    let filteredData = [...workedtimes];
    
    const newWorkedtimeOutputData = {};

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
    if (!selectedDay.end) {
      setOutputWorkedtimes({
        [selectedDay.start +
        "-" +
        new Date(2023, selectedMonth - 1).toLocaleString("ru-RU", {
          month: "long",
        }) +
        "-" +
        selectedYear]: filteredData,
      });
    } else {
      for (let i = selectedDay.start; i <= selectedDay.end; i++) {
        newWorkedtimeOutputData[
          i +
            "-" +
            new Date(2023, selectedMonth - 1).toLocaleString("ru-RU", {
              month: "long",
            }) +
            "-" +
           selectedYear
        ] = filteredData.filter((item) =>
          isSameDate(
            new Date(item.date),
            new Date(Date.UTC(selectedYear, selectedMonth - 1, i))
          )
        );
      }
      setOutputWorkedtimes(newWorkedtimeOutputData);
    }
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
  async function handleDeleteWorkedtimeData(id) {
    try {
      await axios.delete(`http://localhost:5050/workedtime/${id}`);
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
  async function handleUpdateWorkedtimeData() {
    try {
      const response = await axios.put(
        `http://localhost:5050/workedtime/${workedtimeUpdateData._id}`,
        workedtimeUpdateData
      );
      feactData();
      setAlertData({
        type: "success",
        message: response.data.message,
      });
      setWorkedtimeUpdateData({
        id: "",
        data: "",
        employee_id: "",
        time: "",
      });
      setUpdateItemId('');
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
                  value={searchWorkedtimeString}
                  onChange={(event) =>
                    setSearchWorkedtimeString(event.target.value)
                  }
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
              clearAllFilter();
            }}
          >
            <i class="bx bx-x text-[20px]"></i>
          </button>
        </header>
        <main className="flex gap-1 h-full ">
          <div className="bg-white p-2.5 shadow-sm flex flex-col gap-1 rounded-md">
            <button
              onClick={() => {
                setmarkerShowBlock("workedtime");
              }}
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition duration-200"
            >
              <i class="bx bx-laptop text-white"></i>
            </button>
            <button
              onClick={() => {
                setmarkerShowBlock("noshow");
              }}
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition duration-200"
            >
              <i class="bx bx-home  text-white"></i>
            </button>
          </div>
          <div className="bg-white p-2.5 shadow-sm  flex-grow rounded-md overflow-y-scroll h-147">
            <header className="p-2.5 rounded-md border border-gray-200 shadow-sm mb-2.5 flex gap-2.5 flex justify-between relative">
              <div className="flex gap-2.5  relative">
                <FilterMenu
                  data={departments}
                  handleCheckboxChange={handleFilterCheckboxChange}
                  selectedDepartments={selectedDepartments}
                  selectedPositions={selectedPositions}
                >
                  Отдел
                </FilterMenu>
                <FilterMenu
                  data={positions}
                  handleCheckboxChange={handleFilterCheckboxChange}
                  selectedDepartments={selectedDepartments}
                  selectedPositions={selectedPositions}
                >
                  Должность
                </FilterMenu>
              </div>
              <button
                onClick={() => setIsShowAddWorkedtimeModal(true)}
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-1 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition duration-200"
              >
                <i class="bx bx-plus text-white"></i>
              </button>
            </header>
            {markerShowBlock == "workedtime" ? (
              <WorkedtimeOutputList
                outputWorkedtimes={outputWorkedtimes}
                setItemMenuId={setItemMenuId}
                handleDeleteWorkedtimeData={handleDeleteWorkedtimeData}
                itemMenuId={itemMenuId}
                updateItemId={updateItemId}
                setUpdateItemId={setUpdateItemId}
                setWorkedtimeUpdateData={setWorkedtimeUpdateData}
                workedtimeUpdateData={workedtimeUpdateData}
                handleUpdateWorkedtimeData={handleUpdateWorkedtimeData}
              ></WorkedtimeOutputList>
            ) : (
              "noshow"
            )}
          </div>
        </main>
      </section>
    </>
  );
}
