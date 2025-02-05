import Image from "next/image";
import React from "react";

const ForecastCard = ({
  day,
}: {
  day: {
    date: string;
    day: {
      maxtemp_c: number;
      maxtemp_f: number;
      mintemp_c: number;
      mintemp_f: number;
      condition: {
        text: string;
        icon: string;
      };
    };
  };
}) => {
  return (
    <div
      key={day.date}
      className="bg-gray-100 dark:bg-gray-700 rounded-md p-3 felx flex-col items-center w-full sm:w-48 md:w-56 lg:w-64">
      <p className="font-semibold">{day.date}</p>
      <Image
        src={`https:${day?.day?.condition?.icon}`}
        alt="Weather Icon"
        className="mx-auto mt-2"
        width={64}
        height={64}
      />
      <p>{day.day.condition.text}</p>
      <p>
        {day.day.mintemp_c}°C - {day.day.maxtemp_c}°C
      </p>
    </div>
  );
};

export default ForecastCard;
