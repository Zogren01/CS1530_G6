let username = localStorage.getItem("username");

function displayHome() {
  console.log(username);
  document.getElementById("un").innerHTML = username;
  //update the score values based on database information
}
//Code for side navigation menu
  /* Set the width of the side navigation to 250px */
  function openNav() {
      document.getElementById("mySidenav").style.width = "250px";
    }
  
  /* Set the width of the side navigation to 0 */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
//End code for side navigation menu

//Code for game links
  function selectMath(){
    console.log("math");
    localStorage.setItem("subject","Math");
  }
  function selectScience(){
    console.log("science");
    localStorage.setItem("subject","Science");
  }
  function selectHistory(){
    console.log("history");
    localStorage.setItem("subject","History");
  }
  function selectEnglish(){
    console.log("english");
    localStorage.setItem("subject","English");
  }
//Ene code for game links