export default function WorkedtimeOutputList({
  outputWorkedtimes,
  setItemMenuId,
  handleDeleteWorkedtimeData,
  itemMenuId,
  updateItemId,
  setUpdateItemId,
  setWorkedtimeUpdateData,
  workedtimeUpdateData,
  handleUpdateWorkedtimeData,
}) {
  const allEmpty = Object.values(outputWorkedtimes).every(
    (value) => value.length === 0
  );

  return (
    <>
      {allEmpty ? (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          <span className="font-medium">Нет данных!</span> Нет данных для
          отображения, рекомендуем добавить данные на эти даты
        </div>
      ) : (
        <ul>
          {Object.entries(outputWorkedtimes).map(([key, value]) => (
            <div key={key}>
              {value.length === 0 ? null : (
                <div className="flex items-center justify-center gap-2">
                  <hr className="h-[3px] bg-gray-200 border-0  w-[35%] rounded-md" />
                  <p className="text-gray-300 font-semibold">{key}</p>
                  <hr className="h-[3px] bg-gray-200 border-0 w-[35%] rounded-md" />
                </div>
              )}
              {value.map((item, index) => (
                <li
                  key={index}
                  className="p-2.5 rounded-md border border-gray-200 font-semibold shadow-sm mb-2.5 relative"
                >
                  <div className="flex justify-between">
                    <div className="flex justify-between items-center w-full pe-7">
                      <p className="text-gray-900">
                        {`${item.employee_id.lastName} ${item.employee_id.firstName} ${item.employee_id.surname}`}
                      </p>
                      {updateItemId === item._id ? (
                        <input
                          value={workedtimeUpdateData.time}
                          onChange={(e) =>
                            setWorkedtimeUpdateData({
                              ...workedtimeUpdateData,
                              time: e.target.value,
                            })
                          }
                          className="text-gray-500 absolute bottom-[-10px] end-[-10px] bg-white px-2.5 py-0.5 rounded-md border border-gray-200 shadow-sm text-[13px] focus:outline-none focus:border-gray-500 w-15"
                          type="text"
                        />
                      ) : (
                        <p
                          onClick={() => {
                            setUpdateItemId(item._id);
                            setWorkedtimeUpdateData({
                              _id: item._id,
                              date: item.date,
                              employee_id: item.employee_id._id,
                              time: item.time,
                            });
                          }}
                          className="text-gray-500 absolute bottom-[-10px] end-[-10px] bg-white px-2.5 py-0.5 rounded-md border border-gray-200 shadow-sm text-[13px] hover:bg-gray-100 transition duration-200"
                        >
                          {item.time}{" "}
                          {item.time === 1
                            ? "час"
                            : item.time > 1 && item.time < 5
                            ? "часа"
                            : "часов"}
                        </p>
                      )}
                    </div>
                    <div className="relative" id="item-menu">
                      {updateItemId === item._id ? (
                        <div className="flex gap-0.5">
                          <button
                            onClick={handleUpdateWorkedtimeData}
                            className="p-1 text-gray-400 rounded md hover:shadow-sm hover:bg-gray-100 hover:text-black transition duration-200 flex items-center"
                          >
                            <i className="bx bx-save text-[20px]"></i>
                          </button>
                          <button
                            onClick={() => {
                              setUpdateItemId("");
                              setWorkedtimeUpdateData({
                                _id: "",
                                date: "",
                                employee_id: "",
                                time: "",
                              });
                            }}
                            className="p-1 text-gray-400 rounded md hover:shadow-sm hover:bg-gray-100 hover:text-black transition duration-200 flex items-center"
                          >
                            <i className="bx bx-x text-[20px]"></i>
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => setItemMenuId(item._id)}
                            className="p-1 text-gray-400 rounded md hover:shadow-sm hover:bg-gray-100 hover:text-black transition duration-200 flex items-center"
                          >
                            <i className="bx bx-dots-horizontal-rounded text-[20px]"></i>
                          </button>
                          <div
                            className={`${
                              itemMenuId === item._id ? "" : "hidden"
                            } absolute end-10 top-0 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow`}
                          >
                            <ul className="py-1 text-sm text-gray-700">
                              <li>
                                <a
                                  onClick={() => {
                                    setUpdateItemId(item._id);
                                    setItemMenuId();
                                    setWorkedtimeUpdateData({
                                      _id: item._id,
                                      date: item.date,
                                      employee_id: item.employee_id._id,
                                      time: item.time,
                                    });
                                  }}
                                  className="block py-2 px-4 hover:bg-gray-100 flex items-center gap-2 transition duration-200"
                                >
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
                        </>
                      )}
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
      )}
    </>
  );
}
