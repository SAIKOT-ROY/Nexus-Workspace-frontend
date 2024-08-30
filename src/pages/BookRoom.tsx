import { Button } from "@/components/ui/button"
import ProductCarousel from "@/components/ui/ProductCarousel"
import { useGetSingleRoomQuery } from "@/redux/api/baseApi";
import { useParams } from "react-router-dom"


const BookRoom = () => {
  const { id } = useParams();
  const { data: room, isLoading } = useGetSingleRoomQuery(id);

  if (isLoading) {
    return <div className="text-center mt-20 font-bold">Loading....</div>
  }

  return (
    <div className="grid lg:grid-cols-2 2xl:grid-cols-3 pt-4 pl-4 gap-6 lg:gap-20 mt-36 max-w-screen-2xl mx-auto bg-gray-50/60">
      <ProductCarousel />
      <div className="2xl:col-span-2 flex flex-col gap-2 mt-10 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{room?.name}</h2>
        <p className="mt-4 max-w-3xl tracking-wide text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, in labore deserunt eaque at dolorem a praesentium ipsam molestiae iusto obcaecati id ad assumenda repellendus.</p>
        <p className="text-xl text-gray-600 font-semibold mt-4">Floor: {room?.floorNo}</p>
        <p className="text-xl text-gray-600 font-semibold mt-2">Room No: {room?.roomNo}</p>
        <p className="text-xl font-semibold text-gray-600 mt-2">Capacity: {room?.capacity} people</p>
        <p className="mt-4 max-w-3xl tracking-wide text-gray-500">
          {room?.amenities.map((amenity, index) => (
            <span key={index} className="inline-block mr-2">
              {amenity}
            </span>
          ))}
        </p>
        <p className="text-2xl font-bold text-slate-800/85 mt-4">${room?.pricePerSlot}</p>
        <Button className="w-9/12 mt-6 flex items-center justify-center">Book Now</Button>
      </div>
    </div>
  )
}

export default BookRoom