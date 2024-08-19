
import { Button, Result } from 'antd';

const NoAccessPage = () => {
  const handleConsoleClick = () => {
    window.location.href = '/dashboard';
  }

  return (
    <Result
      status="warning"
      title="You do not have access to this page"
      extra={
        <Button type="primary" key="console" onClick={handleConsoleClick}>
          Go Dashboard
        </Button>
      }
    />
  );
}
export default NoAccessPage;