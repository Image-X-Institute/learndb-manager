import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import PatientManagement from './pages/PatientManagement'
import UserManagement from './pages/UserManagement'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="*" element={<Navigate to='/dashboard'/>} />
        <Route exact path="/dashboard" element={<Home />} >
          <Route exact path='/dashboard/patitents' element={<PatientManagement />} />
          <Route exact path='/dashboard/users' element={<UserManagement />} />

        </Route>

      </Routes>
    </Router>
  )
}

export default App
