import React from "react";

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const DogCard: React.FC<{
  dog: Dog;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
}> = ({ dog, isFavorite, toggleFavorite }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img className="w-full h-48 object-cover" src={dog.img} alt={dog.name} />
      <div className="p-4 text-left">
        <p className="text-sm font-medium text-gray-500 mb-1">{dog.breed}</p>
        <p className="text-lg font-semibold text-black">{dog.name}</p>
        <p className="text-gray-500">
          <span className="font-bold">Age:</span> {dog.age}
        </p>
        <p className="text-gray-500">
          <span className="font-bold">Location:</span> {dog.zip_code}
        </p>
        <button
          className={`mt-2 px-4 py-2 rounded ${
            isFavorite ? "bg-gray-700 text-white" : "bg-gray-500 text-black"
          }`}
          onClick={() => toggleFavorite(dog.id)}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
};

export default DogCard;
