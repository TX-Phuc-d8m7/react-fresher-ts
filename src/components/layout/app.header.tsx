import { userCurrentApp } from "components/context/app.context";

const AppHeader = () => {

  const { user } = userCurrentApp();
  return (
    <div className="header">
      {JSON.stringify(user)}
    </div>
  );
};

export default AppHeader;
