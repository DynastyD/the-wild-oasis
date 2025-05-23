import { useState } from "react";
import { isFuture, isPast, isToday } from "date-fns";
import supabase from "../services/supabase";
import Button from "../ui/Button";
import { subtractDates } from "../utils/helpers";

import { bookings } from "./data-bookings";
import { cabins } from "./data-cabins";
import { guests } from "./data-guests";

// const originalSettings = {
//   minBookingLength: 3,
//   maxBookingLength: 30,
//   maxGuestsPerBooking: 10,
//   breakfastPrice: 15,
// };

async function deleteGuests() {
  const { error } = await supabase.from("guests").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function deleteCabins() {
  const { error } = await supabase.from("cabins").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function deleteBookings() {
  const { error } = await supabase.from("bookings").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function createGuests() {
  const { error } = await supabase.from("guests").insert(guests);
  if (error) console.log(error.message);
}

async function createCabins() {
  const { error } = await supabase.from("cabins").insert(cabins);
  if (error) console.log(error.message);
}

async function createBookings() {
  try {
    // 首先，让我们检查表结构
    const { data: bookingInfo, error: schemaError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);
      
    if (schemaError) {
      console.error('Schema error:', schemaError);
      throw new Error('Could not fetch table schema');
    }
      
    console.log('Current booking table structure:', bookingInfo);
    
    // Bookings need a guestId and a cabinId. We can't tell Supabase IDs for each object, it will calculate them on its own. So it might be different for different people, especially after multiple uploads. Therefore, we need to first get all guestIds and cabinIds, and then replace the original IDs in the booking data with the actual ones from the DB
    const { data: guestsIds } = await supabase
      .from("guests")
      .select("id")
      .order("id");
    const allGuestIds = guestsIds.map((guest) => guest.id);
    
    const { data: cabinsIds } = await supabase
      .from("cabins")
      .select("id")
      .order("id");
    const allCabinIds = cabinsIds.map((cabin) => cabin.id);

    console.log('Found guest IDs:', allGuestIds);
    console.log('Found cabin IDs:', allCabinIds);

    const finalBookings = bookings.map((booking) => {
      // Here relying on the order of cabins, as they don't have and ID yet
      const cabin = cabins.at(booking.cabinId - 1);
      const numNights = subtractDates(booking.endDate, booking.startDate);
      const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
      const extraPrice = booking.hasBreakfast
        ? numNights * 15 * booking.numGuests
        : 0; // hardcoded breakfast price
      const totalPrice = cabinPrice + extraPrice;

      let status;
      if (
        isPast(new Date(booking.endDate)) &&
        !isToday(new Date(booking.endDate))
      )
        status = "checked-out";
      if (
        isFuture(new Date(booking.startDate)) ||
        isToday(new Date(booking.startDate))
      )
        status = "unconfirmed";
      if (
        (isFuture(new Date(booking.endDate)) ||
          isToday(new Date(booking.endDate))) &&
        isPast(new Date(booking.startDate)) &&
        !isToday(new Date(booking.startDate))
      )
        status = "checked-in";

      // 尝试使用正确的字段名称 (cabinid 或 guestid)
      const bookingData = {
        ...booking,
        numNights,
        cabinPrice,
        extraPrice,
        totalPrice,
        status,
      };
      
      // 添加正确的外键字段
      const guestid = allGuestIds.at(booking.guestId - 1);
      const cabinid = allCabinIds.at(booking.cabinId - 1);
      
      if (guestid) bookingData.guestid = guestid;
      if (cabinid) bookingData.cabinid = cabinid;

      // 删除原始的驼峰字段，避免插入报错
      delete bookingData.cabinId;
      delete bookingData.guestId;
      
      return bookingData;
    });

    console.log('Final bookings data:', finalBookings[0]);

    const { error } = await supabase.from("bookings").insert(finalBookings);
    if (error) {
      console.error('Insert error:', error);
      throw new Error(`Could not create bookings: ${error.message}`);
    } else {
      console.log('Bookings successfully inserted!');
    }
  } catch (err) {
    console.error('Error in createBookings:', err);
    alert(`Failed to create bookings: ${err.message}`);
  }
}

function Uploader() {
  const [isLoading, setIsLoading] = useState(false);

  async function uploadAll() {
    setIsLoading(true);
    // Bookings need to be deleted FIRST
    await deleteBookings();
    await deleteGuests();
    await deleteCabins();

    // Bookings need to be created LAST
    await createGuests();
    await createCabins();
    await createBookings();

    setIsLoading(false);
  }

  async function uploadBookings() {
    setIsLoading(true);
    await deleteBookings();
    await createBookings();
    setIsLoading(false);
  }

  return (
    <div
      style={{
        marginTop: "auto",
        backgroundColor: "#e0e7ff",
        padding: "8px",
        borderRadius: "5px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <h3>SAMPLE DATA</h3>

      <Button onClick={uploadAll} disabled={isLoading}>
        Upload ALL
      </Button>

      <Button onClick={uploadBookings} disabled={isLoading}>
        Upload bookings ONLY
      </Button>
    </div>
  );
}

export default Uploader;
