import React from "react";

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const DogCard: React.FC<{ dog: Dog }> = ({ dog }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
      <img
        className="w-32 h-32 object-cover rounded-full"
        src={dog.img}
        alt={dog.name}
      />
      <p className="text-lg font-semibold mt-2">{dog.name}</p>
      <p className="text-gray-600">{dog.breed}</p>
      <p className="text-gray-500">Age: {dog.age}</p>
      <p className="text-gray-500">Location: {dog.zip_code}</p>
    </div>
  );
};

export default DogCard;
