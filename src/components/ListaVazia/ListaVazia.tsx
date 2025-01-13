import React from "react";
import myImage from "../../assets/caixa-vazia.png";

const ListaVazia: React.FC = () => {
  return (
    <div className="flex flex-col flex-row justify-center items-center">
      <img
        src={myImage}
        alt="Nenhum usuário cadastrado"
        width={60}
        height={60}
      />
      <p className="mt-5 text-gray-500">Nenhum usuário cadastrado</p>
    </div>
  );
};

export default ListaVazia;
