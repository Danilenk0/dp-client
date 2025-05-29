import { useState, useEffect } from "react";
import axios from "axios";
import AlertValidation from "../../Components/AlertValidation.jsx";

export default function ModalEditWorkedtime({
  isShowModal,
  selectedWorkedtimeId,
  setSelectedWorkedtimeId,
  setAlertData,
  setIsShowEditWorkedtimeModal,
  feactData,
}) {
  const [selectValue, setSelectValue] = useState();
  const [workedtime, setWorkedtime] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (selectedWorkedtimeId) {
      fetchData();
    }
  }, [selectedWorkedtimeId]);
  useEffect(() => {
    setSelectValue(workedtime.time);
  }, [workedtime]);

  async function fetchData() {
    try {
      const response = await axios.get(
        `http://localhost:5050/workedtime/${selectedWorkedtimeId}`
      );
      setWorkedtime(response.data);
    } catch (error) {
      setAlertData({
        type: "error",
        message: error.message,
      });
    }
  }

  async function handleUpdateData() {
    try {
      const data = {
        time: selectValue,
        employee_id: workedtime.employee_id._id,
        date: workedtime.datae,
      };

      const response = await axios.put(
        `http://localhost:5050/workedtime/${workedtime._id}`,
        data
      );
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
        className={`fixed top-35 left-0 right-0 z-50 flex items-center justify-center ${
          isShowModal ? "" : "hidden"
        }`}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow-2xl p-2.5">
            <div className="flex items-center justify-between pe-0.5 pt-0.5 pb-0.5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <button
                onClick={() => setIsShowEditWorkedtimeModal(false)}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition duration-200"
              >
                <i className="bx bx-x text-[20px]"></i>
              </button>
            </div>
            <main>
              <form action="" className="flex gap-2.5 py-2.5">
                <div>
                  <select
                    value={selectValue}
                    onChange={(e) => setSelectValue(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-auto p-2.5 outline-gray-200"
                  >
                    <option>Кол-во часов</option>
                    {[...Array(8).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? "час" : "часа"}
                      </option>
                    ))}
                  </select>
                </div>
              </form>

              <div className="p-2.5 rounded-md border border-gray-200 font-semibold shadow-sm mb-2.5 hover:bg-gray-100 transition duration-200">
                <div className="flex justify-between">
                  <p className="text-gray-900">
                    {workedtime.employee_id?.lastName +
                      " " +
                      workedtime.employee_id?.firstName +
                      " " +
                      workedtime.employee_id?.surname}
                  </p>
                </div>
                <hr className="h-px my-1 bg-gray-200 border-0" />
                <div className="flex flex-col">
                  <p className="text-gray-500 text-[10px]">
                    Отдел: {workedtime.employee_id?.department_id?.name}
                  </p>
                  <p className="text-gray-500 text-[10px]">
                    Должность: {workedtime.employee_id?.position_id?.name}
                  </p>
                </div>
              </div>
            </main>

            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b ">
              <button
                onClick={() => {
                  setIsShowEditWorkedtimeModal(false);
                  handleUpdateData();
                }}
                type="button"
                className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-200"
              >
                Сохранить
              </button>
              <button
                onClick={() => setIsShowEditWorkedtimeModal(false)}
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-indigo-600 focus:z-10 focus:ring-4 focus:ring-gray-100 transition duration-200"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
