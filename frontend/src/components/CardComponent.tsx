import React from "react";
import { Portfolio } from '../interfaces/Portfolio';


const CardComponent: React.FC<{ portfolio: Portfolio }> = ({ portfolio }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-2 mb-2 hover:bg-gray-100">
    <div className="text-sm text-gray-600">ID: {portfolio.id}</div>
    <div className="text-lg font-semibold text-gray-800">{portfolio.name} : {portfolio.quantity}</div>
    <div className="text-md text-gray-700">Price [{portfolio.price}] USD</div>
    <div className="text-md text-gray-700">Value [{ (portfolio.price) ? portfolio.quantity * portfolio.price : 0}] USD</div>
  </div>
  );
};

export default CardComponent;