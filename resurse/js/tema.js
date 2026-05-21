(function () {
  // Citeste tema din localStorage; daca nu exista, default = dark
  var temaSalvata = localStorage.getItem("tema") || "dark";

  // Aplica tema imediat pe <html> pentru a evita flash-ul de culoare
  document.documentElement.setAttribute("data-tema", temaSalvata);
  document.documentElement.setAttribute("data-bs-theme", temaSalvata);

  document.addEventListener("DOMContentLoaded", function () {
    var btnTema = document.getElementById("btn-tema");
    if (!btnTema) return;

    var iconTema = document.getElementById("icon-tema");
    var temaCurenta = localStorage.getItem("tema") || "dark";

    // Seteaza iconita corecta la incarcare
    actualizeazaIcon(temaCurenta);

    btnTema.addEventListener("click", function () {
      temaCurenta = temaCurenta === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-tema", temaCurenta);
      document.documentElement.setAttribute("data-bs-theme", temaCurenta);

      localStorage.setItem("tema", temaCurenta);

      actualizeazaIcon(temaCurenta);
    });

    function actualizeazaIcon(tema) {
      if (!iconTema) return;
      if (tema === "dark") {
        // In dark mode, afisam luna
        iconTema.className = "fa-solid fa-moon";
      } else {
        // In light mode, afisam soarele
        iconTema.className = "fa-solid fa-sun";
      }
    }
  });
})();
