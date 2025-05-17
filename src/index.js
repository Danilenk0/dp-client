import ReactDOM from 'react-dom/client';
import './index.css';
import Notfound from './Views/Notfound.jsx';
import Employee from './Views/employee/Employee.jsx';
import EmployeeAdd from './Views/employee/Add.jsx'
import EmployeeEdit from './Views/employee/Edit.jsx'
import Noshow from './Views/Noshow.jsx'
import Workedtime from './Views/workedtime/Workedtime.jsx'
import { BrowserRouter, Routes, Route } from "react-router";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/employee" element={<Employee />}></Route>
      <Route path="/employee/add" element={<EmployeeAdd />}></Route>
      <Route path="/employee/edit/:id" element={<EmployeeEdit />} />
      <Route path="/noshow" element={<Noshow />}></Route>
      <Route path="/workedtime" element={<Workedtime />}></Route>
      <Route path="*" element={<Notfound />}></Route>
    </Routes>
  </BrowserRouter>
);

