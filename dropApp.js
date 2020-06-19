const dropDown = document.querySelector('#drop-down');
const btn = document.querySelector('button');
const h2 = document.querySelector('h2');
// const input = document.querySelector('input');
// IMPORTANT try to the drop down again, this time try don't put the function
// call to fetch the data in the button event listener
let dataStore = [];
let dataOpt = [];
let testingChart = [];

// let newTestingChart = testingChart.reverse();
// function covidUpdate() {
//   fetch(`https://covidtracking.com/api/v1/states/current.json`)
//     .then(res => res.json())
//     .then(data => {
//       // console.log(data);
//       loopState(data);
//       dataStore.push(data);
//     });
// }
async function covidUpdate() {
  const res = await axios.get(
    'https://covidtracking.com/api/v1/states/current.json'
  );
  const data = res.data;
  loopState(data);
  dataStore.push(data);
}

async function covidOverTimeUpdate() {
  const res = await axios.get(`https://covidtracking.com/api/v1/us/daily.json`);
  const data = res.data;
  testChartData(data);
}

function testChartData(data) {
  data.forEach(posCases => {
    testingChart.push(posCases.positive);
  });
}

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

let ctx = document.getElementById('myChart');
let myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Cases',
        data: [1, 2, 3, 4, 5, 6],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
});

covidUpdate();
covidOverTimeUpdate();
