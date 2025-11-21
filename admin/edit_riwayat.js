document.addEventListener("DOMContentLoaded", function () {
  const editForm = document.getElementById("edit-procurement-form");
  const componentSelect = document.getElementById("component_select");

  // --- Elemen Modal ---
  const successModal = document.getElementById(
    "custom-edit-procurement-success-modal"
  );
  const successMessage = document.getElementById(
    "edit-procurement-success-message"
  );
  const modalSuccessOkBtn = document.getElementById(
    "modal-edit-procurement-success-ok-btn"
  );

  // --- 1. MUAT DATA LAMA KE FORM SAAT HALAMAN DIBUKA ---
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = parseInt(urlParams.get("id"));

  let procurementData =
    JSON.parse(localStorage.getItem("procurementData")) || [];
  let currentItem = procurementData.find((item) => item.id === itemId);

  function populateForm() {
    if (isNaN(itemId) || !currentItem) {
      alert("ID Riwayat tidak valid atau data tidak ditemukan!");
      window.location.href = "riwayat_pengadaan.html";
      return;
    }

    // Isi dropdown Komponen (Disabled)
    componentSelect.innerHTML = `<option value="${currentItem.component}">${currentItem.component}</option>`;
    componentSelect.disabled = true;

    // Isi input lainnya
    document.getElementById("price").value = currentItem.price.replace(
      /[^0-9.]/g,
      ""
    ); // Membersihkan mata uang untuk input
    document.getElementById("date").value = currentItem.date; // Jika format sudah YYYY-MM-DD
    document.getElementById("kurs").value = currentItem.kurs.replace(
      /[^0-9.]/g,
      ""
    );
    document.getElementById("vendor").value = currentItem.vendor;
  }

  populateForm();

  // --- 2. LOGIKA SIMPAN (SUBMIT FORM) ---
  editForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newPrice = document.getElementById("price").value;
    const newDate = document.getElementById("date").value;
    const newKurs = document.getElementById("kurs").value;
    const newVendor = document.getElementById("vendor").value;

    let procurementData =
      JSON.parse(localStorage.getItem("procurementData")) || [];

    const itemIndex = procurementData.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
      // ⭐ GANTI DATA LAMA DENGAN DATA BARU ⭐
      procurementData[itemIndex].price = newPrice;
      procurementData[itemIndex].date = newDate;
      procurementData[itemIndex].kurs = newKurs;
      procurementData[itemIndex].vendor = newVendor;

      // Simpan kembali array yang sudah diubah ke localStorage
      localStorage.setItem("procurementData", JSON.stringify(procurementData));

      // Tampilkan Modal Sukses
      successMessage.innerHTML = `Riwayat untuk <b>${procurementData[itemIndex].component}</b> berhasil diubah!`;
      successModal.style.display = "flex";
    } else {
      alert("Gagal menyimpan: Riwayat tidak ditemukan.");
    }
  });

  // ⭐ LOGIKA TOMBOL OK MODAL SUKSES (Redirect setelah OK) ⭐
  modalSuccessOkBtn.addEventListener("click", function () {
    successModal.style.display = "none";
    window.location.href = "riwayat_pengadaan.html";
  });
});
