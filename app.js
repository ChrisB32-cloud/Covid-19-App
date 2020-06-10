const btn = document.querySelector('button');

// IMPORTANT try to the drop down again, this time try don't put the function
// call to fetch the data in the button event listener

// Need to fetch the data outside the outside of the coivd
// update function
// let stateBase = [];
function covidUpdate() {
  fetch(`https://covidtracking.com/api/v1/states/current.json`)
    .then(res => res.json())
    .then(data => {
      loopState(data);
      console.log(data);
    });
}

function loopState(stateObj) {
  const input = document.querySelector('#state-input');
  const inpValue = input.value.toUpperCase();

  stateObj.forEach(states => {
    const state = states.state;
    if (inpValue === state) {
      const h1 = document.createElement('h1');
      h1.innerText = `Total Cases in ${state}: ${states.positive}`;
      document.body.append(h1);
      const h2 = document.createElement('h2');
      h2.innerText = ``;

      clearInput(input);
      // console.log(states);
    }
  });
}

function clearInput(field) {
  field.value = '';
}

// function getState(states, data) {
//   const dropDown = document.querySelector('#drop-down');
//   const opt = document.createElement('option');
//   opt.setAttribute('value', states);
//   opt.innerText = states;
//   dropDown.append(opt);
//   stateBase.push(states);
//   selectState(states, data, opt);

//   console.log(dropDown);
//   // console.log(states);
//   // console.log(data);
//   // console.log(opt);
// }

// function selectState(state, data, opt) {
//   // console.log(stateBa);
//   // console.log(data);
// }

btn.addEventListener('click', () => {
  covidUpdate();
});

// covidUpdate();
