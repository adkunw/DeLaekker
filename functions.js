//panggil supabase
const { supabase } = require("./config/supabase");

// Fungsi untuk mengambil data dari tabel T_Data_Cookies dengan mengurutkan berdasarkan tanggal secara descending
async function LoadData() {
  try {
    const { data, error } = await supabase
      .from("T_Data_Cookies")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      throw new Error(
        `Error fetching data from T_Data_Cookies: ${error.message}`
      );
    }

    return data;
  } catch (e) {
    throw new Error(`Unexpected error: ${e.message}`);
  }
}

// Fungsi untuk mengambil detail data berdasarkan ID_Cookies
async function getDetailById(id) {
  try {
    const { data, error } = await supabase
      .from("T_Data_Cookies")
      .select("*")
      .eq("ID_Cookies", id)
      .single(); // Menggunakan metode single() untuk mendapatkan satu baris data

    if (error) {
      throw new Error(`Error fetching detail data: ${error.message}`);
    }

    return data;
  } catch (e) {
    throw new Error(`Unexpected error: ${e.message}`);
  }
}

// Fungsi untuk menambahkan data ke tabel
async function addDataToTable(tableName, data) {
  try {
    const { error } = await supabase.from(tableName).upsert([data]);

    if (error) {
      throw new Error(`Error adding data to ${tableName}: ${error.message}`);
    }
  } catch (e) {
    throw new Error(`Unexpected error: ${e.message}`);
  }
}

// Fungsi untuk menghapus data dari tabel berdasarkan ID_Cookies
async function deleteDataFromTable(tableName, id) {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("ID_Cookies", id);

    if (error) {
      throw new Error(
        `Error deleting data from ${tableName}: ${error.message}`
      );
    }
  } catch (e) {
    throw new Error(`Unexpected error: ${e.message}`);
  }
}

// Fungsi untuk mengupdate data pada tabel berdasarkan ID_Cookies
async function updateDataInTable(tableName, id, updatedData) {
  try {
    const { error } = await supabase
      .from(tableName)
      .upsert([{ ...updatedData, ID_Cookies: id }], {
        onConflict: ["ID_Cookies"],
      });

    if (error) {
      throw new Error(`Error updating data in ${tableName}: ${error.message}`);
    }
  } catch (e) {
    throw new Error(`Unexpected error: ${e.message}`);
  }
}

// Ekspor fungsi-fungsi agar dapat digunakan di file lain
module.exports = {
  LoadData,
  getDetailById,
  addDataToTable,
  deleteDataFromTable,
  updateDataInTable,
};
