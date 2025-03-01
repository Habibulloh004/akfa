const data = [];
window.addEventListener(
  "load",
  function () {
    top.postMessage({ hideSpinner: true }, "*");
  },
  false
);
const currentYear = new Date().getFullYear();
let currentMonth = "" + (new Date().getMonth() + 1);
if (+currentMonth < 10) {
  currentMonth = currentMonth.padStart(2, "0");
}

const select = document.getElementById("month");
const error = document.getElementById("error");
const excel = document.getElementById("excel");

const allClientSpan = document.getElementById("all_clients");
const allCountSpan = document.getElementById("all_count");
const breakfastsCountSpan = document.getElementById("total_breakfasts");
const dinnersCountSpan = document.getElementById("total_dinners");
const lunchesCountSpan = document.getElementById("total_lunches");
let allClientCount;
let totalCount;
let breakfastsCount;
let dinnersCount;
let lunchesCount;
// `data[0].clients` dagi ma'lumotla

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

for (let i = 0; i < 12; i++) {
  const monthValue = (i + 1).toString().padStart(2, "0");
  const option = document.createElement("option");
  option.value = monthValue;
  option.textContent = monthNames[i];
  select.appendChild(option);
}

// Current monthni tanlangan qilib belgilash
select.value = currentMonth;

const tableDiv = document.getElementById("table");

function renderTable(filteredData) {
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  // Create table headers
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (const key in filteredData[0]) {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body rows
  filteredData.forEach((item) => {
    const row = document.createElement("tr");
    for (const key in item) {
      const cell = document.createElement("td");
      cell.textContent = item[key];
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  // Clear previous content and append new table
  tableDiv.innerHTML = "";
  tableDiv.appendChild(table);
}

fetch(
  `http://212.86.115.143:5000/get_month_data?month=${currentMonth}&year=${currentYear}`
)
  .then((response) => response.json())
  .then((result) => {
    error.innerHTML = "";
    data.push(result);
    renderTable(result.month_data);
    console.log(result.month_data);
    if (data[0]?.message) {
      error.innerHTML = data[0]?.message;
    }
    allClientCount = result.month_data.length;
    totalCount = data[0]?.month_data.reduce(
      (total, client) => total + client.total_all_count,
      0
    ); // Umumiy ma'lumotlar soni

    breakfastsCount = data[0]?.month_data.reduce(
      (total, client) => total + client.total_breakfasts,
      0
    ); // Nonushta ma'lumotlar sonini hisoblash
    dinnersCount = data[0]?.month_data.reduce(
      (total, client) => total + client.total_dinners,
      0
    ); // Tushlik ma'lumotlar sonini hisoblash
    lunchesCount = data[0]?.month_data.reduce(
      (total, client) => total + client.total_lunches,
      0
    ); // Tushlik ma'lumotlar sonini hisoblash

    // HTML taglariga ma'lumotlarni yozish
    allClientSpan.innerHTML = `All count: ${allClientCount}`;
    allCountSpan.innerHTML = `All count: ${totalCount}`;
    breakfastsCountSpan.innerHTML = `Breakfasts count: ${breakfastsCount}`;
    dinnersCountSpan.innerHTML = `Dinners count: ${dinnersCount}`;
    lunchesCountSpan.innerHTML = `Lunches count: ${lunchesCount}`;

    // HTML taglariga ma'lumotlarni yozish
  })
  .catch((err) => {
    console.log(err);
  });

// Handle select change event
select.addEventListener("change", (event) => {
  const selectedValue = event.target.value;
  fetch(
    `http://212.86.115.143:5000/get_month_data?month=${selectedValue}&year=${currentYear}`
  )
    .then((response) => response.json())
    .then((result) => {
      error.innerHTML = "";
      data.pop();
      data.push(result);
      if (data[0]?.message) {
        error.innerHTML = data[0]?.message;
      } else {
        renderTable(result.month_data);
        allClientCount = data[0]?.month_data.length;
        totalCount = data[0]?.month_data.reduce(
          (total, client) => total + client.total_all_count,
          0
        ); // Umumiy ma'lumotlar soni

        breakfastsCount = data[0]?.month_data.reduce(
          (total, client) => total + client.total_breakfasts,
          0
        ); // Nonushta ma'lumotlar sonini hisoblash
        dinnersCount = data[0]?.month_data.reduce(
          (total, client) => total + client.total_dinners,
          0
        ); // Tushlik ma'lumotlar sonini hisoblash
        lunchesCount = data[0]?.month_data.reduce(
          (total, client) => total + client.total_lunches,
          0
        ); // Tushlik ma'lumotlar sonini hisoblash

        // HTML taglariga ma'lumotlarni yozish
        allClientSpan.innerHTML = `All clients: ${allClientCount}`;
        allCountSpan.innerHTML = `All count: ${totalCount}`;
        breakfastsCountSpan.innerHTML = `Breakfasts count: ${breakfastsCount}`;
        dinnersCountSpan.innerHTML = `Dinners count: ${dinnersCount}`;
        lunchesCountSpan.innerHTML = `Lunches count: ${lunchesCount}`;
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

function downloadExcel() {
  const workbook = XLSX.utils.book_new();
  workbook.Props = {
    Title: "Data",
    Subject: "Data Export",
    Author: "Your Name",
    CreatedDate: new Date(),
  };

  const worksheet = XLSX.utils.json_to_sheet(data[0]?.month_data || []);

  // Qo'shimcha ustunlarni yaratish
  const additionalData = [
    { Client: "Clients Count", Count: allClientCount },
    { Client: "Total Count", Count: totalCount },
    { Client: "Breakfasts Count", Count: breakfastsCount },
    { Client: "Dinners Count", Count: dinnersCount },
    { Client: "Lunches Count", Count: lunchesCount },
  ];

  // Qo'shimcha ustunlarni worksheet ga qo'shish
  XLSX.utils.sheet_add_json(worksheet, additionalData, {
    skipHeader: true,
    origin: -1, // Qo'shimcha ma'lumotlarni tabelning pastidan boshlanishini ta'minlash
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Excel faylini eksport qilish
  XLSX.writeFile(workbook, "data.xlsx");
}

excel.addEventListener("click", () => {
  downloadExcel();
});

excel.addEventListener("click", () => {
  downloadExcel();
});

// Ma'lumotlarning yig'indisi
// Ma'lumotlarning yig'indisi
