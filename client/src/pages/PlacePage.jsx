import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import BookingWidget from "../components/BookingWidget";
import PlaceGallery from "../components/PlaceGallery";
import AddressLink from "../components/AddressLink";

export default function PlacePage() {
  const {id} = useParams();
  const [place,setPlace] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then(response => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) return '';



  return (
    <div className="mt-4 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} />
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place.description}
          </div>
          Arrivée: <strong>{place.checkIn} heure</strong><br />
          Départ: <strong>{place.checkOut} heure</strong><br />
          Nombre de personnes max: <strong>{place.maxGuests}</strong>
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      {place.extraInfo && (
        <div className="bg-white -mx-8 px-8 py-8 border-t">
          <div>
            <h2 className="font-semibold text-2xl">Information supplémentaire</h2>
          </div>
          <div className="mb-4 mt-2 text-sm text-gray-700 leading-5" style={{whiteSpace: 'pre-line'}}>{place.extraInfo}</div>
        </div>
      )}
    </div>
  );
}
