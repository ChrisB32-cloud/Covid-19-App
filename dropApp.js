const dropDown = document.querySelector('#drop-down');
const btn = document.querySelector('button');
const h2 = document.querySelector('h2');
// const input = document.querySelector('input');
// IMPORTANT try to the drop down again, this time try don't put the function
// call to fetch the data in the button event listener
let dataStore = [];
let dataOpt = [];
let positiveChart = [];
let newPosChart = [];
let timeChart = [];
let maxData;
let monthLable = [];
let months = [
  '0122',
  '0223',
  '0324',
  '04',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
  1,
  2,
  3,
  4
];
async function covidUpdate() {
  const res = await axios.get(
    'https://covidtracking.com/api/v1/states/current.json'
  );
  const data = res.data;
  loopState(data);
  dataStore.push(data);
}
// above dropDown data
// <------------------------------------------>
// below chart data

async function covidOverTimeUpdate() {
  const res = await axios.get(`https://covidtracking.com/api/v1/us/daily.json`);
  const data = res.data;
  posChartData(data);
  timeDateData(data);
  currentMax(data);
  // console.log(data);
}

function posChartData(data) {
  data.forEach(posCases => {
    positiveChart.push(posCases.positive);
  });
  reverseCaseData(positiveChart);
}

function reverseCaseData(cases) {
  const rev = cases.reverse();
  rev.forEach((tm, idx) => {
    // maybe instead of grabbing dates first we grab the index
    // const grabMmDd = tm.slice(4, 8);
    if (idx % 10 === 0) {
      // console.log(tm);
      newPosChart.push(tm);
    }
  });
}

function timeDateData(time) {
  time.forEach(dateTime => {
    const dateToString = dateTime.date;
    const newDateString = dateToString.toString();
    timeChart.push(newDateString);
  });
  formateDateData(timeChart);
}

function currentMax(max) {
  const currMax = max[0].positive + 3000000;
  maxData = currMax;
}

function formateDateData(time) {
  const reverseOrder = time.reverse();
  reverseOrder.forEach((tm, idx) => {
    // maybe instead of grabbing dates first we grab the index
    // const grabMmDd = tm.slice(4, 8);
    if (idx % 10 === 0) {
      const grabMmDd = tm.slice(4, 8);
      monthLable.push(grabMmDd);
    }
  });
  // for (let i = 0; i < reverseOrder.length; i = i + 10) {
  //   console.log(i);
  // }
}

// above chart data
// <----------------------------------------->
// below dropDown data

// Also IMPORTANT instead of dynamical creating an h2
// append to one in the HTML so we can just update the state results
function loopState(stateObjs) {
  stateObjs.forEach(states => {
    const option = document.createElement('option');
    option.innerText = states.state;
    option.setAttribute('value', states.state);
    dropDown.appendChild(option);
    dataOpt.push(option);
  });
}

function checkState(value) {
  const stIter = dataStore[0];
  stIter.forEach(states => {
    const stateSel = states.state;
    if (value === stateSel) {
      popField(states);
    }
  });
}

function popField(state) {
  btn.addEventListener('click', () => {
    if (state.hospitalized === null) state.hospitalized = 'N/A';
    if (state.recovered === null) state.recovered = 'N/A';
    h2.innerHTML = `Total Cases in ${state.state}: ${state.positive} <br> Hosptialized: ${state.hospitalized} <br> Recovered: ${state.recovered} <br> Deaths: ${state.death}`;
  });
}

dropDown.addEventListener('input', e => {
  e.preventDefault();
  const StComp = dropDown.childNodes;
  const stCheck = e.target.value;
  StComp.forEach(StCo => {
    if (stCheck === StCo.value) {
      const sendVal = StCo.value;
      checkState(sendVal);
    }
  });
});

// <------------------------------------->

let ctx = document.getElementById('myChart');
let myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [
      {
        label: 'Positive Cases',
        // dynamically add data
        // data: [5000, 20000, 50000, 200000, 900000, 2000000, 300000]
        data: newPosChart
      }
    ],
    // dyynamically add labels
    labels: monthLable
    // labels: timeChart
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            // need to dynamiclly add the max, use a function
            max: maxData,
            min: 0,
            stepSize: 100000
          }
        }
      ]
    }
  }

  // options: options
});
covidUpdate();
covidOverTimeUpdate();
