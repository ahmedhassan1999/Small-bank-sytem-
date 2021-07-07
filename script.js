'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-06-25T17:01:17.194Z',
    '2021-06-28T23:36:17.929Z',
    '2021-06-27T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const starttimelogout = function () {
  let time = 20;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min} : ${sec} `;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get start';
      containerApp.style.opacity = 0;
    }
    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const formatDate = function (date, local) {
  const calculateDayPassed = (day1, day2) =>
    Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));

  const daysPassed = calculateDayPassed(new Date(), date);
  if (daysPassed === 0) return 'Tody';
  if (daysPassed === 1) return 'Yestaday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    /*const year = date.getFullYear();
    const month = `${date.getMonth()}`.padStart(2, 0);
    const day = `${date.getDate()}`.padStart(2, 0);
    return `${day}/${month}/${year}`;*/
    return new Intl.DateTimeFormat(local).format(date);
  }
};

const updateUI = function (acc) {
  displayMovements(acc);
  displaybalaceSummary(acc);
  displaybalace(acc);
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDate(date, acc.locale);
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">  ${displayDate}  </div>
          
          <div class="movements__value">${mov}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserName(accounts);
//console.log(account1);
const displaybalace = function (acc) {
  acc.balace = acc.movements.reduce((sum, curr) => (sum += curr), 0);
  labelBalance.textContent = `${acc.balace} Eur `;
};

const displaybalaceSummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((sum, curr) => (sum += curr), 0);
  labelSumIn.textContent = `${income}Eur`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => (acc += cur), 0);
  labelSumOut.textContent = `${out}Eur`;
  const interst = acc.movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * acc.interestRate) / 100)
    .reduce((acc1, curr1) => (acc1 += curr1), 0);
  labelSumInterest.textContent = `${interst}Eur`;
};

let CurrenAccount, timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  inputLoanAmount.value = '';
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  CurrenAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(CurrenAccount);
  if (CurrenAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome ${CurrenAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    const now = new Date();
    const options = {
      hours: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      //'2-digit',
      month: 'numeric',
      year: 'numeric',
      //  weekday: 'long',
    };
    // const local = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      CurrenAccount.locale,
      options
    ).format(now);
    /*  const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth()}`.padStart(2, 0);
    const day = `${now.getDate()}`.padStart(2, 0);
    const hours = now.getHours();
    const min = now.getMinutes;

    labelDate.textContent = `${day}/${month}/${year} `;*/
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = starttimelogout();
    updateUI(CurrenAccount);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  console.log(amount, reciverAcc);
  if (
    amount > 0 &&
    reciverAcc &&
    CurrenAccount.balace >= amount &&
    reciverAcc?.userName !== CurrenAccount.userName
  ) {
    CurrenAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    CurrenAccount.movementsDates.push(new Date().toDateString());
    reciverAcc.movementsDates.push(new Date().toISOString());
    updateUI(CurrenAccount);
    clearInterval(timer);
    timer = starttimelogout();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === CurrenAccount.userName &&
    Number(inputClosePin.value) === CurrenAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === CurrenAccount.userName
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';

    console.log(accounts);
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && CurrenAccount.movements.some(mov => mov >= amount * 1.0)) {
    setTimeout(function () {
      CurrenAccount.movements.push(amount);
      CurrenAccount.movementsDates.push(new Date().toISOString());

      updateUI(CurrenAccount);
      clearInterval(timer);
      timer = starttimelogout();
    }, 4000);

    inputLoanAmount.value = '';
  }
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(CurrenAccount.movements, !sorted);
  sorted = !sorted;
});
