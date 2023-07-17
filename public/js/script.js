function showPw() {
    var x = document.querySelector(".password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  

document.getElementById("new-employee").style.display = "none";

document.getElementById("newemplink").onclick = function() {
  document.getElementById("new-employee").style.display = "block";
}