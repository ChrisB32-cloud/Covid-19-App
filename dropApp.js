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
let mortalityTotalCount = [];

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
// below chart 1 data

async function covidOverTimeUpdate() {
  const res = await axios.get(`https://covidtracking.com/api/v1/us/daily.json`);
  const data = res.data;
  posChartData(data);
  timeDateData(data);
  currentMax(data);
  usDeaths(data);
  initChartPositive();
  initMortChart();
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
    if (idx % 5 === 0) {
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
  const currMax = max[0].positive;
  maxData = currMax + 100000;
}

function formateDateData(time) {
  const reverseOrder = time.reverse();
  reverseOrder.forEach((tm, idx) => {
    // maybe instead of grabbing dates first we grab the index
    // const grabMmDd = tm.slice(4, 8);
    if (idx % 5 === 0) {
      const grabMmDd = tm.slice(4, 8);
      monthLable.push(grabMmDd);
    }
  });
}

// above chart 1 data
// <----------------------------------------->
// below chart 2 data

function usDeaths(mortality) {
  let totalMort = [];
  mortality.forEach(mort => {
    totalMort.push(mort.death);
  });
  chartMortGraph(totalMort);
}

function chartMortGraph(total) {
  const revMortList = total.reverse();
  revMortList.forEach((mort, idx) => {
    if (mort == null) {
      mort = 0;
    }
    if (idx % 5 === 0) {
      mortalityTotalCount.push(mort);
    }
  });
}

// above chart 2 data
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
  const death = state.death;
  const positive = state.positive;
  const mortalityPerSt = (death / positive) * 100;
  const mortalityPerState = mortalityPerSt.toFixed(2);
  btn.addEventListener('click', () => {
    if (state.hospitalized === null) state.hospitalized = 'N/A';
    if (state.recovered === null) state.recovered = 'N/A';
    h2.innerHTML = `Total Cases in ${state.state}: ${state.positive} <br> Hosptialized: ${state.hospitalized} <br> Recovered: ${state.recovered} <br> Deaths: ${state.death} <br> Mortality %: ${mortalityPerState}`;
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
// above dropDown eventListener
// <------------------------------------->
// below US cases graph

// Total positive cases graph
let ctx = document.getElementById('myChart');
function initChartPositive() {
  let myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Positive Cases in US',
          data: newPosChart,
          backgroundColor: 'rgba(34,0,65,0.5)'
        }
      ],
      labels: monthLable
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              // need to dynamiclly add the max, use a function
              max: maxData,
              min: 0,
              stepSize: 10000
            }
          }
        ]
      },
      legend: {}
    }
  });
}

// Totally mortality graph
let ctx2 = document.getElementById('myChart2');
function initMortChart() {
  let myLineChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Mortality in US',
          data: mortalityTotalCount,
          backgroundColor: 'rgba(0,45,65,0.5)'
        }
      ],
      labels: monthLable
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              // need to dynamiclly add the max, use a function
              max: 130000,
              min: 0,
              stepSize: 100
            }
          }
        ]
      }
    }
  });
}

// review below this comment more
$(document).ready(_ => {
  init();
});

function init() {
  covidUpdate();
  covidOverTimeUpdate();
}
