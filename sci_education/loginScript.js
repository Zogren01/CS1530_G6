function login() {
    var type = document.getElementById("account type").value.toLowerCase();
    var username = document.getElementById("username").value;
    
    if(type == "t"){
      window.location.href = "teacherHome.html";
    }
    else if(type == "s"){
      window.location.href = "studentHome.html";
    }
    else{
      alert("Invalid account type");
    }
    localStorage.setItem("username", username);
  }
function createAccount(){
  var username = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var pw = document.getElementById("confpassword").value;
  //refer to documentation to check the requirements for username and password
  if(username.length > 20 || username.length < 6){
    alert("Username must be less than 20 characters long")
  }
  else if(password.length < 6 || password.length > 20){
    alert("Password must be at least 6 characters long")
  }
  else if(password != pw){
    alert("Entered passwords do not match")
  }
  else if(email.length < 6){ //actually check the email
    alert("Enter a valid email")
  }
  else{
    //add information to database
    alert("Account created successfully")
    localStorage.setItem("username", username);
    window.location.href = "teacherHome.html";
  }
}