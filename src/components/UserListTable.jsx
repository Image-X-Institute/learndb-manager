import React from 'react';
import { Space, Table, Tag } from 'antd';
import { getUserList } from '../utils/apiRequest';

const UserListTable = () => {

  const [tableData, setTableData] = React.useState([]);

  const tableName = [
    {
      title:"Username",
      dataIndex:"token_subject",
      key:"token_subject",
    },
    {
      title:"Email",
      dataIndex:"subject_email",
      key:"subject_email",
    },
    {
      title:"jwt_id",
      dataIndex:"jwt_id",
      key:"jwt_id",
    },
    {
      title:"User Category",
      dataIndex:"audience",
      key:"audience",
    },
    {
      title:"Issued At",
      dataIndex:"issued_at",
      key:"issued_at",
    },
    {
      title:"Access Level",
      dataIndex:"access_level",
      key:"access_level",
    }
  ]

  React.useEffect(() => {
    getUserList().then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          const processedData = data.map((item) => {
            switch (item.access_level) {
              case 0:
                item.access_level = <Tag color="blue">Read Only</Tag>;
                break;
              case 1:
                item.access_level = <Tag color="green">Read and Write</Tag>;
                break;
              case 2:
                item.access_level = <Tag color="red">Administrator</Tag>;
                break;
              default:
                item.access_level = <Tag color="blue">User</Tag>;
            }
            return {
              key: item.id,
              token_subject: item.token_subject,
              subject_email: item.subject_email,
              issued_at: item.issued_at,
              access_level: item.access_level,
              audience: item.audience,
              jwt_id: item.jwt_id
            }
          })
          setTableData(processedData);
        })
      }
    })
  }, []);

  return (
    <div>
      <Table dataSource={tableData} columns={tableName} style={{ width: '100%'}}/>
    </div>
  );
}

export default UserListTable;