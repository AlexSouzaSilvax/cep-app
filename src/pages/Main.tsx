import { Separator } from "@/components/ui/separator";
import UserForm from "@/components/UserForm/UserForm";
import UserList from "@/components/UserList/UserList";
const MainPage = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <p style={{ marginRight: "auto" }}>Gerenciamento de Usuários</p>
        <UserForm />
      </div>
      <Separator className="my-4" />
      <UserList />
    </>
  );
};

export default MainPage;
