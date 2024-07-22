import { Link } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaRegTrashAlt } from "react-icons/fa";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import NotFound from "../components/NotFound";
import Loading from "../components/Loading";
import { differenceInCalendarDays, format } from "date-fns";
import Image from "../components/Image";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [placeToDelete, setPlaceToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("/places/user-places").then(({ data }) => {
      setPlaces(data);
      setIsLoading(false);
    });
  }, []);

  const handleDelete = (place) => {
    setPlaceToDelete(place);
  };

  const handleConfirmDelete = async () => {
    axios.delete(`/places/${placeToDelete}`).then(() => {
      setPlaces(places.filter((place) => place._id !== placeToDelete));
      setPlaceToDelete(null);
    });
  };

  return (
    <>
      <ConfirmDeleteModal
        thingToDelete={placeToDelete}
        setThingToDelete={setPlaceToDelete}
        handleConfirmDelete={handleConfirmDelete}
      />

      <div>
        <AccountNav />
        <div className="text-center">
          <Link
            className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
            to={"/account/places/new"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                clipRule="evenodd"
              />
            </svg>
            Ajouter un nouveau bien
          </Link>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <Loading />
          ) : places.length > 0 ? (
            places.map((place) => (
              <div key={place._id} className="mb-6">
                <Link to={`/account/places/${place._id}`}>
                  <Image
                    alt=""
                    src={place.photos[0]}
                    className="h-56 w-full rounded-t-md object-cover"
                  />
                </Link>

                <div className="p-3 bg-gray-100 rounded-b-md">
                  <Link to={`/account/places/${place._id}`}>
                    <dl>
                      <div>
                        <dt className="sr-only">Price</dt>

                        <dd className="text-sm text-gray-500">
                          {place.price}€ par <strong>nuit</strong>
                        </dd>
                      </div>

                      <div>
                        <dt className="sr-only">Address</dt>

                        <dd className="font-medium">{place.title}</dd>
                        <dd>{place.address}</dd>
                      </div>
                    </dl>
                  </Link>

                  <div className="mt-6 flex items-center gap-8 text-xs">
                    <div className="ml-auto sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                      <FaRegTrashAlt
                        onClick={() => handleDelete(place._id)}
                        className="ml-auto rounded-full w-16 hover:text-red-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NotFound message="Aucun bien n'a encore été ajouté..." />
          )}
        </div>
      </div>
    </>
  );
}
