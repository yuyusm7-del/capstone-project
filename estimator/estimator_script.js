document.addEventListener("DOMContentLoaded", function () {
  // =======================================================
  // ⭐ 1. VARIABEL GLOBAL ESTIMATOR ⭐
  // =======================================================
  // ID tombol Ekspor PDF telah dikoreksi agar sesuai dengan HTML
  const btnSimpanEstimasi = document.getElementById("btn-simpan-estimasi");
  const btnExportPdf = document.getElementById("btn-export-pdf");

  const sidebarItems = document.querySelectorAll(
    ".estimator-sidebar .nav-item"
  );
  const actionButtons = document.querySelectorAll(
    ".estimator-actions-row .btn-action"
  );
  const productListContainer = document.getElementById(
    "product-list-container"
  );
  const productSelect = document.getElementById("product-select");
  const btnHitungEstimasi = document.getElementById("btn-hitung-estimasi");
  const estimationResultsBody = document.getElementById(
    "estimation-results-body"
  );
  const totalEstimasiDisplay = document.getElementById("total-estimasi");
  const resultsTableBody = document.getElementById(
    "estimation-results-table-body"
  );
  const resultSearchInput = document.getElementById("result-search-input");

  // =======================================================
  // ⭐ 2. INISIALISASI (Termasuk Setup Logout BARU) ⭐
  // =======================================================

  setupLogout();

  // 2.1. Sidebar Navigation (Redirect)
  sidebarItems.forEach((item) => {
    item.addEventListener("click", function () {
      const pageName = this.getAttribute("data-page");
      if (pageName) {
        window.location.href = `${pageName}.html`;
      }
    });
  });

  // 2.2. Action Buttons (Simulasi Hitung Estimasi)
  actionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      alert("Memulai proses Hitung Estimasi (Simulasi).");
    });
  });

  // =======================================================
  // ⭐ 3. LOGIKA LIHAT DATA PRODUK (AKORDION) ⭐
  // =======================================================

  const componentsData = JSON.parse(localStorage.getItem("componentsData")) || [
    {
      id: 1,
      product: "Tongkat Baseball",
      name: "Kayu Maple",
      quantity: 50,
      unit: "Pcs",
    },
    {
      id: 2,
      product: "Tongkat Baseball",
      name: "Cat Hitam",
      quantity: 5,
      unit: "Liter",
    },
    {
      id: 3,
      product: "Bola Basket",
      name: "Kulit Sintetis",
      quantity: 15,
      unit: "Meter",
    },
  ];
  const productData = JSON.parse(localStorage.getItem("products")) || [
    { kode: "PROD1", nama: "Tongkat Baseball", deskripsi: "Produk utama" },
    { kode: "PROD2", nama: "Bola Basket", deskripsi: "Produk Olahraga" },
  ];

  function renderProductAccordion() {
    if (!productListContainer) return;
    productListContainer.innerHTML = "";

    productData.forEach((product) => {
      const productComponents = componentsData.filter(
        (c) => c.product === product.nama
      );

      const itemHtml = `
              <div class="product-item">
                  <div class="product-header" data-product-name="${
                    product.nama
                  }">
                      <span>${product.nama} (${product.kode})</span>
                      <i class="fas fa-plus expand-icon"></i>
                  </div>
                  <div class="component-details hidden">
                      <table class="component-table-nested">
                          <thead>
                              <tr>
                                  <th style="width: 33%">NAMA KOMPONEN</th>
                                  <th style="width: 33%">KUANTITAS</th>
                                  <th style="width: 33%">SATUAN</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${productComponents
                                .map(
                                  (comp) => `
                                  <tr>
                                      <td>${comp.name}</td>
                                      <td>${comp.quantity}</td>
                                      <td>${comp.unit}</td>
                                  </tr>
                              `
                                )
                                .join("")}
                          </tbody>
                      </table>
                  </div>
              </div>
          `;
      productListContainer.insertAdjacentHTML("beforeend", itemHtml);
    });

    document.querySelectorAll(".product-header").forEach((header) => {
      header.addEventListener("click", function () {
        const item = this.closest(".product-item");
        const details = item.querySelector(".component-details");
        const icon = this.querySelector(".expand-icon");

        item.classList.toggle("expanded");
        details.classList.toggle("hidden");

        if (icon) {
          icon.classList.toggle("fa-plus");
          icon.classList.toggle("fa-minus");
        }
      });
    });
  }

  if (productListContainer) {
    renderProductAccordion();
  }

  // =======================================================
  // ⭐ 4. LOGIKA HITUNG ESTIMASI (Halaman Perhitungan) ⭐
  // =======================================================

  const kursDataAdmin = JSON.parse(localStorage.getItem("kursData")) || [];
  const latestKurs = kursDataAdmin[0]
    ? parseFloat(kursDataAdmin[0].value.replace(",", "."))
    : 17000;

  function populateProductEstimationDropdown() {
    if (!productSelect) return;

    const products = JSON.parse(localStorage.getItem("products")) || [
      { kode: "PROD1", nama: "Tongkat Baseball" },
      { kode: "PROD2", nama: "Bola Basket" },
    ];

    productSelect.innerHTML = '<option value="">-- Pilih Produk --</option>';

    products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.kode;
      option.textContent = `${product.nama} (${product.kode})`;
      productSelect.appendChild(option);
    });
  }

  function calculateAndRenderEstimation() {
    if (!estimationResultsBody) return;

    const mockComponentPrices = [
      { name: "Kayu Maple", avg_price: 150000, avg_kurs: 15500 },
      { name: "Cat Hitam", avg_price: 10, avg_kurs: 1.0 },
      { name: "Sintetis", avg_price: 75000, avg_kurs: 15000 },
    ];

    estimationResultsBody.innerHTML = "";
    let grandTotalIDR = 0;

    mockComponentPrices.forEach((comp) => {
      let normalizedPrice;
      let avgPriceDisplay;

      if (comp.avg_kurs === 1.0) {
        normalizedPrice = comp.avg_price * latestKurs;
        avgPriceDisplay = `$ ${comp.avg_price.toFixed(2)} (Kurs Lama $ ${
          comp.avg_kurs
        })`;
      } else {
        normalizedPrice = comp.avg_price * (latestKurs / comp.avg_kurs);
        avgPriceDisplay = `Rp ${comp.avg_price.toLocaleString("id-ID")}`;
      }

      grandTotalIDR += normalizedPrice;

      const newRow = estimationResultsBody.insertRow();
      newRow.insertCell().textContent = comp.name;
      newRow.insertCell().textContent = avgPriceDisplay;
      newRow.insertCell().textContent = comp.avg_kurs.toLocaleString("id-ID");
      newRow.insertCell().textContent = `Rp ${Math.round(
        normalizedPrice
      ).toLocaleString("id-ID")}`;
    });

    totalEstimasiDisplay.textContent = `RP ${Math.round(
      grandTotalIDR
    ).toLocaleString("id-ID")}.00`;
  }

  if (productSelect) {
    populateProductEstimationDropdown();

    if (btnHitungEstimasi) {
      btnHitungEstimasi.addEventListener("click", function () {
        if (productSelect.value) {
          calculateAndRenderEstimation();
          showToastMessage("Estimasi Berhasil Dihitung!", "success");
        } else {
          showToastMessage("Pilih Produk terlebih dahulu!", "error");
        }
      });
    }
  }

  // =======================================================
  // ⭐ 5. LOGIKA HASIL ESTIMASI (Halaman Hasil) - Diperbarui untuk LocalStorage ⭐
  // =======================================================

  function setupResultActionListeners() {
    document
      .querySelectorAll(".results-table .btn-detail")
      .forEach((button) => {
        button.addEventListener("click", function () {
          const resultId = this.getAttribute("data-id");
          window.location.href = `detail_estimasi.html?id=${resultId}`;
        });
      });
  }

  function loadEstimationResults(filterText = "") {
    if (!resultsTableBody) return;

    // Ambil data dari LocalStorage
    let estimationResultsData = JSON.parse(
      localStorage.getItem("estimationResults")
    ) || [
      // Data default
      {
        id: 1,
        date: "2025-11-20",
        product: "Tongkat Baseball (PROD1)",
        method: "Rata-rata",
        total: "RP 1.250.000.00",
      },
      {
        id: 2,
        date: "2025-11-19",
        product: "Bola Basket (PROD2)",
        method: "Terendah",
        total: "RP 780.000.00",
      },
    ];

    resultsTableBody.innerHTML = "";
    const lowerCaseFilter = filterText.toLowerCase();

    const filteredResults = estimationResultsData.filter((result) =>
      result.product.toLowerCase().includes(lowerCaseFilter)
    );

    // Sortir berdasarkan tanggal terbaru
    filteredResults.sort((a, b) => new Date(b.date) - new Date(a.date));

    filteredResults.forEach((result) => {
      const newRow = resultsTableBody.insertRow();
      const formattedDate = new Date(result.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      newRow.insertCell().textContent = formattedDate;
      newRow.insertCell().textContent = result.product;
      newRow.insertCell().textContent = result.method;
      newRow.insertCell().textContent = result.total;

      const actionCell = newRow.insertCell();
      actionCell.classList.add("action-cells");
      actionCell.innerHTML = `
              <button class="btn-detail" data-id="${result.id}">Detail</button>
          `;
    });

    setupResultActionListeners();
  }

  if (resultsTableBody) {
    loadEstimationResults();

    if (resultSearchInput) {
      resultSearchInput.addEventListener("input", function () {
        loadEstimationResults(this.value);
      });
    }
  }

  // =======================================================
  // ⭐ 6. LOGIKA SIMPAN & EKSPOR HASIL ESTIMASI (KOREKSI ID EKSPOR) ⭐
  // =======================================================

  // --- A. Simpan Hasil Estimasi ---
  if (btnSimpanEstimasi) {
    // Hapus listener lama dengan cloning
    const newBtnSimpan = btnSimpanEstimasi.cloneNode(true);
    btnSimpanEstimasi.parentNode.replaceChild(newBtnSimpan, btnSimpanEstimasi);

    newBtnSimpan.addEventListener("click", function () {
      const totalEstimasiText = totalEstimasiDisplay.textContent;

      if (totalEstimasiText.includes("RP") && productSelect.value) {
        let results =
          JSON.parse(localStorage.getItem("estimationResults")) || [];

        const newResult = {
          id: Date.now(),
          date: new Date().toISOString().split("T")[0],
          product:
            productSelect.options[productSelect.selectedIndex]?.text ||
            "Produk Tidak Dikenal",
          method: "Simpan Manual",
          total: totalEstimasiText,
        };
        results.push(newResult);
        localStorage.setItem("estimationResults", JSON.stringify(results));
        showToastMessage(
          "Hasil estimasi berhasil disimpan dan akan muncul di Riwayat!",
          "success"
        );
      } else if (!productSelect.value) {
        showToastMessage("Pilih produk terlebih dahulu.", "error");
      } else {
        showToastMessage(
          "Hitung estimasi terlebih dahulu sebelum menyimpan.",
          "error"
        );
      }
    });
  }

  // --- B. Ekspor ke PDF (Implementasi Nyata) ---
  if (btnExportPdf) {
    // Menggunakan ID yang dikoreksi: btnExportPdf
    // Hapus listener lama dengan cloning
    const newBtnEkspor = btnExportPdf.cloneNode(true);
    btnExportPdf.parentNode.replaceChild(newBtnEkspor, btnExportPdf);

    newBtnEkspor.addEventListener("click", function () {
      const totalEstimasiText = totalEstimasiDisplay.textContent;

      if (!totalEstimasiText.includes("RP")) {
        showToastMessage(
          "Tidak ada hasil untuk diekspor. Hitung estimasi terlebih dahulu.",
          "error"
        );
        return;
      }

      // Ambil konten saat ini (LOKAL)
      const content = document.getElementById("estimation-content-area");

      if (!content) {
        showToastMessage(
          "Error: Konten estimasi tidak ditemukan di HTML (ID #estimation-content-area).",
          "error"
        );
        return;
      }

      showToastMessage("Membuat file PDF, mohon tunggu...", "info");

      const options = {
        margin: 1,
        filename: `Estimasi_${new Date()
          .toLocaleDateString("id-ID")
          .replace(/\//g, "-")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
      };

      // Memanggil fungsi konversi
      html2pdf().set(options).from(content).save();

      setTimeout(() => {
        showToastMessage("Unduhan PDF dimulai!", "success");
      }, 1000);
    });
  }
});

// ============================================================
// ⭐ FUNGSI GLOBAL (LOGOUT & TOAST) - DITEMPATKAN DI LUAR DOMContentLoaded ⭐
// ============================================================

// SETUP LOGOUT - UNTUK SEMUA HALAMAN (SISTEM BARU)
function setupLogout() {
  const logoutLink = document.querySelector(".logout-link");

  if (logoutLink) {
    console.log("Logout link found, setting up event listener");
    const newLogoutLink = logoutLink.cloneNode(true);
    logoutLink.parentNode.replaceChild(newLogoutLink, logoutLink);

    newLogoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      console.log("Logout clicked - NEW SYSTEM");
      showLogoutConfirmation();
    });

    removeOldLogoutHandlers();
  } else {
    console.log("Logout link not found");
  }
}

// HAPUS HANDLER LOGOUT LAMA
function removeOldLogoutHandlers() {
  const oldDeleteModal = document.getElementById("custom-delete-modal");
  const oldSuccessModal = document.getElementById("custom-success-modal");

  if (oldDeleteModal) {
    oldDeleteModal.style.display = "none";
    oldDeleteModal.removeAttribute("id");
  }

  if (oldSuccessModal) {
    oldSuccessModal.style.display = "none";
    oldSuccessModal.removeAttribute("id");
  }

  const oldConfirmBtn = document.getElementById("modal-confirm-btn");
  const oldCancelBtn = document.getElementById("modal-cancel-btn");

  if (oldConfirmBtn) {
    const newConfirmBtn = oldConfirmBtn.cloneNode(true);
    oldConfirmBtn.parentNode.replaceChild(newConfirmBtn, oldConfirmBtn);
  }

  if (oldCancelBtn) {
    const newCancelBtn = oldCancelBtn.cloneNode(true);
    oldCancelBtn.parentNode.replaceChild(newCancelBtn, oldCancelBtn);
  }
}

// SHOW LOGOUT CONFIRMATION MODAL - UNTUK SEMUA HALAMAN
function showLogoutConfirmation() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    username: "User Estimator",
  };

  const existingModal = document.querySelector(".logout-modal-overlay");
  if (existingModal) {
    document.body.removeChild(existingModal);
  }

  const modal = document.createElement("div");
  modal.className = "logout-modal-overlay";
  modal.innerHTML = `
      <div class="logout-modal">
          <div class="logout-modal-icon">
              <i class="fas fa-sign-out-alt"></i>
          </div>
          <div class="logout-modal-content">
              <h3>Konfirmasi Logout</h3>
              <p>Anda akan logout dari akun <strong>${currentUser.username}</strong></p>
              <p class="logout-warning">Pastikan Anda telah menyimpan semua pekerjaan yang belum disimpan.</p>
          </div>
          <div class="logout-modal-actions">
              <button class="logout-btn-cancel">Batal</button>
              <button class="logout-btn-confirm">Ya, Logout</button>
          </div>
      </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";

  const cancelBtn = modal.querySelector(".logout-btn-cancel");
  const confirmBtn = modal.querySelector(".logout-btn-confirm");

  const cancelHandler = function (e) {
    e.stopPropagation();
    closeLogoutModal(modal);
  };

  const confirmHandler = function (e) {
    e.stopPropagation();
    closeLogoutModal(modal);
    performLogout();
  };

  cancelBtn.addEventListener("click", cancelHandler);
  confirmBtn.addEventListener("click", confirmHandler);

  const modalClickHandler = function (e) {
    if (e.target === modal) {
      closeLogoutModal(modal);
    }
  };
  modal.addEventListener("click", modalClickHandler);

  const escHandler = function (e) {
    if (e.key === "Escape") {
      closeLogoutModal(modal);
    }
  };
  document.addEventListener("keydown", escHandler);

  modal._handlers = {
    cancel: cancelHandler,
    confirm: confirmHandler,
    modalClick: modalClickHandler,
    esc: escHandler,
  };

  cancelBtn.focus();
}

// CLOSE LOGOUT MODAL
function closeLogoutModal(modal) {
  if (modal && modal.parentNode) {
    if (modal._handlers) {
      document.removeEventListener("keydown", modal._handlers.esc);
    }
    modal.parentNode.removeChild(modal);
  }
  document.body.style.overflow = "";
}

// PERFORM LOGOUT - UNTUK SEMUA HALAMAN
function performLogout() {
  console.log("Performing logout...");
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    username: "User Estimator",
  };

  if (typeof logLogoutActivity === "function") {
    logLogoutActivity(currentUser.username);
  }

  localStorage.removeItem("currentUser");
  showLogoutMessage();

  setTimeout(() => {
    redirectToLogin();
  }, 2000);
}

// LOGOUT MESSAGE - UNTUK SEMUA HALAMAN
function showLogoutMessage() {
  const existingMessage = document.querySelector(".logout-success-message");
  if (existingMessage) {
    document.body.removeChild(existingMessage);
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = "logout-success-message";
  messageDiv.innerHTML = `
      <div class="logout-message-content">
          <i class="fas fa-check-circle"></i>
          <div class="logout-message-text">
              <strong>Logout Berhasil</strong>
              <span>Mengarahkan ke halaman login...</span>
          </div>
      </div>
  `;

  document.body.appendChild(messageDiv);

  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 3000);
}

// REDIRECT KE LOGIN
function redirectToLogin() {
  console.log("Redirecting to login page...");
  window.location.href = "../index.html";
}

// SHOW TOAST MESSAGE KUSTOM (Untuk Berhasil/Gagal Estimasi)
function showToastMessage(message, type = "success") {
  const existingMessage = document.querySelector(".custom-toast-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  let iconClass = "";
  let bgColor = "";

  if (type === "success") {
    iconClass = "fas fa-check-circle";
    bgColor = "#28a745";
  } else if (type === "error") {
    iconClass = "fas fa-exclamation-triangle";
    bgColor = "#dc3545";
  } else {
    iconClass = "fas fa-info-circle";
    bgColor = "#007bff";
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = "custom-toast-message";
  messageDiv.innerHTML = `
      <div class="toast-message-content" style="background-color: ${bgColor};">
          <i class="${iconClass}"></i>
          <div class="toast-message-text">
              <strong>${message}</strong>
              <span>Tinjau detail hasil di bawah ini.</span>
          </div>
      </div>
  `;

  document.body.appendChild(messageDiv);

  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 4000);
}
