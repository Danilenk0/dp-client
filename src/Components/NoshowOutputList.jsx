export default function NoshowOutputList({
  outputNoshows,
  setItemMenuId,
  handleDeleteNoshowData,
  itemMenuId,
  updateItemId,
  setUpdateItemId,
  setNoshowUpdateData,
  noshowUpdateData,
  handleUpdateNoshowData,
  causes,
}) {
  const allEmpty = Object.values(outputNoshows).every(
    (arr) => arr.length === 0
  );

  return (
    <>
      {allEmpty ? (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 "
          role="alert"
        >
          <span className="font-medium">Нет данных!</span> Нет данных для
          отображения, рекомендуем добавить данные на эти даты
        </div>
      ) : (
        <ul>
          {Object.entries(outputNoshows).map(([key, value]) => (
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
                    </div>
                    <div className="relative" id="item-menu">
                      {updateItemId === item._id ? (
                        <div className="flex gap-0.5">
                          <button
                            onClick={handleUpdateNoshowData}
                            className="p-1 text-gray-400 rounded md hover:shadow-sm hover:bg-gray-100 hover:text-black transition duration-200 flex items-center"
                          >
                            <i className="bx bx-save text-[20px]"></i>
                          </button>
                          <button
                            onClick={() => {
                              setUpdateItemId("");
                              setNoshowUpdateData({
                                date: "",
                                employee_id: "",
                                type: "",
                                cause_id: "",
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
                            onClick={() => {
                              setItemMenuId(
                                itemMenuId === item._id ? undefined : item._id
                              );
                            }}
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
                                    setNoshowUpdateData({
                                      date: item.date,
                                      employee_id: item.employee_id._id,
                                      type: item.type,
                                      cause_id: item.cause_id,
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
                                    handleDeleteNoshowData(item._id)
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
                    {updateItemId === item._id ? (
                      <p className="text-gray-500 text-[10px]">
                        Тип:{" "}
                        <input
                          value={noshowUpdateData.type}
                          onChange={(e) => {
                            setNoshowUpdateData({
                              ...noshowUpdateData,
                              type: e.target.value,
                            });
                          }}
                          className="border-none outline-none text-[10px] text-gray-500"
                          type="text"
                        />
                      </p>
                    ) : (
                      <p
                        onClick={() => {
                          setUpdateItemId(item._id);
                          setItemMenuId();
                          setNoshowUpdateData({
                            date: item.date,
                            employee_id: item.employee_id._id,
                            type: item.type,
                            cause_id: item.cause_id,
                          });
                        }}
                        className="text-gray-500 text-[10px]"
                      >
                        Тип: {item.type}
                      </p>
                    )}
                    {updateItemId === item._id ? (
                      <p className="text-gray-500 text-[10px]">
                        Причина:
                        <select
                          onChange={(e) =>
                            setNoshowUpdateData({
                              ...noshowUpdateData,
                              cause_id: e.target.value,
                            })
                          }
                          value={noshowUpdateData.cause_id}
                          id="cause"
                          className="border-none text-gray-500 text-[10px] outline-none"
                        >
                          {causes.map((cause) => (
                            <option key={cause._id} value={cause._id}>
                              {cause.name}
                            </option>
                          ))}
                        </select>
                      </p>
                    ) : (
                      <p
                        onClick={() => {
                          setUpdateItemId(item._id);
                          setItemMenuId();
                          setNoshowUpdateData({
                            date: item.date,
                            employee_id: item.employee_id._id,
                            type: item.type,
                            cause_id: item.cause_id,
                          });
                        }}
                        className="text-gray-500 text-[10px]"
                      >
                        Причина: {item.cause_id.name}
                      </p>
                    )}
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
