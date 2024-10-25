import React, { Suspense } from "react";
import ListMessages from "./ListMessages";
import { supabaseServer } from "@/lib/supabase/server";
import InitMessages from "@/lib/store/InitMessages";
import { LIMIT_MESSAGE } from "@/lib/constant";

export default async function ChatMessages() {
  const supabase = supabaseServer();
  let data; // Declare data outside of the try block

  try {
    const response = await supabase
      .from("messages")
      .select("*,users(*)")
      .range(0, LIMIT_MESSAGE)
      .order("created_at", { ascending: false });

    data = response.data; // Assign data from response
    const error = response.error;

    if (error) {
      console.error("Error fetching data: ", error);
    } else {
      console.log("data: ", data);
    }
  } catch (err) {
    console.error("Unexpected error: ", err);
  }

  return (
    <Suspense fallback={"loading.."}>
      <ListMessages />
      <InitMessages messages={data?.reverse() || []} />
    </Suspense>
  );
}
