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