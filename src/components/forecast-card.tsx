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
      className="mx-1 bg-gray-100 dark:bg-gray-700 rounded-md grid-cols-2 sm:grid-cols-3 md:grid-cols-5 p-1">
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
