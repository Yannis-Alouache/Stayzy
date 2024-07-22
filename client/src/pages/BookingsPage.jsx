import AccountNav from "../components/AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../components/PlaceImg";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";
import BookingDates from "../components/BookingDates";
import Image from "../components/Image";
import { FaRegTrashAlt } from "react-icons/fa";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import NotFound from "../components/NotFound";
import Loading from "../components/Loading";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("/bookings").then((response) => {
      setBookings(response.data);
      setIsLoading(false);
    });
  }, []);

  const handleDelete = (booking) => {
    setBookingToDelete(booking);
  };

  const handleConfirmDelete = async () => {
    axios.delete(`/bookings/${bookingToDelete}`).then(() => {
      setBookings(
        bookings.filter((booking) => booking._id !== bookingToDelete)
      );
      setBookingToDelete(null);
    });
  };

  return (
    <div>
      <ConfirmDeleteModal
        thingToDelete={bookingToDelete}
        setThingToDelete={setBookingToDelete}
        handleConfirmDelete={handleConfirmDelete}
      />

      <AccountNav />
      {isLoading ? (
        <Loading />
      ) : bookings?.length > 0 ? (
        bookings.map((booking) => (
          <div key={booking._id} className="mb-6">
            <Link to={`/account/bookings/${booking._id}`}>
              <Image
                alt=""
                src={booking.place.photos[0]}
                className="h-56 w-full rounded-t-md object-cover"
              />
            </Link>

            <div className="p-3 bg-gray-100 rounded-b-md">
              <Link to={`/account/bookings/${booking._id}`}>
                <dl>
                  <div>
                    <dt className="sr-only">Price</dt>

                    <dd className="text-sm text-gray-500">{booking.price}€</dd>
                  </div>

                  <div>
                    <dt className="sr-only">Address</dt>

                    <dd className="font-medium">{booking.place.title}</dd>
                    <dd>{booking.place.address}</dd>
                  </div>
                </dl>
              </Link>

              <div className="mt-6 flex items-center gap-8 text-xs">
                <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                  <div className="mt-1.5 sm:mt-0">
                    <p className="text-gray-500">Nuits</p>

                    <p className="font-medium">
                      {differenceInCalendarDays(
                        new Date(booking.checkOut),
                        new Date(booking.checkIn)
                      )}
                    </p>
                  </div>
                </div>

                <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                  <div className="mt-1.5 sm:mt-0">
                    <p className="text-gray-500">Arrivé</p>

                    <p className="font-medium">
                      {format(new Date(booking.checkIn), "dd-MM-yyyy")}
                    </p>
                  </div>
                </div>

                <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                  <div className="mt-1.5 sm:mt-0">
                    <p className="text-gray-500">Départ</p>
                    <p className="font-medium">
                      {format(new Date(booking.checkOut), "dd-MM-yyyy")}
                    </p>
                  </div>
                </div>

                <div className="ml-auto sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                  <FaRegTrashAlt
                    onClick={() => handleDelete(booking._id)}
                    className="ml-auto rounded-full w-16 hover:text-red-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <NotFound message="Aucune réservations..." />
      )}
    </div>
  );
}
