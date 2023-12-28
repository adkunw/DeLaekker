// Impor modul Express dan inisialisasi aplikasi Express
const { urlencoded } = require("express");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 3000;
// const db = require("./config/db");
const func = require("./functions");
// const router = express.Router();
// const func = require("./functions");

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Penanganan permintaan GET untuk rute root ("/") dan pengiriman file "index.html"
app.get("/", (req, res) => {
  res.render("index", {
    layout: "layout/main-layout",
    nama: "Kunto",
    title: "home page",
  });
});

// Penanganan permintaan GET untuk rute "/contact" dan pengiriman file "contact.html"
app.get("/cookies", async (req, res) => {
  try {
    const cookies = await func.LoadData();

    res.render("cookies_data", {
      cookies,
      layout: "layout/main-layout",
      title: "Cookies Data Page",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Routing untuk halaman detail cookies berdasarkan ID_Cookies
app.get("/detail/:id_cookies", async (req, res) => {
  try {
    const { id_cookies } = req.params;

    // Gunakan fungsi getDetailById untuk mendapatkan detail data berdasarkan ID
    const cookiesDetail = await func.getDetailById(parseInt(id_cookies, 10));

    if (cookiesDetail) {
      res.render("cookies_detail", {
        layout: "layout/main-layout",
        cookiesDetail,
        title: "Detail Cookies",
      });
    } else {
      res.status(404).send("Data cookies tidak ditemukan");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/cookies_add", (req, res) => {
  res.render("cookies_add", {
    layout: "layout/main-layout",
    title: "Add Data Cookies",
  });
});

// Routing untuk menampilkan form tambah data
app.post("/add_cookies", async (req, res) => {
  try {
    const { namaCookies, hargaJual, hargaProduksi, detailCookies, picLink } =
      req.body;

    // Mendapatkan tanggal sekarang
    const currentDate = new Date();

    // Menambahkan data ke tabel "T_Data_Cookies" menggunakan fungsi addDataToTable
    await func.addDataToTable("T_Data_Cookies", {
      Nama: namaCookies,
      Harga_Jual: hargaJual,
      Harga_Produksi: hargaProduksi,
      Detail: detailCookies,
      PIC: picLink,
      date: currentDate.toISOString(), // Menggunakan ISO format untuk menyimpan tanggal
    });

    // Redirect ke halaman utama setelah menambahkan data
    res.redirect("/cookies");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint untuk delete_cookies
app.get("/delete_cookies/:id_cookies", async (req, res) => {
  try {
    const { id_cookies } = req.params;

    // Menggunakan fungsi deleteDataFromTable untuk menghapus data
    await func.deleteDataFromTable("T_Data_Cookies", id_cookies);

    // Redirect kembali ke halaman cookies setelah menghapus
    res.redirect("/cookies");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint untuk halaman update_cookies
app.get("/update_cookies/:id_cookies", async (req, res) => {
  try {
    const { id_cookies } = req.params;

    // Menggunakan fungsi getDetailById untuk mendapatkan data cookies berdasarkan ID
    const cookiesDetail = await func.getDetailById(id_cookies);

    // Render halaman update_cookies dengan data cookiesDetail
    res.render("cookies_update", {
      layout: "layout/main-layout",
      title: "Update Data Cookies",
      cookiesDetail,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint untuk update_cookies (menangani form submission)
app.post("/update_cookies/:id_cookies", async (req, res) => {
  try {
    const { id_cookies } = req.params;
    const { namaCookies, hargaJual, hargaProduksi, detailCookies, picLink } =
      req.body;

    // Mendapatkan tanggal sekarang
    const currentDate = new Date();

    // Menggunakan fungsi updateDataInTable untuk mengupdate data
    await func.updateDataInTable("T_Data_Cookies", id_cookies, {
      Nama: namaCookies,
      Harga_Jual: hargaJual,
      Harga_Produksi: hargaProduksi,
      Detail: detailCookies,
      PIC: picLink,
      date: currentDate.toISOString(),
    });

    // Redirect kembali ke halaman cookies setelah mengupdate
    res.redirect("/cookies");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Middleware untuk menangani rute yang tidak sesuai
app.use((req, res) => {
  res.status(404);
  res.send("Page not found: 404");
});

// Memulai server Express pada port yang ditentukan
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
