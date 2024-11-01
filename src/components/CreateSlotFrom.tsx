import { useAppDispatch } from "@/redux/hooks";
import { setDate } from "@/redux/slices/timeAndDate";
import { formatDate } from "@/utils/time";
import { ChangeEvent, FormEvent, useState } from "react";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { useGetRoomsQuery } from "@/redux/api/baseApi";
import { useCreateSlotMutation } from "@/redux/api/slotApi";
import { generateTimeOptions } from "@/utils/generateTimeOptions";
import { toast } from "sonner";

const CreateSlotFrom = () => {

    const [date, setDateState] = useState<Date | undefined>(new Date())
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedRoom, setSelectedRoom] = useState("");
    const [currentDate, setCurrentDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const dispatch = useAppDispatch()
    const { data: roomData } = useGetRoomsQuery({})
    const [createSlot] = useCreateSlotMutation()

    const handleRoomChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const roomId = e.target.value;
        setSelectedRoom(roomId);
    };

    const handleSubmit = async (e: FormEvent<HTMLElement>) => {
        e.preventDefault();
        setErrorMessage("");

        if (!selectedRoom) {
            setErrorMessage("Please select a room.");
            return;
        }
        if (!startTime || !endTime) {
            setErrorMessage("Please select both start and end times.");
            return;
        }

        const submissionData = {
            room: selectedRoom,
            date: currentDate,
            startTime: startTime,
            endTime: endTime
        };

        const toastId = toast.loading('Creating slot...');

        try {
            const res = await createSlot(submissionData);

            console.log(res);

            if (res?.data?.success) {
                toast.success('Slot is Created')
            } else if (res.error) {
                toast.error('Failed To Create Slot')
            }

        } catch (error) {
            toast.warning('An error occurred while creating the slot.');
            console.error(error);
        }

        toast.dismiss(toastId);
    };

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDateState(selectedDate);
            const formattedDate = formatDate(selectedDate);
            setCurrentDate(formattedDate)
            dispatch(setDate(formattedDate))
            console.log(formattedDate);
        }
    };

    return (
        <div className="w-full gap-2 flex flex-col items-center justify-center">
            <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md w-[380px] border"
            />
            <form onSubmit={handleSubmit} className="w-[50%]">
                <div className="flex gap-2">
                    {/* Room selection */}
                    <select
                        name="room"
                        id="room"
                        className="mt-1.5 w-full p-2 rounded-lg border-gray-300 text-gray-700 sm:text-sm border"
                        value={selectedRoom}
                        onChange={handleRoomChange}
                    >
                        <option value="">Select Room</option>
                        {roomData?.map((room) => (
                            <option key={room._id} value={room._id}>
                                {room.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2">
                    {/* Start time selection */}
                    <select
                        name="startTime"
                        id="startTime"
                        className="mt-1.5 w-[170px] p-2 rounded-lg border-gray-300 text-gray-700 sm:text-sm border"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    >
                        <option value="">Start Time</option>
                        {generateTimeOptions()}
                    </select>

                    {/* End time selection */}
                    <select
                        name="endTime"
                        id="endTime"
                        className="mt-1.5 w-[170px] p-2 rounded-lg border-gray-300 text-gray-700 sm:text-sm border"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    >
                        <option value="">End Time</option>
                        {generateTimeOptions()}
                    </select>
                </div>

                {/* Error message */}
                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

                <Button type="submit" className="mt-4 text-white rounded-md px-4 py-2">
                    Submit
                </Button>
            </form>
        </div>
    )
}

export default CreateSlotFrom