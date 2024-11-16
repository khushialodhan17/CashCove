// Define all DOM elements and initializations
const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// Retrieve transactions from localStorage or initialize as empty
const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));
let transactions = localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Initialize Chart.js instance variables for each month
let previousMonthChart;
let currentMonthChart;

// Add Transaction
function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add text and amount");
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      date: new Date().toISOString(), // Store date as ISO string
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    updateCharts(); // Update charts with new data
    text.value = "";
    amount.value = "";
  }
}

// Generate Random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Add Transactions to DOM list
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    <span class="date">${new Date(transaction.date).toLocaleDateString()}</span>
  `;
  list.appendChild(item);
}

// Update the balance, income, and expense
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Remove Transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  Init();
  updateCharts(); // Update charts after removing transaction
}

// Update Local Storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize app
function Init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
  updateCharts();
}

// Calculate monthly expenses for each category in a specific month
function getMonthlyExpenses(month) {
  return transactions
    .filter(
      (t) =>
        t.amount < 0 &&
        new Date(t.date).getMonth() === month
    )
    .reduce((acc, t) => {
      acc[t.text] = (acc[t.text] || 0) + Math.abs(t.amount);
      return acc;
    }, {});
}

// Update or initialize the charts
function updateCharts() {
  const currentMonth = new Date().getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  // Get categorized expenses for both months
  const previousMonthExpenses = getMonthlyExpenses(previousMonth);
  const currentMonthExpenses = getMonthlyExpenses(currentMonth);

  // Prepare data for charts
  const previousMonthData = {
    labels: Object.keys(previousMonthExpenses),
    datasets: [
      {
        label: "Previous Month Expenses",
        data: Object.values(previousMonthExpenses),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  const currentMonthData = {
    labels: Object.keys(currentMonthExpenses),
    datasets: [
      {
        label: "Current Month Expenses",
        data: Object.values(currentMonthExpenses),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  // Update previous month chart
  if (previousMonthChart) {
    previousMonthChart.data = previousMonthData;
    previousMonthChart.update();
  } else {
    const ctxPrev = document.getElementById("previousMonthChart").getContext("2d");
    previousMonthChart = new Chart(ctxPrev, {
      type: "pie",
      data: previousMonthData,
    });
  }

  // Update current month chart
  if (currentMonthChart) {
    currentMonthChart.data = currentMonthData;
    currentMonthChart.update();
  } else {
    const ctxCurr = document.getElementById("currentMonthChart").getContext("2d");
    currentMonthChart = new Chart(ctxCurr, {
      type: "pie",
      data: currentMonthData,
    });
  }
}

// Run Init and set up event listeners once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
  Init();
  form.addEventListener("submit", addTransaction);
});
