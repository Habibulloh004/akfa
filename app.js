const data = [];
const currentYear = new Date().getFullYear();
let currentMonth = "" + (new Date().getMonth() + 1);
if (+currentMonth < 10) {
  currentMonth = currentMonth.padStart(2, "0");
}

const select = document.getElementById("month");
const error = document.getElementById("error");

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
  `https://akfa-abushukurov0806.replit.app/?month=${currentYear}-${currentMonth}&year=${currentYear}`
)
  .then((response) => response.json())
  .then((result) => {
    error.innerHTML = "";
    data.push(result);
    renderTable(result.clients);
    if (data[0].message) {
      error.innerHTML = data[0]?.message;
      //   setTimeout(() => (error.innerHTML = ""), 3000);
    } else {
      renderTable(result.clients);
    }
  })
  .catch((err) => {
    console.log(err);
  });

// Handle select change event
select.addEventListener("change", (event) => {
  const selectedValue = event.target.value;
  fetch(
    `https://akfa-abushukurov0806.replit.app/?month=${currentYear}-${selectedValue}&year=${currentYear}`
  )
    .then((response) => response.json())
    .then((result) => {
      error.innerHTML = "";

      data.pop();
      data.push(result);
      if (data[0].message) {
        error.innerHTML = data[0]?.message;
        // setTimeout(() => (error.innerHTML = ""), 3000);
      } else {
        renderTable(result.clients);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
