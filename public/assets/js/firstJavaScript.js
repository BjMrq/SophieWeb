var navil = document.querySelectorAll(".nav-item");

for (var i = 0; i < navil.length; i++){
  navil[i].addEventListener("click", function(){
    this.innerHTML = "Go!";
  });
}
