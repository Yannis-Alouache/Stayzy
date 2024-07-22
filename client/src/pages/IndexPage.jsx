import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Image from "../components/Image.jsx";
import SearchBar from "../components/SearchBar.jsx";

export default function IndexPage() {
  const [places,setPlaces] = useState([]);

  const [destination, setDestination] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [travelers, setTravelers] = useState("");

  
  const handleSearch = () => {
    const url = "/places?destination="+destination+"&arrival="+arrival+"&departure="+departure+"&travelers="+travelers
    axios.get(url).then(response => {
      setPlaces(response.data);
    })
  }

  const SearchBarProps = {
    destination,
    arrival,
    departure,
    travelers,
    setDestination,
    setArrival,
    setDeparture,
    setTravelers,
    handleSearch
  }

  useEffect(() => {
    axios.get('/places').then(response => {
      setPlaces(response.data);
    });
  }, []);

  return (
    <>
      <SearchBar {...SearchBarProps} />
      <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {places.length > 0 && places.map(place => (
          <Link to={'/place/'+place._id} key={place._id}>
            <div className="bg-gray-500 mb-2 rounded-2xl flex">
              {place.photos?.[0] && (
                <Image className="rounded-2xl object-cover aspect-square" src={place.photos?.[0]} alt=""/>
              )}
            </div>
            <h2 className="font-bold">{place.title}</h2>
            <h3 className="text-sm text-gray-500">{place.address}</h3>
            <div className="mt-1">
              <span className="font-bold">{place.price}€</span> par nuit
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
