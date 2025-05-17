import Navbar from "../../Components/Navbar";
import AlertValidation from "../../Components/AlertValidation.jsx";
import { useState, useEffect } from "react";
import axios from "axios";
import Alert from '../../Components/Alert.jsx'

export default function Add() {
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    surname: "",
    department_id: "",
    position_id: "",
  });
  const [alertData, setAlertData] = useState({
    type: '',
    message: '',
  });
    const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseDepartments = await axios.get(
          "http://localhost:5050/department"
        );
        setDepartments(responseDepartments.data);

        const responsePositions = await axios.get(
          "http://localhost:5050/position"
        );
        setPositions(responsePositions.data);
      } catch (error) {
        setAlertData({
          type: 'error',
          message:error.message
        })
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const sendData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5050/employee",
          employee
        );
        setAlertData({
          type: "success",
          message: response.data.message,
        });
        setEmployee({
          firstName: "",
          lastName: "",
          surname: "",
          department_id: "",
          position_id: "",
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
    };
    sendData();
  };

  return (
    <>
      <Alert alertData={alertData} setAlertData={setAlertData}/>
      <AlertValidation validationErrors={validationErrors} setValidationErrors={setValidationErrors}/>
      <Navbar />
      <main>
        <form className="max-w-md mx-auto mt-20" onSubmit={handleSubmit}>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={employee.firstName}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="firstName"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Имя
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={employee.lastName}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="lastName"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Фамилия
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="surname"
              id="surname"
              value={employee.surname}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="surname"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Отчество
            </label>
          </div>
          <div className="flex justify-between">
            <div className="mr-2">
              <select
                id="department_id"
                name="department_id"
                value={employee.department_id}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Выберите отдел</option>
                {departments.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="ml-2">
              <select
                id="position_id"
                name="position_id"
                value={employee.position_id}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Выберите позицию</option>
                {positions.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-4"
          >
            Отправить
          </button>
        </form>
      </main>
    </>
  );
}
