const dropDown = document.querySelector('#drop-down');
const btn = document.querySelector('button');
const h2 = document.querySelector('h2');
// const input = document.querySelector('input');
// IMPORTANT try to the drop down again, this time try don't put the function
// call to fetch the data in the button event listener
let dataStore = [];
let dataOpt = [];
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
  // console.log(res.data);
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

covidUpdate();
covidOverTimeUpdate();
