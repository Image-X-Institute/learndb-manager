import React from 'react';
import { getBusinessFolderList, addBusinessFolder, deleteBusinessFolder } from '../utils/apiRequest';
import { Button, Input, message, Table, Divider, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const UpdateCacheFolderCard = () => {

  const [folderList, setFolderList] = React.useState([]);
  const [newFolderName, setNewFolderName] = React.useState('');
  const [isValueEmpty, setIsValueEmpty] = React.useState(true);

  const handleDeleteFolder = (folderName) => {
    deleteBusinessFolder({folderName}).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
            message.success('Folder deleted successfully');
            getBusinessFolderList().then((response) => {
              if (response.status === 200) {
                response.json().then((data) => {
                  const folderList = data.folderList.map((folder, index) => {
                    return {
                      key: index,
                      folderName: folder
                    }
                  });
                  setFolderList(folderList);
                });
              }
            });
        });
      }
    });
  }

  const columns = [
    {
      title: 'Folder Name',
      dataIndex: 'folderName',
      key: 'folderName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button className='p-0 m-0' type='link' onClick={() => handleDeleteFolder(record.folderName)}>Delete</Button>
      ),
    },
  ];

  React.useEffect(() => {
    getBusinessFolderList().then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          const folderList = data.folderList.map((folder, index) => {
            return {
              key: index,
              folderName: folder
            }
          });
          setFolderList(folderList);
        });
      }
    });
  }, []);

  const handleAddClick = () => {
    if (newFolderName === '') {
      message.error('Please enter the folder name');
      return;
    }
    if (folderList.find(folder => folder.folderName === newFolderName)) {
      message.error('Folder already exists');
      return;
    }
    addBusinessFolder({folderName: newFolderName}).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
            message.success('Folder added successfully');
            getBusinessFolderList().then((response) => {
              if (response.status === 200) {
                response.json().then((data) => {
                  const folderList = data.folderList.map((folder, index) => {
                    return {
                      key: index,
                      folderName: folder
                    }
                  });
                  setFolderList(folderList);
                });
              }
            });
        });
      }
    });
    setNewFolderName('');
    setIsValueEmpty(true);
  }

  const handleInputChange = (e) => {
    setNewFolderName(e.target.value);
    if (e.target.value === '') {
      setIsValueEmpty(true);
    } else {
      setIsValueEmpty(false);
    }
  }


  return (
    <div>
       <h1 className='text-center text-xl font-bold my-2'>Trial Folder Configuration</h1>
       <div className='flex justify-center'>
        <div className='flex justify-center items-center flex-col'>
          <div className='flex justify-center items-center'>
            <h2 className='text-center text-lg font-bold my-2 mr-2'>Existing Folders</h2>
            <Tooltip title="The folders listed in the below table are the onedrive shared folders which are monitored by the sync system.">
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
          <Table dataSource={folderList} columns={columns} className='w-72 px-10'/>
        </div>
        
        <Divider type='vertical' style={{borderColor: '#000', height: '450px', marginLeft:'100px', marginRight:'100px'}}/>
        <div className='flex justify-space items-center w-72 mx-12 flex-col h-full'>
          
          <div className='flex justify-center items-center'>
            <h2 className='text-center text-lg font-bold my-2 mr-2'>Add New Folder</h2>
            <Tooltip 
              title="To add a new folder to the cache, please share the folder with the admin onedrive account, then add the folder name here and click the add button.">
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
          <Input className='w-72 mt-32 mb-8' placeholder='New Folder Name' value={newFolderName} onChange={(e) => handleInputChange(e)}/>
          <Button type='primary' onClick={handleAddClick} disabled={isValueEmpty}>Add</Button>
          </div>
       </div>
       
    </div>
   
  );

}

export default UpdateCacheFolderCard;