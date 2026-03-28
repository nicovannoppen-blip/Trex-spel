document.addEventListener("DOMContentLoaded", () => {

  const menu = document.getElementById("menu");
  const game = document.getElementById("game");

  document.getElementById("btnClick").addEventListener("click", () => {
    startMode("click");
  });

  document.getElementById("btnRunner").addEventListener("click", () => {
    startMode("runner");
  });

  function startMode(mode){
    console.log("Mode gestart:", mode); // 👈 dit zie je in console

    menu.classList.add("hidden");
    game.classList.remove("hidden");
  }

});
