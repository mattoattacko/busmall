'use strict';

//we need an array of images
//we need a constructor funtion for products
//we need an event listener so we can click on the image
//we need an image repository 
//we need to randomize the images
//we need a vote counter (can add to constructor func)
//we need a view counter (can add to constructor func)
//we need to display the list w/ DOM manipulation
//we need to make sure the images do not repeat
//all the DOM appending


//we have a list of images, so we can make an array
Product.names = ['bag', 'banana', 'boots', 'bathroom', 'breakfast', 'bubblegum', 'chair', 'cthulu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];

//contains all our products
Product.all = [];//empty because we need to push information that has been randomized into this array. Add it to our constructor function
//create some global variables
Product.container = document.getElementById('image_container');
//need to know if the product has been just viewd or not so we can keep track of them. Push them to the array.
Product.justViewed = [];
Product.pics = [document.getElementById('left'), document.getElementById('center'), document.getElementById('right')];//we can put our pics in an array
Product.tally = document.getElementById('tally');
Product.totalClicks = 0;//it's zero because we don't know how many total clicks have come through.

//add stuff for localstorage
var infoProduct;
var getProductInfo;
var setClick;
var getClick;


//we can all our constructor funtion Product
//the only parameter we know for a fact off the bat is that it will have a name
function Product(name) {
  this.name = name;
  if (name === 'sweep') {
    this.path = 'img/' + name + '.png';
  }else if (name === 'usb'){
    this.path = 'img/' + name + '.gif';
  }else{
    this.path = 'img/' + name + '.jpg';
  }
  // this.path = 'img/' + name + '.jpg';
  this.votes = 0;
  this.views = 0;
  Product.all.push(this);
}

//loop through the for loop to get product id
for (var i = 0; i < Product.names.length; i++) {
  //console.log(Product.names[i]);
  //console.log();
  new Product(Product.names[i]);//now each of our products is an object, or will be when we call the function
}

function makeRandom() {
  return Math.floor(Math.random() * Product.names.length);
}

//now lets work on displaying the pictures using a function
function displayPics() {
  //we are using an array to keep track of the pics we have already seen.
  var currentlyShowing = []; //so we can push the images into this array and keep track of them. It's a local variable.
 
  Product.votesData = [];
  for(var m = 0; m < Product.names.length; m++){
      Product.votesData.push(Product.all[m].votes); 
  }
  //we need to make the left image unique
  currentlyShowing[0] = makeRandom();
  //we don't have to use a while loop
  while (Product.justViewed.indexOf(currentlyShowing[0]) !== -1) {
    console.error('Duplicate, rerun!');//console.error shows us errors?
    currentlyShowing[0] = makeRandom();
  }
  //make the center image unique 
  currentlyShowing[1] = makeRandom(); //she said there are many ways to do this
  while (currentlyShowing[0] === currentlyShowing[1] || Product.justViewed.indexOf(currentlyShowing[1]) !== -1) { //!== -1 is does not equal the previous?
    console.error('Duplicate at center or in prior view! Re run!');
    currentlyShowing[1] = makeRandom();
  }
  //make right image unique
  currentlyShowing[2] = makeRandom();
  while (currentlyShowing[0] === currentlyShowing[2] || currentlyShowing[1] === currentlyShowing[2] || Product.justViewed.indexOf(currentlyShowing[2]) !== -1) {
    console.error('Duplicate at right! Re run!');
    currentlyShowing[2] = makeRandom();
  }

  //take it to the DOM
  for (var i = 0; i < 3; i++) {
    Product.pics[i].src = Product.all[currentlyShowing[i]].path;
    Product.pics[i].id = Product.all[currentlyShowing[i]].name;
    Product.all[currentlyShowing[i]].views += 1;
    Product.justViewed[i] = currentlyShowing[i];
  }
}
//need a way to click on the image, so we need an event
//event listener for keeping track of the total clicks on images
function handleClick(event) {
  //_______localstorage______//
  infoProduct = JSON.stringify(Product.all);
  localStorage.setItem('products', infoProduct);
  setClick = JSON.stringify(Product.totalClicks);
  localStorage.setItem('totalClicks', setClick);
  //_______localstorage______//
  console.log(Product.totalClicks, 'total clicks');
  //we need to make the clicks stop at 25 clicks according to the requirements
  //container is where the images are stored
  if (Product.totalClicks > 24) {
    Product.container.removeEventListener('click', handleClick);
    //show the list after the last click
    showTally(); //if we remove the event listener, that means we have enough clicks. thats when the list will populate in the browser. That's the showTally()
    makeChart();
    localStorage.clear();
  }
  //this is how we direct the user to click on a specific image. If they click in the image container but not on a specific image, we can use...
  if (event.target.id === 'image_container') {
    return alert('Need to click on an image.');
  }
  //now we start to add up the clicks
  Product.totalClicks += 1;
  for (var i = 0; i < Product.names.length; i++) {
    if (event.target.id === Product.all[i].name) {
      Product.all[i].votes += 1;
      console.log(event.target.id + ' has ' + Product.all[i].votes + ' votes in ' + Product.all[i].views + ' views.');
      //this keeps track of the number of views and the number of clicks
    }
  }
  displayPics();
}
//show the tally using the list in the DOM once the event listener has been removed
function showTally() {
  for (var i = 0; i < Product.all.length; i++) {
    var liEl = document.createElement('li');
    liEl.textContent = Product.all[i].name + ' has ' + Product.all[i].votes + ' votes in ' + Product.all[i].views + ' views.';
    //append the list item to the Product.tally created above globally for the unordered list
    Product.tally.appendChild(liEl);
  }
}
//________more localstorage stuff______//
if (localStorage.products){
  getProductInfo = localStorage.getItem('products');
  Product.all = JSON.parse(getProductInfo);
  getClick = localStorage.getItem('totalClicks');
  Product.totalClicks = JSON.parse(getClick);
}
//^_______new localstorage stuff______^//

//first add the cdn link to the head of your html
//find the chart object in the console and inspect it ex: myChart, myChart.data, myChart.datasets[0].data
//the data renders how hight he bar chart will be
//data: [], will hold the votes for each product image
//Labels: ['red' etc] will hold the name for each product
//myChart.update() is the method you will need to keep an eye on
//ex: myChart.data.datasets[0].data[0] = 4 assigns a new value to it
//myChart.update() //should change the value and update the chart

//this holds the value for the votes of each product image

//this is the name for each product
function makeChart() {
  var labelColors = ['red', 'blue', 'yellow', 'green', 'purple', 'orange', '#C7F2FF', '#d4ac0d', '#138d75', '#2e86c1', '#884ea0', '#c0392b', '#0692ff', '#0a7a5f', '#e3a968', '#f19898', '#035404', '#68edf0', '#a0a8d6', '#68edf0', '#035404'];

var ctx = document.getElementById('chart').getContext('2d');

var myChart = new Chart(ctx, {
    type: 'bar', 
    data: {
        labels: Product.names,
        datasets: [{
            label: '# of Votes',
            data:   Product.votesData,
            backgroundColor: labelColors
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
}


Product.container.addEventListener('click', handleClick);
displayPics();