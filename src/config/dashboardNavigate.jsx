import { UserOutlined, HomeOutlined, AuditOutlined, FileTextOutlined, ContainerOutlined, UserAddOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import logo from '../assets/logo.png';

const createLabels = (label) => {
  switch (label) {
    case 'Centre and Trial':
      return (
        <div style={{ display: 'flex'}}>
          <p className='mr-1'>{label}</p>
          <Tooltip title="In this section, you could add new trial and centre to the database">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      )

    case 'Patients':
      return (
        <div style={{ display: 'flex'}}>
          <p className='mr-1'>{label}</p>
          <Tooltip title="In this section, you could manage everything related to patients">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      )
    case 'New Patient':
      return (
        <div style={{ display: 'flex'}}>
          <p className='mr-1'>{label}</p>
          <Tooltip title="In this section, you could add new patient to the database">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      )
    
    case 'Prescription':
      return (
        <div style={{ display: 'flex'}}>
          <p className='mr-1'>{label}</p>
          <Tooltip title="In this section, you could manage patient's prescription level data">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      )
    
    case 'Fraction':
      return (
        <div style={{ display: 'flex'}}>
          <p className='mr-1'>{label}</p>
          <Tooltip title="In this section, you could manage patient's fraction level data">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      )
    
    case 'QA Check':
      return (
        <div style={{ display: 'flex'}}>
          <p className='mr-1'>{label}</p>
          <Tooltip title="In this section, you could download the missing data for each trial in the database, and do a data updates for the missing data">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      )

    case 'Users':
      return (
        <div style={{ display: 'flex'}}>
          <p className='mr-1'>{label}</p>
          <Tooltip title="In this section, you could add new database user and manage user's access to the database">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      )

    case 'File System':
      return (
        <div style={{ display: 'flex'}}>
          <p className='mr-1'>{label}</p>
          <Tooltip title="In this section, you could manage the file system of the database">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      )
    default:
      return '';
  }
}

export const dashboardNavItems = [
  {
    key: 'logo',
    label: <img src={logo} alt="logo" />
  },
  {
    key: '/dashboard',
    icon: <HomeOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/dashboard/centresandtrials',
    icon: <AuditOutlined />,
    label: createLabels('Centre and Trial'),
    children: [
      {
        key: '/dashboard/trial/management',
        label: 'Trials',
        icon: <ContainerOutlined />
      },
      {
        key: '/dashboard/centre/management',
        label: 'Centres',
        icon: <ContainerOutlined />
      }
    ],
  },
  {
    key: '/dashboard/patients',
    icon: <AuditOutlined />,
    label: createLabels('Patients'),
    children: [
      {
        key: '/dashboard/patients/addnew',
        label: createLabels('New Patient'),
        icon: <UserAddOutlined />
      },
      {
        key: '/dashboard/patients/list',
        label: 'Patient List',
        icon: <ContainerOutlined />
      },
      {
        key: '/dashboard/patients/prescriptions',
        label: createLabels('Prescription'),
        icon: <FileTextOutlined />
      },
      {
        key: '/dashboard/patients/fractions',
        label: createLabels('Fraction'),
        icon: <ContainerOutlined />
      },
      {
        key: '/dashboard/patients/qacheck',
        label: createLabels('QA Check'),
        icon: <ContainerOutlined />
      },
    ],
  },
  {
    key: '/dashboard/filesystem',
    icon: <UserOutlined />,
    label: createLabels('File System'),
    children: [
      {
        key: '/dashboard/filesystem/folderlist',
        label: 'Folder List',
        icon: <UserAddOutlined />
      }
    ],
  },
  {
    key: '/dashboard/users',
    icon: <UserOutlined />,
    label: createLabels('Users'),
    children: [
      {
        key: '/dashboard/users/addnew',
        label: 'New User',
        icon: <UserAddOutlined />
      },
      {
        key: '/dashboard/users/management',
        label: 'User Management',
        icon: <ContainerOutlined />
      },
      {
        key: '/dashboard/users/changePassword',
        label: 'Change Password',
        icon: <ContainerOutlined />
      },
    ],
  }
]