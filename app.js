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

getUsers();
getBalance();

async function getUsers() {
  cardContainer.innerHTML = "";
  const response = await db.collection("users").get()
  var amount = 0;
  response.forEach((item) => {
    const user = item.data();
    amount += user.amount;
    cardContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="card me-4" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">${user.name}</h5>
          <p class="card-text">
            ${formatMoney(user.amount)}
          </p>
        </div>
      </div>`
    );
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
          <td>${balance.date}</td>
          <td>${formatMoney(balance.amount)}</td>
          <td>${profit}</td>
        </tr>`
    );

    prevData = balance;
  });

}

function formatMoney(money) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(money);
}

async function addUsers() {
  if (document.getElementById("passwordUser").value !== "Saya Hiyama") {
    alert("Password Salah");
    return;
  }
  await db.collection("users").add({
    name: document.getElementById("name").value,
    amount: +document.getElementById("amount").value,
  });
  getUsers();
  document.getElementById("userclose").click();
}

async function addBalance() {
  if (document.getElementById("passwordBalance").value !== "Saya Hiyama") {
    alert("Password Salah");
    return;
  }
  await db.collection("balances").add({
    date: formatDate(new Date()),
    amount: +document.getElementById("newBalance").value,
  });
  getBalance();
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