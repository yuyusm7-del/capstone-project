document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const resultId = parseInt(urlParams.get("id"));

  const detailTitle = document.getElementById("detail-title");
  const detailDate = document.getElementById("detail-date");
  const detailMethod = document.getElementById("detail-method");
  const detailTotal = document.getElementById("detail-total");
  const rincianBody = document.getElementById("rincian-table-body");

  // =======================================================
  // ⭐ DATA SIMULASI BANTUAN (Diperlukan karena data rincian TIDAK disimpan) ⭐
  // Kita harus mensimulasikan rincian jika produk ini ditemukan.
  // Ini mengasumsikan logika perhitungan estimasi Anda didasarkan pada komponen ini.
  // =======================================================

  // Data Simulasi Kurs (Diambil dari localStorage jika ada)
  const kursDataAdmin = JSON.parse(localStorage.getItem("kursData")) || [];
  const latestKurs = kursDataAdmin[0]
    ? parseFloat(kursDataAdmin[0].value.replace(",", "."))
    : 17000;

  const mockComponentDetails = {
    "Tongkat Baseball (PROD1)": [
      {
        component: "Kayu Maple",
        avg_price: 150000,
        avg_kurs: 15500,
        price_display: "Rp 150.000",
      },
      {
        component: "Cat Hitam",
        avg_price: 10,
        avg_kurs: 1.0,
        price_display: "$ 10.00",
      },
      {
        component: "Pegangan Karet",
        avg_price: 50000,
        avg_kurs: 16000,
        price_display: "Rp 50.000",
      },
    ],
    "Bola Basket (PROD2)": [
      {
        component: "Kulit Sintetis",
        avg_price: 75000,
        avg_kurs: 15000,
        price_display: "Rp 75.000",
      },
      {
        component: "Karet Dalam",
        avg_price: 5,
        avg_kurs: 1.0,
        price_display: "$ 5.00",
      },
    ],
    // Tambahkan produk lain sesuai kebutuhan
  };

  function loadEstimationDetail() {
    if (isNaN(resultId)) {
      alert("Error: ID Estimasi tidak ditemukan di URL.");
      return;
    }

    // 1. Ambil data hasil estimasi dari LocalStorage
    const storedResults =
      JSON.parse(localStorage.getItem("estimationResults")) || [];

    // 2. Cari data yang cocok dengan ID
    const storedData = storedResults.find((r) => r.id === resultId);

    if (!storedData) {
      alert(`Error: Data dengan ID ${resultId} tidak ditemukan.`);
      return;
    }

    // 3. Gabungkan data tersimpan dengan rincian simulasi
    const productNameKey = storedData.product;
    const rincianData = mockComponentDetails[productNameKey] || [];

    const finalRincian = rincianData.map((r) => {
      let normalizedPrice;

      if (r.avg_kurs === 1.0) {
        // Harga lama dalam USD, konversi menggunakan latestKurs
        normalizedPrice = r.avg_price * latestKurs;
      } else {
        // Harga lama dalam IDR, normalisasi menggunakan rasio kurs
        normalizedPrice = r.avg_price * (latestKurs / r.avg_kurs);
      }

      return {
        component: r.component,
        harga_lama: r.price_display, // Tampilkan harga asli (simulasi)
        kurs_lama: r.avg_kurs.toLocaleString("id-ID"),
        // Format hasil normalisasi ke IDR
        harga_normal: `Rp ${Math.round(normalizedPrice).toLocaleString(
          "id-ID"
        )}`,
      };
    });

    // 4. Isi Metadata
    detailTitle.textContent = `Detail Estimasi : ${storedData.product}`;

    // Konversi timestamp (id) menjadi tanggal dan waktu yang lebih lengkap
    const dateObj = new Date(storedData.id);
    const formattedDate = dateObj.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    detailDate.textContent = formattedDate;
    detailMethod.textContent = storedData.method;
    detailTotal.textContent = storedData.total;

    // 5. Isi Tabel Rincian
    rincianBody.innerHTML = "";
    if (finalRincian.length === 0) {
      const row = rincianBody.insertRow();
      const cell = row.insertCell();
      cell.colSpan = 4;
      cell.textContent = "Rincian komponen tidak ditemukan untuk produk ini.";
      cell.style.textAlign = "center";
      return;
    }

    finalRincian.forEach((r) => {
      const row = rincianBody.insertRow();
      row.insertCell().textContent = r.component;
      row.insertCell().textContent = r.harga_lama;
      row.insertCell().textContent = r.kurs_lama;
      row.insertCell().textContent = r.harga_normal;
    });
  }

  loadEstimationDetail();
});
