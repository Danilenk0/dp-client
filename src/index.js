import ReactDOM from 'react-dom/client';
import './index.css';
import Notfound from './Views/Notfound.jsx';
import Employee from './Views/employee/Employee.jsx';
import EmployeeAdd from './Views/employee/Add.jsx'
import EmployeeEdit from './Views/employee/Edit.jsx'
import Calendar from './Views/calendar/Calendar.jsx'
import { BrowserRouter, Routes, Route } from "react-router";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/employee" element={<Employee />}></Route>
      <Route path="/employee/add" element={<EmployeeAdd />}></Route>
      <Route path="/employee/edit/:id" element={<EmployeeEdit />} />
      <Route path="/calendar" element={<Calendar />}></Route>
      <Route path="*" element={<Notfound />}></Route>
    </Routes>
  </BrowserRouter>
);

