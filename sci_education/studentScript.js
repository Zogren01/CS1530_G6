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
    localStorage.setItem("subject","m");
  }
  function selectScience(){
    console.log("science");
    localStorage.setItem("subject","s");
  }
  function selectHistory(){
    console.log("history");
    localStorage.setItem("subject","h");
  }
  function selectEnglish(){
    console.log("english");
    localStorage.setItem("subject","e");
  }
//End code for game links



//SQL queries for retrieving Subject scores
/*
  function getMathScore() {
	SELECT mathLevel FROM dbo.profiles
	WHERE username = '$username';
  }
  function getHistoryScore() {	
    SELECT historyLevel FROM dbo.profiles
	WHERE username = '$username';
  }
  function getScienceScore() {
	SELECT scienceLevel FROM dbo.profiles
	WHERE username = '$username';
  }
  function getEnglishScore() {
    SELECT englishLevel FROM dbo.profiles
	WHERE username = '$username';
  }
*/
//End code for retrieving Subject scores