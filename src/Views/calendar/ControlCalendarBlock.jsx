import AlertValidation from "../../Components/AlertValidation";
import FilterMenu from "../../Components/FilterMenu";
import ModalAddWorkedtime from "./ModalAddWorkedtime";
import ModalAddNoshow from './ModalAddNoshow'
import WorkedtimeOutputList from "../../Components/WorkedtimeOutputList";
import NoshowOutputList from "../../Components/NoshowOutputList";
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
  noshows,
  causes
}) {
  const [validationErrors, setValidationErrors] = useState([])
  const [itemMenuId, setItemMenuId] = useState();
  const [updateItemId, setUpdateItemId] = useState('')
  const [workedtimeUpdateData, setWorkedtimeUpdateData] = useState({
    _id:'',
    data: '',
    employee_id:'',
    time:''
  })
  const [noshowUpdateData, setNoshowUpdateData] = useState({
    date: "",
    type:"",
    employee_id: "",
    cause_id: "",
  });
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [outputWorkedtimes, setOutputWorkedtimes] = useState({});
  const [outputNoshows, setOutputNoshows] = useState({});
  const [searchWorkedtimeString, setSearchWorkedtimeString] = useState("");
  const [isShowAddWorkedtimeModal, setIsShowAddWorkedtimeModal] =
    useState(false);
  const [markerShowBlock, setmarkerShowBlock] = useState('workedtime')
  
  

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
  
  useEffect(() => {
    let filteredData = [...noshows];

    const newNoshowOutputData = {};

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
          item.cause_id.name
            .toLowerCase()
            .includes(searchWorkedtimeString.toLowerCase()) ||
          item.type
            .toLowerCase()
            .includes(searchWorkedtimeString.toLowerCase())
      );
    }

    if (selectedDepartments.length > 0) {
      filteredData = filteredData.filter(({ employee_id }) =>
        selectedDepartments.includes(employee_id.department_id)
      );
    }

    if (selectedPositions.length > 0) {
      filteredData = filteredData.filter(({ employee_id }) =>
        selectedPositions.includes(employee_id.position_id)
      );
    }
    if (!selectedDay.end) {
      setOutputNoshows({
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
        newNoshowOutputData[
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
      setOutputNoshows(newNoshowOutputData);
    }
  }, [
    selectedYear,
    selectedMonth,
    selectedDay.start,
    selectedDay.end,
    searchWorkedtimeString,
    selectedDepartments,
    selectedPositions,
    noshows,
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
  async function handleDeleteNoshowData(id) {
    try {
      await axios.delete(`http://localhost:5050/noshow/${id}`);
      setAlertData({
        type: "success",
        message: "Неявка успешно удалена",
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
  async function handleUpdateNoshowData() {
    try {
      const response = await axios.put(
        `http://localhost:5050/noshow/${updateItemId}`,
        noshowUpdateData
      );
      feactData();
      setAlertData({
        type: "success",
        message: response.data.message,
      });
      setNoshowUpdateData({
        _id: "",
        data: "",
       type: "",
        employee_id: "",
        cause_id:''
      });
      setUpdateItemId("");
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
      {markerShowBlock == "noshow" ? (
        <ModalAddNoshow
          isShowModal={isShowAddWorkedtimeModal}
          setIsShowModal={setIsShowAddWorkedtimeModal}
          employees={employees}
          selectedDay={selectedDay}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          setAlertData={setAlertData}
          feactData={feactData}
          causes={causes}
        />
      ) : (
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
      )}

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
            <div className="flex items-center justify-center  w-full shadow-sm rounded-sm mb-2 pb-1 font-semibold text-gray-900">
              {markerShowBlock == "noshow" ? "Неявки" : "Рабочее время"}
            </div>
            <header className="p-2.5 rounded-md border border-gray-200 shadow-sm mb-2.5 flex gap-2.5 flex justify-between relative">
              <div className="flex gap-2.5 items-center  relative">
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
                {searchWorkedtimeString ||
                Object.keys(selectedDepartments).length !== 0 ||
                Object.keys(selectedPositions).length !== 0 ? (
                  <button
                    className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-min h-8 ms-auto flex items-center justify-center gap-1 px-2.5 transition duration-200"
                    onClick={() => {
                      clearAllFilter();
                    }}
                  >
                    <p>Очистить</p>
                    <i className="bx bx-x text-[20px] mt-1 "></i>
                  </button>
                ) : (
                  ""
                )}
              </div>
              <button
                onClick={() =>
                  selectedMonth > new Date().getMonth() + 1
                    ? setAlertData({
                        type: "error",
                        message:
                          "Ошибка добавления данных. Невозможно добавить данные на будущее время",
                      })
                    : setIsShowAddWorkedtimeModal(true)
                }
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-1 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                 focus-visible:outline-indigo-500 transition duration-200"
              >
                <i class="bx bx-plus text-white"></i>
              </button>
            </header>
            {markerShowBlock === "workedtime" ? (
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
              />
            ) : (
              <NoshowOutputList
                outputNoshows={outputNoshows}
                setItemMenuId={setItemMenuId}
                handleDeleteNoshowData={handleDeleteNoshowData}
                itemMenuId={itemMenuId}
                updateItemId={updateItemId}
                setUpdateItemId={setUpdateItemId}
                setNoshowUpdateData={setNoshowUpdateData}
                noshowUpdateData={noshowUpdateData}
                handleUpdateNoshowData={handleUpdateNoshowData}
                causes={causes}
              />
            )}
          </div>
        </main>
      </section>
    </>
  );
}
