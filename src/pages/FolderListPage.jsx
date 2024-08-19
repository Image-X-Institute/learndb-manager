import FolderListComponent from "../components/FolderListComponent";
import UpdateCacheFolderCard from "../components/UpdateCacheFolderCard";
import { Card, Tooltip } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';

const FolderListPage = () => { 
  return (
    <div className="h-full">
      <div className="flex justify-center items-center">
        <h1 className='text-center text-2xl font-bold my-4'>Local Cached Folder Management</h1>
        <Tooltip 
          title="In this page, you can manage the local cached folders and move them to RDS.
                  The local cached folders are synced with OneDirve. If you want to add your new trial folder to the cache,
                  please add it to your OneDrive folder and share it with the service account. Then in the first section, 
                  add the new folder name and click the add button. After the folder is added, you can click the sync button to
                  sync the folder to local cache. It may take a while to sync the folder to local cache."
        >
          <QuestionCircleOutlined className='ml-2 text-lg' />
        </Tooltip>
      </div>
      <Card className="m-4">
        <UpdateCacheFolderCard />
      </Card>
      <Card className="m-4">
        <FolderListComponent />
      </Card>
    </div>
  );
}

export default FolderListPage;