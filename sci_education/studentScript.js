// Initialize and set global database variables
var connection, connectionString, rs;
setDatabaseVars();
// End initialization of global variables

let username = localStorage.getItem("username");

function displayMenu() {
  console.log(username);
  document.getElementById("un").innerHTML = username;
  //read from database to get the scoress for each subject
  let m = 0; //returnScore("math"); //set to math score
  let s = 1; //returnScore("science");
  let h = 2; //returnScore("history");
  let e = 3; //returnScore("english");
  document.getElementById("ms").innerHTML = "Math Score: " + m;
  document.getElementById("ss").innerHTML = "Science Score: " + s;
  document.getElementById("hs").innerHTML = "History Score: " + h;
  document.getElementById("es").innerHTML = "English Score: " + e;
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
    localStorage.setItem("subject","math");
    window.location.href = "mathGame.html";
  }
  function selectScience(){
    console.log("science");
    localStorage.setItem("subject","science");
    window.location.href = "scienceGame.html";
  }
  function selectHistory(){
    console.log("history");
    localStorage.setItem("subject","history");
    window.location.href = "historyGame.html";
  }
  function selectEnglish(){
    console.log("english");
    localStorage.setItem("subject","english");
    window.location.href = "englishGame.html";
  }
//End code for game links
//Code for displaying assignment and chat pages
function loadAssignmentPage(){
  //load information for each student from database
}
function chat(){
  alert("Chat page is not yet implemented");
}
//End code for displaying assignment and chat pages

//Code for returning scores from database
function returnScore(subject) {
	//connection.Open(connectionString);
	strQuery = "SELECT " + subject + "Level FROM  dbo.profiles WHERE username = 'johnDoe'";
 
   	return strQuery;
	//return rs.Open(strQuery, connection);
}
function setDatabaseVars() {
	//connection = new ActiveXObject("ADODB.Connection");
    connectionString = "Data Source=GREYAREA; Initial Catalog=SCIsTheLimit; Integrated Security=FALSE; User ID=JR; Password=";
	//rs = new ActiveXObject("ADODB.Recordset");
}
//End code for returning scores from database