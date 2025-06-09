import Navbar from "../../Components/Navbar";
import AlertValidation from "../../Components/AlertValidation.jsx";
import { useState, useEffect } from "react";
import {Link} from 'react-router'
import axios from "axios";
import Alert from "../../Components/Alert.jsx";

export default function Add() {
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    surname: "",
    address: "",
    email: "",
    phone:"+375 (",
    department_id: "",
    position_id: "",
  });
  const [alertData, setAlertData] = useState({
    type: "",
    message: "",
  });
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
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
        type: "error",
        message: error.message,
      });
    }
  }
  function formatPhone(value) {
    let digits = value.replace(/\D/g, "");
    if (digits.startsWith("375")) digits = digits.slice(3);
    if (digits.length === 0) return "";

    let formatted = "+375";
    if (digits.length > 0) formatted += " (";
    if (digits.length >= 1) formatted += digits.substring(0, 2);
    if (digits.length >= 3) formatted += ") " + digits.substring(2, 5);
    else if (digits.length > 2) formatted += ") " + digits.substring(2);
    if (digits.length >= 6) formatted += "-" + digits.substring(5, 7);
    else if (digits.length > 5) formatted += "-" + digits.substring(5);
    if (digits.length >= 8) formatted += "-" + digits.substring(7, 9);
    else if (digits.length > 7) formatted += "-" + digits.substring(7);

    return formatted;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "phone") {
      setEmployee((prev) => ({
        ...prev,
        [name]: formatPhone(value),
      }));
    } else {
      setEmployee((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }


  async function handleSubmitForm(e) {
    e.preventDefault();
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
        address: "",
        email: "",
        phone: "",
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
  }

  return (
    <>
      <Alert alertData={alertData} setAlertData={setAlertData} />
      <AlertValidation
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
      />
      <Navbar />
      <main>
        <form className="max-w-115 mx-auto mt-20">
          <div className="flex items-center gap-2.5">
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
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="address"
              id="address"
              value={employee.address}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="address"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Адрес
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="email"
              id="email"
              value={employee.email}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Электронная почта
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <div className="relative z-0 w-full mb-5 group">
              <div className="relative">
                <span className="absolute start-0 bottom-1 text-gray-500">
                  <i className="bx bx-phone flex text-[20px]"></i>
                </span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={employee.phone}
                  onChange={handleChange}
                  className="block py-2.5 ps-6 pe-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  maxLength={19}
                />
                <label
                  htmlFor="phone"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:start-6 peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                  Мобильный телефон
                </label>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="mr-2">
              <select
                id="department_id"
                name="department_id"
                value={employee.department_id}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 outline-none"
              >
                <option value="">Выберите отдел</option>
                {departments.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="ml-2 w-146">
              <select
                id="position_id"
                name="position_id"
                value={employee.position_id}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 outline-none"
              >
                <option value="">Выберите должность</option>
                {positions.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSubmitForm}
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-4 transition duration-200"
            >
              Отправить
            </button>
            <Link
              to="/employee"
              className="text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-4 transition duration-200"
            >
              Назад
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}
