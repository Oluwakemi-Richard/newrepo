function showPw() {
    var x = document.getElementById("account_password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }