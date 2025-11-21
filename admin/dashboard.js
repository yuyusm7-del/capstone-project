document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".nav-item");

  // --- Modal Elements ---
  const deleteModal = document.getElementById("custom-delete-modal");
  const successModal = document.getElementById("custom-success-modal");
  const modalMessage = document.getElementById("modal-message");
  const successMessage = document.getElementById("success-message");
  const modalConfirmBtn = document.getElementById("modal-confirm-btn");
  const modalCancelBtn = document.getElementById("modal-cancel-btn");
  const modalSuccessOkBtn = document.getElementById("modal-success-ok-btn");

  let productToDeleteCode = null;
  let componentToDeleteId = null;
  let componentToDeleteLabel = null;
  let procurementToDeleteId = null;
  let userToDeleteId = null;
  let userToDeleteName = null;

  // ============================================================
  // SIDEBAR
  // ============================================================
  function removeActiveClass() {
    navItems.forEach((item) => item.classList.remove("active"));
  }

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      const pageName = this.getAttribute("data-page");
      removeActiveClass();
      this.classList.add("active");

      if (pageName) {
        e.preventDefault();
        window.location.href = `${pageName}.html`;
      }
    });
  });

  // ============================================================
  // LOGOUT
  // ============================================================
  const logoutLink = document.querySelector(".logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      deleteModal.style.display = "flex";

      modalMessage.innerHTML = `Anda yakin ingin Logout?`;

      modalConfirmBtn.onclick = () => {
        deleteModal.style.display = "none";
        successMessage.textContent = "Anda berhasil Logout (Simulasi)";
        successModal.style.display = "flex";
      };

      modalCancelBtn.onclick = () => {
        deleteModal.style.display = "none";
      };
    });
  }

  // ============================================================
  // PRODUK
  // ============================================================
  const productTableBody = document.querySelector(".product-table tbody");
  const searchInput = document.querySelector(
    '.search-container input[type="text"]'
  );
  const addButton = document.querySelector(".add-button");

  function loadProducts(filterText = "") {
    if (!productTableBody) return;

    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    productTableBody.innerHTML = "";

    const lowerCaseFilter = filterText.toLowerCase();
    const filteredProducts = allProducts.filter((product) =>
      product.kode.toLowerCase().includes(lowerCaseFilter)
    );

    filteredProducts.forEach((product) => {
      const newRow = productTableBody.insertRow();
      newRow.insertCell().textContent = product.kode;
      newRow.insertCell().textContent = product.nama;
      newRow.insertCell().textContent = product.deskripsi;

      const actionCell = newRow.insertCell();
      actionCell.classList.add("action-cells");
      actionCell.innerHTML = `
        <button class="btn-edit" data-kode="${product.kode}">Edit</button>
        <button class="btn-hapus" data-kode="${product.kode}">Hapus</button>
      `;
    });

    setupProductActionListeners();
  }

  function setupProductActionListeners() {
    const editButtons = document.querySelectorAll(".product-table .btn-edit");
    const hapusButtons = document.querySelectorAll(".product-table .btn-hapus");

    editButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productCode = this.getAttribute("data-kode");
        window.location.href = `edit_produk.html?kode=${productCode}`;
      });
    });

    hapusButtons.forEach((button) => {
      button.addEventListener("click", function () {
        productToDeleteCode = this.getAttribute("data-kode");
        componentToDeleteId = null;
        componentToDeleteLabel = null;
        procurementToDeleteId = null;
        userToDeleteId = null;
        userToDeleteName = null;

        modalMessage.innerHTML = `Anda yakin ingin menghapus produk <b>${productToDeleteCode}</b>?`;
        deleteModal.style.display = "flex";
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      loadProducts(this.value);
    });
  }

  if (addButton) {
    addButton.addEventListener("click", function () {
      window.location.href = "tambah_produk.html";
    });
  }

  if (productTableBody) loadProducts();

  // ============================================================
  // RIWAYAT PENGADAAN
  // ============================================================
  const procurementTableBody = document.querySelector(
    ".procurement-table tbody"
  );
  const procurementFilter = document.getElementById("procurement-filter");
  const addProcurementButton = document.querySelector(
    ".add-procurement-button"
  );
  const exportCsvButton = document.querySelector(".export-csv-button");

  let procurementData =
    JSON.parse(localStorage.getItem("procurementData")) || [];
  if (!localStorage.getItem("procurementData")) {
    localStorage.setItem("procurementData", JSON.stringify(procurementData));
  }

  function populateProcurementFilter() {
    if (!procurementFilter) return;

    const uniqueComponents = [
      ...new Set(procurementData.map((item) => item.component)),
    ];

    procurementFilter.innerHTML = `<option value="">-- Filter per Produk --</option>`;

    uniqueComponents.forEach((componentName) => {
      const option = document.createElement("option");
      option.value = componentName;
      option.textContent = componentName;
      procurementFilter.appendChild(option);
    });
  }

  function loadProcurements(filterComponent = "") {
    if (!procurementTableBody) return;

    procurementData = JSON.parse(localStorage.getItem("procurementData")) || [];
    procurementTableBody.innerHTML = "";

    const filtered = procurementData.filter(
      (item) => filterComponent === "" || item.component === filterComponent
    );

    filtered.forEach((item) => {
      const newRow = procurementTableBody.insertRow();

      newRow.insertCell().textContent = item.component;
      newRow.insertCell().textContent = item.price;
      newRow.insertCell().textContent = item.date;
      newRow.insertCell().textContent = item.kurs;
      newRow.insertCell().textContent = item.vendor;

      const actionCell = newRow.insertCell();
      actionCell.classList.add("action-cells");

      actionCell.innerHTML = `
        <button class="btn-edit" data-id="${item.id}">Edit</button>
        <button class="btn-hapus" data-id="${item.id}" data-name="${item.component}">Hapus</button>
      `;
    });

    setupProcurementActionListeners();
  }

  function setupProcurementActionListeners() {
    const editBtns = document.querySelectorAll(".procurement-table .btn-edit");
    const deleteBtns = document.querySelectorAll(
      ".procurement-table .btn-hapus"
    );

    editBtns.forEach((button) => {
      button.addEventListener("click", function () {
        const itemId = this.getAttribute("data-id");
        window.location.href = `edit_riwayat.html?id=${itemId}`;
      });
    });

    deleteBtns.forEach((button) => {
      button.addEventListener("click", function () {
        procurementToDeleteId = this.getAttribute("data-id");
        productToDeleteCode = null;
        componentToDeleteId = null;
        componentToDeleteLabel = null;
        userToDeleteId = null;
        userToDeleteName = null;

        modalMessage.innerHTML = `
          Anda yakin ingin menghapus Riwayat <b>${this.getAttribute(
            "data-name"
          )}</b>?
        `;

        deleteModal.style.display = "flex";
      });
    });
  }

  // ============================================================
  // EXPORT XLSX (OPSI B)
  // ============================================================
  function exportProcurementToXLSX() {
    let procurementData =
      JSON.parse(localStorage.getItem("procurementData")) || [];

    const filter = procurementFilter ? procurementFilter.value : "";

    const filteredData = procurementData.filter(
      (item) => filter === "" || item.component === filter
    );

    const formattedData = filteredData.map((item) => ({
      KOMPONEN: item.component,
      HARGA: item.price,
      TANGGAL: item.date,
      KURS: item.kurs,
      VENDOR: item.vendor,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const columnWidths = Object.keys(formattedData[0] || {}).map((key) => ({
      wch: key.length + 10,
    }));
    worksheet["!cols"] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Pengadaan");

    XLSX.writeFile(workbook, "riwayat_pengadaan.xlsx");
  }

  if (exportCsvButton) {
    exportCsvButton.addEventListener("click", () => {
      exportProcurementToXLSX();
    });
  }

  if (procurementTableBody) {
    populateProcurementFilter();
    loadProcurements();

    procurementFilter.addEventListener("change", function () {
      loadProcurements(this.value);
    });
  }

  if (addProcurementButton) {
    addProcurementButton.addEventListener("click", function () {
      window.location.href = "tambah_riwayat.html";
    });
  }

  // ============================================================
  // KOMPONEN
  // ============================================================
  const componentTableBody = document.querySelector(".component-table tbody");
  const productFilter = document.getElementById("product-filter");
  const addComponentButton = document.querySelector(".add-component-button");

  function populateProductFilter() {
    if (!productFilter) return;

    const products = JSON.parse(localStorage.getItem("products")) || [];

    productFilter.innerHTML = `<option value="">-- Tampilkan Semua Produk --</option>`;

    products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.nama;
      option.textContent = product.nama;
      productFilter.appendChild(option);
    });
  }

  function loadComponents(filterProduct = "") {
    if (!componentTableBody) return;

    let componentsData =
      JSON.parse(localStorage.getItem("componentsData")) || [];

    componentTableBody.innerHTML = "";

    const filtered = componentsData.filter(
      (c) => filterProduct === "" || c.product === filterProduct
    );

    filtered.forEach((component) => {
      const newRow = componentTableBody.insertRow();

      newRow.insertCell().textContent = component.product;
      newRow.insertCell().textContent = component.name;
      newRow.insertCell().textContent = component.quantity;
      newRow.insertCell().textContent = component.unit;

      const actionCell = newRow.insertCell();
      actionCell.classList.add("action-cells");

      actionCell.innerHTML = `
        <button class="btn-edit" data-id="${component.id}">Edit</button>
        <button class="btn-hapus" data-id="${component.id}" data-name="${component.name}">Hapus</button>
      `;
    });

    setupComponentActionListeners();
  }

  function setupComponentActionListeners() {
    const editBtns = document.querySelectorAll(".component-table .btn-edit");
    const deleteBtns = document.querySelectorAll(".component-table .btn-hapus");

    editBtns.forEach((button) => {
      button.addEventListener("click", function () {
        window.location.href = `edit_komponen.html?id=${this.getAttribute(
          "data-id"
        )}`;
      });
    });

    deleteBtns.forEach((button) => {
      button.addEventListener("click", function () {
        componentToDeleteId = this.getAttribute("data-id");
        componentToDeleteLabel = this.getAttribute("data-name");
        productToDeleteCode = null;
        procurementToDeleteId = null;
        userToDeleteId = null;
        userToDeleteName = null;

        modalMessage.innerHTML = `Anda yakin ingin menghapus komponen <b>${componentToDeleteLabel}</b>?`;
        deleteModal.style.display = "flex";
      });
    });
  }

  if (addComponentButton) {
    addComponentButton.addEventListener("click", function () {
      window.location.href = "tambah_komponen.html";
    });
  }

  if (componentTableBody) {
    populateProductFilter();
    loadComponents();

    productFilter.addEventListener("change", function () {
      loadComponents(this.value);
    });
  }

  // ============================================================
  // MANAJEMEN USER - FIXED VERSION
  // ============================================================
  const userTableBody = document.getElementById("user-table-body");
  const addUserButton = document.querySelector(".add-user-button");

  // Data User
  let userData = JSON.parse(localStorage.getItem("userData")) || [
    {
      id: 101,
      username: "Admin",
      role: "Administrator",
      status: "Aktif",
      date_created: "12/11/2025",
    },
    {
      id: 102,
      username: "Estimator",
      role: "Estimator",
      status: "Aktif",
      date_created: "12/11/2025",
    },
    {
      id: 103,
      username: "Guest",
      role: "User",
      status: "Nonaktif",
      date_created: "13/11/2025",
    },
  ];

  // Inisialisasi localStorage User jika kosong
  if (JSON.parse(localStorage.getItem("userData")) === null) {
    localStorage.setItem("userData", JSON.stringify(userData));
  }

  function loadUserTable() {
    if (!userTableBody) return;

    userData = JSON.parse(localStorage.getItem("userData")) || [];
    userTableBody.innerHTML = "";

    if (userData.length === 0) {
      const emptyRow = userTableBody.insertRow();
      const emptyCell = emptyRow.insertCell();
      emptyCell.colSpan = 5;
      emptyCell.textContent = "Tidak ada data user";
      emptyCell.style.textAlign = "center";
      emptyCell.style.padding = "20px";
      emptyCell.style.color = "#666";
      return;
    }

    userData.forEach((user) => {
      const newRow = userTableBody.insertRow();

      newRow.insertCell().textContent = user.username;
      newRow.insertCell().textContent = user.role;

      // Status Kolom dengan Badge
      const statusCell = newRow.insertCell();
      statusCell.innerHTML = `
        <span class="status-badge status-${user.status.toLowerCase()}">
          ${user.status}
        </span>
      `;

      newRow.insertCell().textContent = user.date_created;

      const actionCell = newRow.insertCell();
      actionCell.classList.add("action-cells");
      actionCell.innerHTML = `
        <button class="btn-edit" data-id="${user.id}">Edit</button>
        <button class="btn-hapus" data-id="${user.id}" data-name="${user.username}">Hapus</button>
      `;
    });

    setupUserActionListeners();
  }

  function setupUserActionListeners() {
    const editBtns = document.querySelectorAll(".user-table .btn-edit");
    const deleteBtns = document.querySelectorAll(".user-table .btn-hapus");

    editBtns.forEach((button) => {
      button.addEventListener("click", function () {
        const userId = this.getAttribute("data-id");
        window.location.href = `edit_user.html?id=${userId}`;
      });
    });

    deleteBtns.forEach((button) => {
      button.addEventListener("click", function () {
        const userId = this.getAttribute("data-id");
        const userName = this.getAttribute("data-name");

        userToDeleteId = userId;
        userToDeleteName = userName;
        productToDeleteCode = null;
        componentToDeleteId = null;
        componentToDeleteLabel = null;
        procurementToDeleteId = null;

        modalMessage.innerHTML = `Anda yakin ingin menghapus user <b>${userName}</b>?`;
        deleteModal.style.display = "flex";
      });
    });
  }

  // --- AKTIVASI SAAT HALAMAN USER DIMUAT ---
  if (userTableBody) {
    loadUserTable();
  }

  // --- LOGIKA TOMBOL TAMBAH USER ---
  if (addUserButton) {
    addUserButton.addEventListener("click", function () {
      window.location.href = "tambah_user.html";
    });
  }

  // ============================================================
  // MODAL HAPUS HANDLER - UNTUK SEMUA FITUR
  // ============================================================
  modalConfirmBtn.addEventListener("click", function () {
    if (productToDeleteCode) {
      // Hapus produk
      let products = JSON.parse(localStorage.getItem("products")) || [];
      products = products.filter((p) => p.kode !== productToDeleteCode);
      localStorage.setItem("products", JSON.stringify(products));
      successMessage.textContent = `Produk ${productToDeleteCode} berhasil dihapus!`;
      if (productTableBody) loadProducts(searchInput ? searchInput.value : "");
    } else if (componentToDeleteId) {
      // Hapus komponen
      let componentsData =
        JSON.parse(localStorage.getItem("componentsData")) || [];
      componentsData = componentsData.filter(
        (c) => c.id !== parseInt(componentToDeleteId)
      );
      localStorage.setItem("componentsData", JSON.stringify(componentsData));
      successMessage.textContent = `Komponen ${componentToDeleteLabel} berhasil dihapus!`;
      if (componentTableBody) loadComponents(productFilter.value);
    } else if (procurementToDeleteId) {
      // Hapus riwayat
      let procurementData =
        JSON.parse(localStorage.getItem("procurementData")) || [];
      procurementData = procurementData.filter(
        (item) => item.id != procurementToDeleteId
      );
      localStorage.setItem("procurementData", JSON.stringify(procurementData));
      successMessage.textContent = `Riwayat berhasil dihapus!`;
      if (procurementTableBody)
        loadProcurements(procurementFilter ? procurementFilter.value : "");
    } else if (userToDeleteId) {
      // HAPUS USER
      let userData = JSON.parse(localStorage.getItem("userData")) || [];
      userData = userData.filter((user) => user.id != userToDeleteId);
      localStorage.setItem("userData", JSON.stringify(userData));
      successMessage.textContent = `User ${userToDeleteName} berhasil dihapus!`;
      if (userTableBody) loadUserTable();
    }

    deleteModal.style.display = "none";
    successModal.style.display = "flex";

    // Reset semua variabel
    productToDeleteCode = null;
    componentToDeleteId = null;
    componentToDeleteLabel = null;
    procurementToDeleteId = null;
    userToDeleteId = null;
    userToDeleteName = null;
  });

  modalCancelBtn.addEventListener("click", function () {
    deleteModal.style.display = "none";

    // Reset semua variabel
    productToDeleteCode = null;
    componentToDeleteId = null;
    componentToDeleteLabel = null;
    procurementToDeleteId = null;
    userToDeleteId = null;
    userToDeleteName = null;
  });

  modalSuccessOkBtn.addEventListener("click", function () {
    successModal.style.display = "none";
  });
});

// =======================================================
// ⭐ LOGIKA KURS JISDOR ⭐
// =======================================================
const kursTableBody = document.getElementById("kurs-table-body");
const jisdorForm = document.getElementById("jisdor-form");
const apiButton = document.querySelector(".btn-integrasi-api");
const jisdorAlert = document.getElementById("jisdor-alert");

// Data Kurs Simulasi
let kursData = JSON.parse(localStorage.getItem("kursData")) || [
  { date: "2025-11-19", value: "15.900" },
  { date: "2025-11-18", value: "15.950" },
  { date: "2025-11-17", value: "15.920" },
];

// Inisialisasi localStorage Kurs jika kosong
if (JSON.parse(localStorage.getItem("kursData")) === null) {
  localStorage.setItem("kursData", JSON.stringify(kursData));
}

function loadKursTable() {
  if (!kursTableBody) return;

  kursData = JSON.parse(localStorage.getItem("kursData")) || [];
  kursTableBody.innerHTML = "";

  // Urutkan berdasarkan tanggal terbaru
  kursData.sort((a, b) => new Date(b.date) - new Date(a.date));

  kursData.forEach((kurs) => {
    const newRow = kursTableBody.insertRow();

    // Format tanggal ke DD/MM/YYYY (sesuai tampilan)
    const formattedDate = new Date(kurs.date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    newRow.insertCell().textContent = formattedDate;
    newRow.insertCell().textContent = kurs.value;
  });
}

// Menangani Submit Kurs Manual
if (jisdorForm) {
  jisdorForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const kursValue = document.getElementById("kurs-value").value;
    const kursDate = document.getElementById("kurs-date").value;

    // Validasi Sederhana
    if (!kursDate || !kursValue) return;

    // Cek duplikasi tanggal
    const isDuplicate = kursData.some((k) => k.date === kursDate);

    if (isDuplicate) {
      alert(`Kurs untuk tanggal ${kursDate} sudah ada!`);
      return;
    }

    // Simpan data baru
    const newKurs = { date: kursDate, value: kursValue };
    kursData.push(newKurs);
    localStorage.setItem("kursData", JSON.stringify(kursData));

    // Tampilkan Alert Sukses
    jisdorAlert.style.display = "block";
    setTimeout(() => {
      jisdorAlert.style.display = "none";
    }, 3000);

    loadKursTable();
    jisdorForm.reset();
  });
}

// Menangani Sinkronisasi API (Simulasi)
if (apiButton) {
  apiButton.addEventListener("click", function () {
    alert("Memulai Sinkronisasi Kurs Otomatis dari API (Simulasi).");
  });
}

// Panggil saat halaman dimuat
if (kursTableBody) {
  loadKursTable();
}

// ============================================================
// EDIT USER FUNCTIONALITY
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  const editUserForm = document.getElementById("edit-user-form");
  const successModal = document.getElementById(
    "custom-edit-user-success-modal"
  );
  const successMessage = document.getElementById("edit-user-success-message");
  const modalSuccessOkBtn = document.getElementById(
    "modal-edit-user-success-ok-btn"
  );

  // Get user ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");

  // Load user data if ID is provided
  if (userId && editUserForm) {
    loadUserData(userId);
  }

  // Handle form submission
  if (editUserForm) {
    editUserForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveUserChanges(userId);
    });
  }

  // Modal OK button handler
  if (modalSuccessOkBtn) {
    modalSuccessOkBtn.addEventListener("click", function () {
      successModal.style.display = "none";
      window.location.href = "manajemen_user.html";
    });
  }
});

function loadUserData(userId) {
  const userData = JSON.parse(localStorage.getItem("userData")) || [];
  const user = userData.find((u) => u.id == userId);

  if (user) {
    document.getElementById("username").value = user.username || "";
    document.getElementById("role").value = user.role || "";
    document.getElementById("status").value = user.status || "";
  } else {
    alert("User tidak ditemukan!");
    window.location.href = "manajemen_user.html";
  }
}

function saveUserChanges(userId) {
  const userData = JSON.parse(localStorage.getItem("userData")) || [];
  const userIndex = userData.findIndex((u) => u.id == userId);

  if (userIndex !== -1) {
    const role = document.getElementById("role").value;
    const status = document.getElementById("status").value;
    const now = new Date();
    const formattedDate = formatDateTime(now);

    userData[userIndex].role = role;
    userData[userIndex].status = status;
    userData[userIndex].updatedDate = formattedDate;
    userData[userIndex].updatedBy = "Current User";

    localStorage.setItem("userData", JSON.stringify(userData));

    const successModal = document.getElementById(
      "custom-edit-user-success-modal"
    );
    const successMessage = document.getElementById("edit-user-success-message");

    successMessage.textContent = `User "${userData[userIndex].username}" berhasil diubah!`;
    successModal.style.display = "flex";
  } else {
    alert("Gagal menyimpan perubahan. User tidak ditemukan!");
  }
}

// ============================================================
// TAMBAH USER FUNCTIONALITY
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  const addUserForm = document.getElementById("add-user-form");
  const successModal = document.getElementById("custom-add-user-success-modal");
  const successMessage = document.getElementById("add-user-success-message");
  const modalSuccessOkBtn = document.getElementById(
    "modal-add-user-success-ok-btn"
  );

  if (addUserForm) {
    addUserForm.addEventListener("submit", function (e) {
      e.preventDefault();
      addNewUser();
    });
  }

  if (modalSuccessOkBtn) {
    modalSuccessOkBtn.addEventListener("click", function () {
      if (successModal) {
        successModal.style.display = "none";
      }
      window.location.href = "manajemen_user.html";
    });
  }
});

function addNewUser() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  if (!username || !password || !role) {
    alert("Harap lengkapi semua field!");
    return;
  }

  let userData = JSON.parse(localStorage.getItem("userData")) || [];

  const existingUser = userData.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
  if (existingUser) {
    alert("Username sudah digunakan! Silakan pilih username lain.");
    return;
  }

  const newUserId = generateUserId();
  const currentDate = getCurrentDateTime();

  const newUser = {
    id: newUserId,
    username: username,
    password: password,
    role: role,
    status: "Aktif",
    date_created: currentDate.split(" ")[0],
    createdBy: "System",
    lastUpdated: currentDate,
    lastUpdatedBy: "System",
  };

  userData.push(newUser);

  try {
    localStorage.setItem("userData", JSON.stringify(userData));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    alert("Terjadi error saat menyimpan data!");
    return;
  }

  const successModal = document.getElementById("custom-add-user-success-modal");
  const successMessage = document.getElementById("add-user-success-message");

  if (successModal && successMessage) {
    successMessage.textContent = `User "${username}" berhasil ditambahkan!`;
    successModal.style.display = "flex";
  }

  document.getElementById("add-user-form").reset();
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function generateUserId() {
  const userData = JSON.parse(localStorage.getItem("userData")) || [];
  if (userData.length === 0) {
    return 1;
  }
  const maxId = Math.max(...userData.map((user) => user.id));
  return maxId + 1;
}

function getCurrentDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function formatDateTime(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// ============================================================
// AUDIT TRAIL FUNCTIONALITY - TABLE VERSION
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  const auditTableBody = document.getElementById("audit-table-body");
  const userFilter = document.getElementById("user-filter");
  const dateFilter = document.getElementById("date-filter");

  // Data Audit Trail
  let auditData = JSON.parse(localStorage.getItem("auditData")) || [];

  // Inisialisasi data audit trail jika kosong
  if (auditData.length === 0) {
    auditData = [
      {
        id: 1,
        timestamp: "12/11/2025, 17:11:18",
        username: "Admin",
        activity: "Update Kurs Manual",
        details: "Tanggal: 2025-11-12, Nilai: 17000",
        date: "2025-11-12",
        activityType: "update",
      },
      {
        id: 2,
        timestamp: "12/11/2025, 16:45:30",
        username: "Estimator",
        activity: "Tambah Produk",
        details: "Produk: Tongkat Baseball, Kode: TB001",
        date: "2025-11-12",
        activityType: "create",
      },
      {
        id: 3,
        timestamp: "12/11/2025, 16:30:15",
        username: "Admin",
        activity: "Edit User",
        details: "User: Guest, Role: User → Viewer, Status: Aktif → Nonaktif",
        date: "2025-11-12",
        activityType: "update",
      },
      {
        id: 4,
        timestamp: "12/11/2025, 16:15:42",
        username: "Guest",
        activity: "Login",
        details: "User berhasil login ke sistem",
        date: "2025-11-12",
        activityType: "login",
      },
      {
        id: 5,
        timestamp: "12/11/2025, 15:20:10",
        username: "Admin",
        activity: "Hapus Komponen",
        details: "Komponen: Aluminium Alloy (ID: 201)",
        date: "2025-11-12",
        activityType: "delete",
      },
      {
        id: 6,
        timestamp: "12/11/2025, 15:05:33",
        username: "Estimator",
        activity: "Tambah Riwayat Pengadaan",
        details: "Komponen: Steel Rod, Harga: 900000, Vendor: VENDOR A",
        date: "2025-11-12",
        activityType: "create",
      },
      {
        id: 7,
        timestamp: "12/11/2025, 14:50:22",
        username: "Admin",
        activity: "Logout",
        details: "User berhasil logout dari sistem",
        date: "2025-11-12",
        activityType: "logout",
      },
      {
        id: 8,
        timestamp: "12/11/2025, 14:30:15",
        username: "Admin",
        activity: "Login",
        details: "User berhasil login ke sistem",
        date: "2025-11-12",
        activityType: "login",
      },
    ];
    localStorage.setItem("auditData", JSON.stringify(auditData));
  }

  // Load audit trail
  if (auditTableBody) {
    loadAuditTrail();

    // Event listeners untuk filter
    if (userFilter) {
      userFilter.addEventListener("change", loadAuditTrail);
    }
    if (dateFilter) {
      dateFilter.addEventListener("change", loadAuditTrail);
    }
  }
});

function loadAuditTrail() {
  const auditTableBody = document.getElementById("audit-table-body");
  const userFilter = document.getElementById("user-filter");
  const dateFilter = document.getElementById("date-filter");

  if (!auditTableBody) return;

  let auditData = JSON.parse(localStorage.getItem("auditData")) || [];
  auditTableBody.innerHTML = "";

  // Apply filters
  let filteredData = auditData;

  if (userFilter && userFilter.value) {
    filteredData = filteredData.filter(
      (item) => item.username === userFilter.value
    );
  }

  if (dateFilter && dateFilter.value) {
    filteredData = filteredData.filter(
      (item) => item.date === dateFilter.value
    );
  }

  // Sort by timestamp (newest first)
  filteredData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (filteredData.length === 0) {
    const emptyRow = auditTableBody.insertRow();
    const emptyCell = emptyRow.insertCell();
    emptyCell.colSpan = 4;
    emptyCell.innerHTML = `
            <div class="audit-empty">
                <i class="fas fa-clipboard-list"></i>
                <h3>Tidak ada data audit trail</h3>
                <p>Tidak ditemukan data yang sesuai dengan filter yang dipilih.</p>
            </div>
        `;
    return;
  }

  filteredData.forEach((audit) => {
    const newRow = auditTableBody.insertRow();

    // Tanggal & Waktu
    const datetimeCell = newRow.insertCell();
    datetimeCell.className = "audit-datetime";
    datetimeCell.textContent = audit.timestamp;

    // Nama Pengguna
    const userCell = newRow.insertCell();
    userCell.className = "audit-username";
    userCell.textContent = audit.username;

    // Aktivitas
    const activityCell = newRow.insertCell();
    activityCell.className = `audit-activity ${audit.activityType}`;
    activityCell.textContent = audit.activity;

    // Detail Perubahan
    const detailsCell = newRow.insertCell();
    detailsCell.className = "audit-details";
    detailsCell.textContent = audit.details;
  });
}

function clearFilters() {
  const userFilter = document.getElementById("user-filter");
  const dateFilter = document.getElementById("date-filter");

  if (userFilter) userFilter.value = "";
  if (dateFilter) dateFilter.value = "";

  loadAuditTrail();
}

// ============================================================
// AUDIT TRAIL LOGGING FUNCTIONS
// ============================================================

// Fungsi untuk mencatat aktivitas ke audit trail
function logAuditTrail(username, activity, details) {
  const auditData = JSON.parse(localStorage.getItem("auditData")) || [];

  const newAudit = {
    id: auditData.length > 0 ? Math.max(...auditData.map((a) => a.id)) + 1 : 1,
    timestamp: getCurrentDateTime(),
    username: username,
    activity: activity,
    details: details,
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    activityType: getActivityType(activity),
  };

  auditData.unshift(newAudit); // Add to beginning for newest first

  // Simpan maksimal 1000 record untuk performance
  if (auditData.length > 1000) {
    auditData.splice(1000);
  }

  localStorage.setItem("auditData", JSON.stringify(auditData));
}

// Fungsi untuk menentukan tipe aktivitas
function getActivityType(activity) {
  const activityLower = activity.toLowerCase();

  if (activityLower.includes("login")) return "login";
  if (activityLower.includes("logout")) return "logout";
  if (
    activityLower.includes("tambah") ||
    activityLower.includes("create") ||
    activityLower.includes("add")
  )
    return "create";
  if (activityLower.includes("edit") || activityLower.includes("update"))
    return "update";
  if (activityLower.includes("hapus") || activityLower.includes("delete"))
    return "delete";

  return "update"; // default
}

// Fungsi untuk mendapatkan datetime format
function getCurrentDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

// ============================================================
// DASHBOARD FUNCTIONALITY - UNTUK SEMUA HALAMAN
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  console.log("Dashboard JS Loaded");

  // Initialize semua fungsi
  initializeDashboard();
  setupNavigation();
  setupLogout();
  setupPageSpecificFeatures();

  // Load data untuk halaman spesifik
  loadCurrentPageData();
});

// ============================================================
// INITIALIZE DASHBOARD - UNTUK SEMUA HALAMAN
// ============================================================
function initializeDashboard() {
  console.log("Initializing dashboard...");

  // Set user role based on stored data or default
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    username: "Admin",
    role: "Administrator",
  };

  // Update UI dengan data user
  updateUserInfo(currentUser);

  // Log login activity (hanya sekali per session)
  logLoginActivity(currentUser.username);

  // Set active page berdasarkan halaman saat ini
  setActivePage();
}

// ============================================================
// UPDATE USER INFO - UNTUK SEMUA HALAMAN
// ============================================================
function updateUserInfo(user) {
  const userRoleElement = document.querySelector(".user-role");

  if (userRoleElement) {
    userRoleElement.textContent = user.role || "Administrator";
  }

  // Simpan user info untuk logout nanti
  localStorage.setItem("currentUser", JSON.stringify(user));
}

// ============================================================
// SET ACTIVE PAGE - UNTUK SEMUA HALAMAN
// ============================================================
function setActivePage() {
  const navItems = document.querySelectorAll(".nav-item");
  const currentPage = getCurrentPage();

  console.log("Setting active page:", currentPage);

  navItems.forEach((item) => {
    const pageName = item.getAttribute("data-page");
    if (pageName === currentPage) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// ============================================================
// GET CURRENT PAGE - UNTUK SEMUA HALAMAN
// ============================================================
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split("/").pop();

  console.log("Current page:", page);

  if (page.includes("manajemen_produk") || page === "manajemen_produk.html")
    return "manajemen_produk";
  if (page.includes("manajemen_komponen") || page === "manajemen_komponen.html")
    return "manajemen_komponen";
  if (page.includes("riwayat_pengadaan") || page === "riwayat_pengadaan.html")
    return "riwayat_pengadaan";
  if (page.includes("kurs_jisdor") || page === "kurs_jisdor.html")
    return "kurs_jisdor";
  if (page.includes("manajemen_user") || page === "manajemen_user.html")
    return "manajemen_user";
  if (page.includes("audit_trail") || page === "audit_trail.html")
    return "audit_trail";
  if (page.includes("tambah_produk") || page === "tambah_produk.html")
    return "manajemen_produk";
  if (page.includes("edit_produk") || page === "edit_produk.html")
    return "manajemen_produk";
  if (page.includes("tambah_komponen") || page === "tambah_komponen.html")
    return "manajemen_komponen";
  if (page.includes("edit_komponen") || page === "edit_komponen.html")
    return "manajemen_komponen";
  if (page.includes("tambah_riwayat") || page === "tambah_riwayat.html")
    return "riwayat_pengadaan";
  if (page.includes("edit_riwayat") || page === "edit_riwayat.html")
    return "riwayat_pengadaan";
  if (page.includes("tambah_user") || page === "tambah_user.html")
    return "manajemen_user";
  if (page.includes("edit_user") || page === "edit_user.html")
    return "manajemen_user";

  return "dashboard"; // default
}

// ============================================================
// SETUP NAVIGATION - UNTUK SEMUA HALAMAN
// ============================================================
function setupNavigation() {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      // Dapatkan nama halaman
      const pageName = this.getAttribute("data-page");
      const pageTitle = this.querySelector("span").textContent;

      // Cek jika sudah di halaman yang sama
      const currentPage = getCurrentPage();
      if (pageName === currentPage) {
        console.log("Already on page:", pageName);
        return;
      }

      // Log aktivitas navigasi
      logNavigationActivity(pageTitle);

      // Redirect ke halaman yang sesuai
      redirectToPage(pageName);
    });
  });
}

// ============================================================
// SETUP LOGOUT - UNTUK SEMUA HALAMAN (SISTEM BARU)
// ============================================================
function setupLogout() {
  const logoutLink = document.querySelector(".logout-link");

  if (logoutLink) {
    console.log("Logout link found, setting up event listener");

    // HAPUS SEMUA EVENT LISTENER LAMA
    const newLogoutLink = logoutLink.cloneNode(true);
    logoutLink.parentNode.replaceChild(newLogoutLink, logoutLink);

    // SETUP EVENT LISTENER BARU
    newLogoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      console.log("Logout clicked - NEW SYSTEM");
      showLogoutConfirmation();
    });

    // HAPUS EVENT LISTENER DARI MODAL LAMA JIKA ADA
    removeOldLogoutHandlers();
  } else {
    console.log("Logout link not found");
  }
}

// ============================================================
// HAPUS HANDLER LOGOUT LAMA
// ============================================================
function removeOldLogoutHandlers() {
  // Hapus modal lama jika ada
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

  // Hapus event listener dari tombol modal lama
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

// ============================================================
// SHOW LOGOUT CONFIRMATION MODAL - UNTUK SEMUA HALAMAN
// ============================================================
function showLogoutConfirmation() {
  // Dapatkan info user yang sedang login
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    username: "Admin",
  };

  // Cek jika modal sudah ada, hapus dulu
  const existingModal = document.querySelector(".logout-modal-overlay");
  if (existingModal) {
    document.body.removeChild(existingModal);
  }

  // Buat modal element
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

  // Tambahkan modal ke body
  document.body.appendChild(modal);
  document.body.style.overflow = "hidden"; // Prevent scrolling

  // Setup event listeners untuk tombol
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

  // Close modal ketika klik di luar
  const modalClickHandler = function (e) {
    if (e.target === modal) {
      closeLogoutModal(modal);
    }
  };
  modal.addEventListener("click", modalClickHandler);

  // Close modal dengan ESC key
  const escHandler = function (e) {
    if (e.key === "Escape") {
      closeLogoutModal(modal);
    }
  };
  document.addEventListener("keydown", escHandler);

  // Simpan reference untuk cleanup nanti
  modal._handlers = {
    cancel: cancelHandler,
    confirm: confirmHandler,
    modalClick: modalClickHandler,
    esc: escHandler,
  };

  // Focus pada tombol batal untuk aksesibilitas
  cancelBtn.focus();
}

// ============================================================
// CLOSE LOGOUT MODAL
// ============================================================
function closeLogoutModal(modal) {
  if (modal && modal.parentNode) {
    // Remove event listeners
    if (modal._handlers) {
      document.removeEventListener("keydown", modal._handlers.esc);
    }
    modal.parentNode.removeChild(modal);
  }
  document.body.style.overflow = ""; // Restore scrolling
}

// ============================================================
// PERFORM LOGOUT - UNTUK SEMUA HALAMAN
// ============================================================
function performLogout() {
  console.log("Performing logout...");

  // Dapatkan info user yang sedang login
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    username: "Admin",
  };

  // Log aktivitas logout
  logLogoutActivity(currentUser.username);

  // Hapus data user yang sedang login
  localStorage.removeItem("currentUser");

  // Tampilkan pesan sukses
  showLogoutMessage();

  // Redirect ke halaman login setelah delay
  setTimeout(() => {
    redirectToLogin();
  }, 2000);
}

// ============================================================
// LOGOUT MESSAGE - UNTUK SEMUA HALAMAN
// ============================================================
function showLogoutMessage() {
  // Cek jika pesan sudah ada, hapus dulu
  const existingMessage = document.querySelector(".logout-success-message");
  if (existingMessage) {
    document.body.removeChild(existingMessage);
  }

  // Buat elemen pesan
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

  // Hapus pesan setelah 3 detik
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 3000);
}

// ============================================================
// REDIRECT FUNCTIONS - UNTUK SEMUA HALAMAN
// ============================================================
function redirectToPage(pageName) {
  // Mapping nama page ke file HTML
  const pageMap = {
    dashboard: "dashboard.html",
    manajemen_produk: "manajemen_produk.html",
    manajemen_komponen: "manajemen_komponen.html",
    riwayat_pengadaan: "riwayat_pengadaan.html",
    kurs_jisdor: "kurs_jisdor.html",
    manajemen_user: "manajemen_user.html",
    audit_trail: "audit_trail.html",
  };

  const targetPage = pageMap[pageName];
  const currentPage = window.location.pathname.split("/").pop();

  if (targetPage && currentPage !== targetPage) {
    console.log("Redirecting to:", targetPage);
    // Simpan halaman aktif untuk kembali jika perlu
    localStorage.setItem("lastActivePage", pageName);

    // Redirect ke halaman tujuan
    window.location.href = targetPage;
  }
}

function redirectToLogin() {
  console.log("Redirecting to login page...");
  // Redirect ke halaman login
  window.location.href = "../index.html";
}

// ============================================================
// AUDIT TRAIL FUNCTIONS - UNTUK SEMUA HALAMAN
// ============================================================
function logLoginActivity(username) {
  const auditData = JSON.parse(localStorage.getItem("auditData")) || [];

  // Cek apakah sudah ada login activity untuk user ini dalam 5 detik terakhir
  const recentLogin = auditData.find(
    (item) =>
      item.username === username &&
      item.activity === "Login" &&
      isRecentActivity(item.timestamp, 5000)
  );

  if (!recentLogin) {
    logAuditTrail(username, "Login", "User berhasil login ke sistem");
  }
}

function logLogoutActivity(username) {
  logAuditTrail(username, "Logout", "User berhasil logout dari sistem");
}

function logNavigationActivity(pageName) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    username: "Admin",
  };
  logAuditTrail(
    currentUser.username,
    "Akses Halaman",
    `Mengakses halaman: ${pageName}`
  );
}

function logAuditTrail(username, activity, details) {
  try {
    const auditData = JSON.parse(localStorage.getItem("auditData")) || [];

    const newAudit = {
      id:
        auditData.length > 0 ? Math.max(...auditData.map((a) => a.id)) + 1 : 1,
      timestamp: getCurrentDateTime(),
      username: username,
      activity: activity,
      details: details,
      date: new Date().toISOString().split("T")[0],
      activityType: getActivityType(activity),
    };

    auditData.unshift(newAudit);

    // Simpan maksimal 200 record
    if (auditData.length > 200) {
      auditData.splice(200);
    }

    localStorage.setItem("auditData", JSON.stringify(auditData));
    console.log("Audit trail logged:", newAudit);
  } catch (error) {
    console.error("Error logging audit trail:", error);
  }
}

function getCurrentDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year}, ${hours}.${minutes}.${seconds}`;
}

function getActivityType(activity) {
  if (!activity) return "update";

  const activityLower = activity.toLowerCase();
  if (activityLower.includes("login")) return "login";
  if (activityLower.includes("logout")) return "logout";
  if (
    activityLower.includes("tambah") ||
    activityLower.includes("create") ||
    activityLower.includes("add")
  )
    return "create";
  if (
    activityLower.includes("edit") ||
    activityLower.includes("update") ||
    activityLower.includes("ubah")
  )
    return "update";
  if (
    activityLower.includes("hapus") ||
    activityLower.includes("delete") ||
    activityLower.includes("remove")
  )
    return "delete";
  return "update";
}

function isRecentActivity(timestamp, maxAgeMs) {
  try {
    const [datePart, timePart] = timestamp.split(", ");
    const [day, month, year] = datePart.split("/");
    const normalizedTime = timePart.replace(/\./g, ":");
    const activityDate = new Date(`${year}-${month}-${day} ${normalizedTime}`);
    const now = new Date();

    return now - activityDate < maxAgeMs;
  } catch (error) {
    return false;
  }
}

// ============================================================
// PLACEHOLDER FUNCTIONS UNTUK FITUR LAIN
// ============================================================
function setupPageSpecificFeatures() {
  const currentPage = getCurrentPage();
  console.log("Setting up page specific features for:", currentPage);
}

function loadCurrentPageData() {
  const currentPage = getCurrentPage();
  console.log("Loading data for:", currentPage);
}

// ============================================================
// PUBLIC FUNCTIONS
// ============================================================
function logoutUser() {
  performLogout();
}

function getCurrentUser() {
  return (
    JSON.parse(localStorage.getItem("currentUser")) || {
      username: "Admin",
      role: "Administrator",
    }
  );
}
