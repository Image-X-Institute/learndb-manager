import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { ConfigProvider } from 'antd'
import { TinyColor } from '@ctrl/tinycolor'
import PrescriptionsManagement from './pages/PrescriptionsManagement'
import FractionsManagement from './pages/FractionsManagement'
import UserManagement from './pages/UserManagement'
import AddNewUser from './pages/AddNewUser'
import Dashboard from './pages/Dashboard'
import QaCheck from './pages/QaCheck'
import AddNewPatientPage from './pages/AddNewPatientPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CentreManagement from './pages/CentreManagement'
import TrialManagement from './pages/TrialManagement'
import ChangePasswordPage from './pages/ChangePasswordPage'
import FolderListPage from './pages/FolderListPage'
import PatientListPage from './pages/PatientListPage'

const imageXColor = ['#f19816', '#f4B05B', '#f19816']

const getHoverColors = (colors) =>
  colors.map((color) => new TinyColor(color).lighten(5).toString());
const getActiveColors = (colors) =>
  colors.map((color) => new TinyColor(color).darken(5).toString());

function App() {

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: `linear-gradient(90deg,  ${imageXColor.join(', ')})`,
            colorPrimaryHover: `linear-gradient(90deg, ${getHoverColors(imageXColor).join(', ')})`,
            colorPrimaryActive: `linear-gradient(90deg, ${getActiveColors(imageXColor).join(', ')})`,
            lineWidth: 2,
          },
          Menu: {
            itemBg: '#f19816',
            itemHoverBg: '#ffedd4',
            itemSelectedBg: '#ffedd4',
            subMenuItemBg: '#f7a835',
            itemSelectedColor: '#000',

          },
        }
      }}
    >
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route exact path="/dashboard" element={<Home />} >
            <Route exact path='/dashboard' element={<Dashboard />} />
            <Route exact path='/dashboard/trial/management' element={<TrialManagement />} />
            <Route exact path='/dashboard/centre/management' element={<CentreManagement />} />
            <Route exact path='/dashboard/patients/addnew' element={<AddNewPatientPage />} />
            <Route exact path='/dashboard/patients/list' element={<PatientListPage />} />
            <Route exact path='/dashboard/patients/prescriptions' element={<PrescriptionsManagement />} />
            <Route exact path='/dashboard/patients/fractions' element={<FractionsManagement />} />
            <Route exact path='/dashboard/patients/qacheck' element={<QaCheck />} />
            <Route exact path='/dashboard/users/addnew' element={<AddNewUser />} />
            <Route exact path='/dashboard/users/management' element={<UserManagement />} />
            <Route exact path='/dashboard/users/changePassword' element={<ChangePasswordPage />} />
            <Route exact path='/dashboard/filesystem/folderlist' element={<FolderListPage />} />
          </Route>

        </Routes>
      </Router>
    </ConfigProvider>
  )
}

export default App
