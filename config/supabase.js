// Import library Supabase dan ekstrak fungsi createClient
const { createClient } = require("@supabase/supabase-js");

// Inisialisasi URL dan kunci Supabase
const supabaseUrl = "https://blzckgsggxoyzgjglaeg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsemNrZ3NnZ3hveXpnamdsYWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM2NjQ1NDUsImV4cCI6MjAxOTI0MDU0NX0.WJoQPLjDpq7TvX5yzQkmWYrZDIK6ZlzkxdDxHbnjEps";
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = {
  supabase,
};
