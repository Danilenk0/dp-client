import FilterMenu from "./FilterMenu";
import {useEffect} from 'react'

export default function ControlCalendarBlok({
  selectedDay,
  selectedMonth,
  setSelectedDay,
  positions,
  departments,
  handleFilterCheckboxChange,
  outputWorkedtimes,
  setIsShowAddWorkedtimeModal,
  searchWorkedtimeString,
  setSearchWorkedtimeString,
  clearAllFilter,
  selectedDepartments,
  selectedPositions,
  handleDeleteWorkedtimeData,
  handleShowItemMenu,
  itemMenuId,
}) {
  return (
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
          <ul>
            {Object.entries(outputWorkedtimes).map(([key, value]) => (
              <div key={key}>
                {value.length === 0 ? null : (
                  <div className="flex items-center justify-center gap-2">
                    <hr className="h-[3px] bg-gray-200 border-0 dark:bg-gray-700 w-[40%] rounded-md" />
                    <p className="text-gray-300 font-semibold">{key}</p>
                    <hr className="h-[3px] bg-gray-200 border-0 dark:bg-gray-700 w-[40%] rounded-md" />
                  </div>
                )}
                {value.map((item, index) => (
                  <li
                    key={index}
                    className="p-2.5 rounded-md border border-gray-200 font-semibold shadow-sm mb-2.5"
                  >
                    <div className="flex justify-between">
                      <div className="flex justify-between gap-2">
                        <p className="text-gray-900">
                          {`${item.employee_id.lastName} ${item.employee_id.firstName} ${item.employee_id.surname}`}
                        </p>
                        <p>
                          {item.time}{" "}
                          {item.time === 1
                            ? "час"
                            : item.time > 1 && item.time < 5
                            ? "часа"
                            : "часов"}
                        </p>
                      </div>
                      <div className="relative" id="item-menu">
                        <button
                          onClick={() => handleShowItemMenu(item._id)}
                          className="p-1 text-gray-400 rounded md hover:shadow-sm hover:bg-gray-100 hover:text-black transition duration-200 flex items-center"
                        >
                          <i className="bx bx-dots-horizontal-rounded text-[20px]"></i>
                        </button>
                        <div
                          className={`${
                            itemMenuId == item._id ? "" : "hidden"
                          } absolute end-10 top-0 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow`}
                        >
                          <ul className="py-1 text-sm text-gray-700">
                            <li>
                              <a className="block py-2 px-4 hover:bg-gray-100 flex items-center gap-2 transition duration-200">
                                <i className="bx bx-edit-alt"></i>
                                <p>Редактировать</p>
                              </a>
                            </li>
                            <li>
                              <a
                                href="#"
                                onClick={() =>
                                  handleDeleteWorkedtimeData(item._id)
                                }
                                className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition duration-200"
                              >
                                <i className="bx bx-folder-minus"></i>
                                <p>Удалить</p>
                              </a>
                            </li>
                          </ul>
                        </div>
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
                ))}
              </div>
            ))}
          </ul>
        </div>
      </main>
    </section>
  );
}
