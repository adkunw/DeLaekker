const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://blzckgsggxoyzgjglaeg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsemNrZ3NnZ3hveXpnamdsYWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM2NjQ1NDUsImV4cCI6MjAxOTI0MDU0NX0.WJoQPLjDpq7TvX5yzQkmWYrZDIK6ZlzkxdDxHbnjEps"; // Replace with your actual Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);

// Contoh: Mengambil semua data dari tabel 'T_Data_Cookies'
async function fetchData() {
  const { data, error } = await supabase
    .from("T_Data_Cookies")
    .select("*")
    .limit(10); // Limit to 10 rows

  console.log("Data:", data);

  if (error) {
    console.error("Error fetching data:", error.message);
    return;
  }
}

fetchData();
