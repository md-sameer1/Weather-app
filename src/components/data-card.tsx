import React from "react";

const DataCard = ({
  icon,
  name,
  data,
}: {
  icon: React.ReactNode;
  name: string;
  data: string;
}) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md mx-1">
      <div className="flex flex-row items-center justify-center mb-1">
        {icon}
      </div>
      <p className="text-sm">{data}</p>
      <p className="text-sm">{name}</p>
    </div>
  );
};

export default DataCard;
