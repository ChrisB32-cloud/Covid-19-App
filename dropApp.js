const btn = document.querySelector('button');
const dropDown = document.querySelector('select');
// IMPORTANT try to the drop down again, this time try don't put the function
// call to fetch the data in the button event listener
let dataStore = [];
let dataOpt = [];
function covidUpdate() {
  fetch(`https://covidtracking.com/api/v1/states/current.json`)
    .then(res => res.json())
    .then(data => {
      loopState(data);
      dataStore.push(data);
      //   console.log(data);
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
    // dropDown.addEventListener('input', () => {

    // });
  });
}

function chkState() {
  dataStore.forEach(dataObj => {
    dataObj.forEach(dataState => {
      // console.log(dataState);
    });
  });
  console.log(dataOpt);
}

btn.addEventListener('click', () => {
  chkState();
});

covidUpdate();
