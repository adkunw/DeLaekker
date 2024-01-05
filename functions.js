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

// Fungsi untuk mengambil data stok
// async function LoadStokData() {
//   try {
//     const stokData = [];

//     const { data: cookiesData, error: cookiesError } = await supabase
//       .from("T_Data_Cookies")
//       .select("ID_Cookies, Nama");

//     if (cookiesError) {
//       throw new Error(`Error fetching cookies data: ${cookiesError.message}`);
//     }

//     for (const cookie of cookiesData) {
//       const { data: stockData, error: stockError } = await supabase
//         .from("T_Stock")
//         .select("ID_Stok, created_at, ID_Cookies, Jumlah, keterangan")
//         .eq("ID_Cookies", cookie.ID_Cookies)
//         .order("created_at", { ascending: false });

//       if (stockError) {
//         throw new Error(`Error fetching stock data: ${stockError.message}`);
//       }
//       console.log("Stock Data:", stockData);
//       const totalQuantity = stockData.reduce(
//         (total, item) => total + item.Jumlah,
//         0
//       );

//       stokData.push({
//         ID_Stok: cookie.ID_Stok,
//         Nama_Produk: cookie.Nama,
//         ID_Cookies: cookie.ID_Cookies,
//         Jumlah: totalQuantity,
//         Details: stockData,
//       });
//     }

//     return stokData;
//   } catch (error) {
//     throw new Error(`Unexpected error: ${error.message}`);
//   }
// }

// Fungsi untuk mengambil data detail stok
async function LoadStockDetails(ID_Cookies) {
  try {
    const stockData = await supabase
      .from("T_Stock")
      .select("*")
      .order("created_at", { ascending: false });

    if (stockData.error) {
      throw new Error(
        `Error fetching stock data details: ${stockData.error.message}`
      );
    }

    // Filter the stock data based on ID_Cookies
    const filteredData = stockData.data.filter(
      (item) => item.ID_Cookies === ID_Cookies
    );

    return filteredData;
  } catch (error) {
    throw new Error(`Unexpected error: ${error.message}`);
  }
}

async function LoadProductData(ID_Cookies) {
  try {
    const { data: productData, error: productError } = await supabase
      .from("T_Data_Cookies")
      .select("Nama")
      .eq("ID_Cookies", ID_Cookies)
      .single();
    // console.log(productData);
    if (productError) {
      throw new Error(`Error fetching product data: ${productError.message}`);
    }

    return productData;
  } catch (error) {
    throw new Error(`Unexpected error: ${error.message}`);
  }
}

async function LoadFullStockDetails() {
  try {
    const stockDetails = await supabase
      .from("T_Stock")
      .select("*")
      .order("created_at", { ascending: false });

    if (stockDetails.error) {
      throw new Error(
        `Error fetching stock details: ${stockDetails.error.message}`
      );
    }

    const fullStockDetails = await Promise.all(
      stockDetails.data.map(async (detail) => {
        const productData = await LoadProductData(detail.ID_Cookies);
        // console.log(productData.Nama_Produk);
        return {
          ID_Stok: detail.ID_Stok,
          created_at: detail.created_at,
          Nama_Produk: productData ? productData.Nama : undefined,
          Jumlah: detail.Jumlah,
          keterangan: detail.keterangan,
        };
      })
    );

    return fullStockDetails;
  } catch (error) {
    throw new Error(`Unexpected error: ${error.message}`);
  }
}

async function LoadStokData() {
  try {
    const stockData = [];

    const { data: cookiesData, error: cookiesError } = await supabase
      .from("T_Data_Cookies")
      .select("ID_Cookies, Nama");

    if (cookiesError) {
      throw new Error(`Error fetching cookies data: ${cookiesError.message}`);
    }

    for (const cookie of cookiesData) {
      const totalQuantity = await getTotalQuantity(cookie.ID_Cookies);

      stockData.push({
        ID_Cookies: cookie.ID_Cookies,
        Nama_Produk: cookie.Nama,
        Jumlah: totalQuantity,
      });
    }

    return stockData;
  } catch (error) {
    throw new Error(`Unexpected error: ${error.message}`);
  }
}

async function getTotalQuantity(ID_Cookies) {
  try {
    const stockDetails = await LoadStockDetails(ID_Cookies);
    const totalQuantity = stockDetails
      .filter((item) => item.ID_Cookies === ID_Cookies)
      .reduce((total, item) => total + item.Jumlah, 0);

    return totalQuantity;
  } catch (error) {
    throw new Error(`Error calculating total quantity: ${error.message}`);
  }
}

// Ekspor fungsi-fungsi agar dapat digunakan di file lain
module.exports = {
  LoadData,
  getDetailById,
  addDataToTable,
  deleteDataFromTable,
  updateDataInTable,
  LoadStokData,
  LoadStockDetails,
  LoadFullStockDetails,
};
