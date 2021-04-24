const firebaseConfig = {
  apiKey: "AIzaSyA1JsLMic3SbAAXdaBZaJz899rxo5B15Wc",
  authDomain: "tracker-gold-5d0a0.firebaseapp.com",
  projectId: "tracker-gold-5d0a0",
  storageBucket: "tracker-gold-5d0a0.appspot.com",
  messagingSenderId: "586047578221",
  appId: "1:586047578221:web:4a14e0bbb9bc9e7bf89f64",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const container = document.querySelector("#content");
const cardContainer = document.querySelector("#card-container");
const tbody = document.querySelector("tbody");
const addBalanceBtn = document.querySelector("#add-balance");
const password = "sayahiyamahihi";

getAllData();

async function getAllData() {
  await getUsers();
  getBalance();
}
async function getUsers() {
  cardContainer.innerHTML = "";
  const response = await db.collection("users").get()
  var amount = 0;
  response.forEach((item) => {
    const user = item.data();
    amount += user.amount;
  });

  let i = 1;
  response.forEach((item) => {
    const user = item.data();
    const percentage = ((user.amount / amount) * 100).toFixed(2);
    cardContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="card me-4" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">${user.name}</h5>
          <p class="card-text">
            ${formatMoney(user.amount)}
          </p>
          <p class="card-text mb-0 percentage" data="${percentage}">
            ${percentage}%
          </p>
          <p class="card-text" id="profit-${i}">
          </p>
        </div>
      </div>`
    );
    i++;
  });

  document.querySelector("#total-amount").innerHTML = formatMoney(amount);
}

async function getBalance() {
  tbody.innerHTML = "";
  const response = await db.collection("balances").orderBy("date").get();
  let prevData;
  response.forEach((item) => {
    const balance = item.data();
    const profit = prevData
      ? formatMoney(balance.amount - prevData.amount)
      : "-";
    tbody.insertAdjacentHTML(
      "afterbegin",
      `<tr>
          <td>${formatDate(balance.date.toDate())}</td>
          <td>${formatMoney(balance.amount)}</td>
          <td>${profit}</td>
        </tr>`
    );

    prevData = balance;
  });
  calculateProfit(prevData.amount);
}

function calculateProfit(profit) {
  const percentages = document.querySelectorAll('.percentage');
  for (let i = 0; i < percentages.length; i++) {
    const percentage = percentages[i].getAttribute("data");
    const splittedProfit = (profit * percentage) / 100;
    document.getElementById(`profit-${i + 1}`).innerText = `profit: $${splittedProfit.toFixed(3)}`;
  }
}

function formatMoney(money) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(money);
}

async function addUsers() {
  if (document.getElementById("passwordUser").value !== password) {
    alert("Password Salah");
    return;
  }
  await db.collection("users").add({
    name: document.getElementById("name").value,
    amount: +document.getElementById("amount").value,
    created: firebase.firestore.FieldValue.serverTimestamp(),
  });
  getAllData();
  document.getElementById("userclose").click();
}

async function addBalance() {
  if (document.getElementById("passwordBalance").value !== password) {
    alert("Password Salah");
    return;
  }
  addBalanceBtn.disabled = true;
  addBalanceBtn.querySelector("span").classList.toggle("d-none");
  await db.collection("balances").add({
    amount: +document.getElementById("newBalance").value,
    date: firebase.firestore.FieldValue.serverTimestamp(),
  });
  addBalanceBtn.disabled = false;
  addBalanceBtn.querySelector("span").classList.toggle("d-none");
  getAllData();
  document.getElementById("balanceclose").click();
}

function formatDate(date) {
  const d = new Date(date);

  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function preventNonNumericalInput(e) {
  e = e || window.event;
  var charCode = typeof e.which == "undefined" ? e.keyCode : e.which;
  var charStr = String.fromCharCode(charCode);

  if (!charStr.match(/^[0-9.]+$/)) e.preventDefault();
}