import React from 'react';
import { Tree, message, Button, Modal } from 'antd';
import { getFolderList, moveFolder, deleteFolder } from '../utils/apiRequest';

const { DirectoryTree } = Tree;

const FolderListComponent = () => {

  const [treeData, setTreeData] = React.useState([])
  const [selectedKeys, setSelectedKeys] = React.useState([])
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  React.useEffect(() => {
    getFolderList().then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setTreeData(data['treeData']);
        });
      }
    }).catch((err) => {
      message.error(err.message);
    });
  }, [])

  const onSelect = (keys, info) => {
    console.log('Trigger Select', keys, info);
    setSelectedKeys(keys);
  };

  const handleAddFolderClick = () => {
    moveFolder({"source":selectedKeys})
    setIsModalVisible(true);
  }

  const handleDeleteFolderClick = () => {
    deleteFolder({"source":selectedKeys}).then((res) => {
      if (res.status === 200) {
        message.success('Folder deleted successfully');
        getFolderList().then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              setTreeData(data['treeData']);
            });
          }
        }).catch((err) => {
          message.error(err.message);
        });
      } else {
        res.json().then((data) => {
          message.error(data.message);
        });
      }
    }).catch((err) => {
      message.error(err.message);
    });
  }

  const handleOk = () => {
    setIsModalVisible(false);
  }

  return (
    <div>
      <DirectoryTree
        multiple
        defaultExpandAll
        onSelect={onSelect}
        treeData={treeData}
      />
      <div className="text-center mt-2">
        <Button type="primary" className="mt-2 mr-2" onClick={handleAddFolderClick}>Add Folder to RDS</Button>
        <Button type="primary" className="mt-2 ml-2" onClick={handleDeleteFolderClick}>Delete Folder</Button>
      </div>
      <Modal title="Folder Transfer" open={isModalVisible} onOk={handleOk} onCancel={handleOk} >
        The selected folders is transferring to RDS now, it may take a while.
      </Modal>
    </div>
   
  );
};
export default FolderListComponent;