import React from 'react';
import { getCenterDetailList, deleteCenter } from '../utils/apiRequest';
import { Button, Table, Modal } from 'antd';




const DeleteCentreTable = () => {

  const [ centreList, setCentreList ] = React.useState([]);
  const [ selectedCentre, setSelectedCentre ] = React.useState('');
  const [ isModalVisible, setIsModalVisible ] = React.useState(false);

  const columns = [
    {
      title: 'Site Name',
      dataIndex: 'siteName',
      key: 'siteName',
    },
    {
      title: 'Site Full Name',
      dataIndex: 'siteFullName',
      key: 'siteFullName',
    },
    {
      title: 'Site Location',
      dataIndex: 'siteLocation',
      key: 'siteLocation',
    },
    {
      title: 'Action',
      key: 'action',
      render: (site) => (
        <Button type='link' className='p-0 m-0' onClick={() => handleDeleteClick(site)}>Delete</Button>
      )
    }
  ]

  const handleDeleteClick = (site) => {
    setSelectedCentre(site.siteName);
    setIsModalVisible(true);
  }

  const handleModalOk = () => {

    deleteCenter({"siteName":selectedCentre}).then((res) => {
      if (res.status === 200) {
        getCenterDetailList().then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              const tableList = data.sites.map((site) => {
                return {
                  key: site.siteName,
                  siteName: site.siteName,
                  siteFullName: site.siteFullName,
                  siteLocation: site.siteLocation,
                }
              })
              setCentreList(tableList);
            })
          }
        })
      }
    })
    setIsModalVisible(false);
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  }

  React.useEffect(() => {
    getCenterDetailList().then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          const tableList = data.sites.map((site) => {
            return {
              key: site.siteName,
              siteName: site.siteName,
              siteFullName: site.siteFullName,
              siteLocation: site.siteLocation,
            }
          })
          setCentreList(tableList);
        })
      }
    })
  }, []);

  return (
    <div>
      <Table columns={columns} dataSource={centreList} />
      <Modal title='Delete Centre' onOk={handleModalOk} onCancel={handleCancel} open={isModalVisible}>
        <p>Are you sure you want to delete {selectedCentre}?</p>
      </Modal>
    </div>

  );
}

export default DeleteCentreTable;