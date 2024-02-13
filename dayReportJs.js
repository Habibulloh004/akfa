const data = [];
const currentYear = new Date().getFullYear();
let choosenDate = document.getElementById("date");
let currentMonth = "" + (new Date().getMonth() + 1);
const error = document.getElementById("error");
const excel = document.getElementById("excel");

const allClientSpan = document.getElementById("all_clients");
const allCountSpan = document.getElementById("all_count");
const breakfastsCountSpan = document.getElementById("count_breakfasts");
const dinnersCountSpan = document.getElementById("count_dinners");
const lunchesCountSpan = document.getElementById("count_lunches");
let allClientCount;
let totalCount;
let breakfastsCount;
let dinnersCount;
let lunchesCount;

if (+currentMonth < 10) {
  currentMonth = currentMonth.padStart(2, "0");
}
let currentDay = "" + (new Date().getDate() + 1);
if (+currentDay < 10) {
  currentDay = currentDay.padStart(2, "0");
}

fetch(
  `https://akfa-abushukurov0806.replit.app/?date=${currentYear}-${currentMonth}-${
    currentDay
  }`
)
  .then((response) => response.json())
  .then((result) => {
    error.innerHTML = ""; // Ma'lumot yuklandikdan so'ng error xabarni tozalash
    data.push(result);
    if (result && result.clients) {
      renderTable(result.clients);
      allClientCount = result.clients.length;
      totalCount = data[0]?.clients.reduce(
        (total, client) => total + client.all_count,
        0
      );

      breakfastsCount = data[0]?.clients.reduce(
        (total, client) => total + client.count_breakfasts,
        0
      );
      dinnersCount = data[0]?.clients.reduce(
        (total, client) => total + client.count_dinners,
        0
      );
      lunchesCount = data[0]?.clients.reduce(
        (total, client) => total + client.count_lunches,
        0
      );

      allClientSpan.innerHTML = `All count: ${allClientCount}`;
      allCountSpan.innerHTML = `All count: ${totalCount}`;
      breakfastsCountSpan.innerHTML = `Breakfasts count: ${breakfastsCount}`;
      dinnersCountSpan.innerHTML = `Dinners count: ${dinnersCount}`;
      lunchesCountSpan.innerHTML = `Lunches count: ${lunchesCount}`;
    } else {
      error.innerHTML = "No data available"; // Ma'lumotlar mavjud emaslik xabari
    }
  })
  .catch((err) => {
    console.log(err);
  });

const tableDiv = document.getElementById("table");

function renderTable(filteredData) {
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  if (filteredData && filteredData.length > 0) {
    // Ma'lumotlar mavjudligini tekshiramiz
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
  } else {
    // Ma'lumotlar mavjud emaslik xabari
    tableDiv.innerHTML = "No data available";
  }
}

// Handle select change event
choosenDate.addEventListener("change", (event) => {
  const selectedValue = event.target.value;
  fetch(
    `https://akfa-abushukurov0806.replit.app/?date=${currentYear}-${selectedValue.slice(
      5
    )}`
  )
    .then((response) => response.json())
    .then((result) => {
      error.innerHTML = "";
      data.pop();
      data.push(result);
      if (data[0]?.message) {
        error.innerHTML = data[0]?.message;
      } else {
        renderTable(result.clients);
        allClientCount = data[0]?.clients.length;
        totalCount = data[0]?.clients.reduce(
          (total, client) => total + client.all_count,
          0
        ); // Umumiy ma'lumotlar soni

        breakfastsCount = data[0]?.clients.reduce(
          (total, client) => total + client.count_breakfasts,
          0
        ); // Nonushta ma'lumotlar sonini hisoblash
        dinnersCount = data[0]?.clients.reduce(
          (total, client) => total + client.count_dinners,
          0
        ); // Tushlik ma'lumotlar sonini hisoblash
        lunchesCount = data[0]?.clients.reduce(
          (total, client) => total + client.count_lunches,
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

  const worksheet = XLSX.utils.json_to_sheet(data[0]?.clients || []);

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
