/* БУРКОВ · Кричев — меню, карта зон, поиск марок, заявки в WhatsApp */
(function () {
  "use strict";
  var PHONE = "375339939808";

  /* меню */
  var burger = document.getElementById("burger");
  var drawer = document.getElementById("drawer");
  var dclose = document.getElementById("drawerClose");
  function setDrawer(open) {
    if (!drawer) return;
    drawer.setAttribute("data-open", open ? "true" : "false");
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (burger) burger.addEventListener("click", function () { setDrawer(true); });
  if (dclose) dclose.addEventListener("click", function () { setDrawer(false); });
  if (drawer) drawer.addEventListener("click", function (e) { if (e.target === drawer) setDrawer(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setDrawer(false); });

  /* аккордеон */
  document.querySelectorAll(".faq__q").forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.closest(".faq__i");
      var isOpen = item.getAttribute("data-open") === "true";
      item.parentElement.querySelectorAll('.faq__i[data-open="true"]').forEach(function (o) {
        if (o !== item) o.setAttribute("data-open", "false");
      });
      item.setAttribute("data-open", isOpen ? "false" : "true");
      q.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
  });

  /* карта зон обработки */
  var ZONES = {
    dno: ["Днище", "Основная площадь обработки: мойка, сушка, обезжиривание и нанесение состава по всей поверхности днища, с проливом швов и стыков."],
    arki: ["Подкрылки и арки", "Снимаем подкрылки, обрабатываем арки и внутренние поверхности, затем ставим всё на место — или меняем крепёж, если он уже не держит."],
    lonzh: ["Лонжероны", "Силовые элементы кузова: проливаем изнутри, там где скапливается влага и начинается коррозия, которую не видно снаружи."],
    dveri: ["Двери", "Внутренние полости дверей и нижняя кромка — типичное место начала ржавчины. По желанию делаем вместе с шумоизоляцией."],
    bagazh: ["Багажник", "Пол, ниши и внутренние полости крыльев: вода и грязь уходят, металл получает защиту."],
    kapot: ["Капот", "Обрабатываем капот изнутри, аккуратно по кромкам и рёбрам жёсткости — без следов на внешней стороне."],
    podkap: ["Подкапотное пространство", "Работаем после мойки: чашки, брызговики, внутренние полости крыльев и проблемные швы."],
    skrytye: ["Скрытые полости", "Стойки, усилители, пороги изнутри: наносим через технологические отверстия специальными насадками."],
    porogi: ["Пороги", "Наружная обработка и пролив изнутри — там, где коррозия обычно и начинается."],
    rama: ["Рама", "Для рамных внедорожников, грузовых и спецтехники: обработка рамы, креплений и подвески быстросохнущими составами."]
  };
  var out = document.getElementById("zoneOut");
  function showZone(id) {
    var z = ZONES[id];
    if (!z || !out) return;
    out.querySelector("h3").textContent = z[0];
    out.querySelector("p").textContent = z[1];
    document.querySelectorAll("[data-zone]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-zone") === id ? "true" : "false");
    });
  }
  document.querySelectorAll("[data-zone]").forEach(function (b) {
    b.addEventListener("click", function () { showZone(b.getAttribute("data-zone")); });
  });

  /* поиск по маркам */
  var search = document.getElementById("brandSearch");
  if (search) {
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-brand]"));
    var empty = document.getElementById("brandEmpty");
    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase().replace(/ё/g, "е");
      var shown = 0;
      items.forEach(function (a) {
        var hay = (a.getAttribute("data-brand") + " " + (a.getAttribute("data-ru") || "")).toLowerCase().replace(/ё/g, "е");
        var hit = !q || hay.indexOf(q) > -1;
        a.hidden = !hit;
        if (hit) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    });
  }

  /* формы → WhatsApp */
  document.querySelectorAll("form[data-wa]").forEach(function (form) {
    var outEl = form.querySelector(".formout");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var phoneEl = form.querySelector('[name="phone"]');
      var phone = phoneEl ? phoneEl.value.trim() : "";
      if (phone.replace(/\D/g, "").length < 6) {
        if (outEl) { outEl.className = "formout msg--err"; outEl.textContent = "Укажите телефон, чтобы мы могли перезвонить."; }
        if (phoneEl) phoneEl.focus();
        return;
      }
      var labels = { name: "Имя", phone: "Телефон", car: "Авто", what: "Услуга", message: "Сообщение" };
      var lines = ["Здравствуйте! Заявка с сайта ИП Бурков К. М."];
      ["name", "phone", "car", "what", "message"].forEach(function (k) {
        var el = form.querySelector('[name="' + k + '"]');
        if (el && el.value && el.value.trim()) lines.push(labels[k] + ": " + el.value.trim());
      });
      lines.push(form.getAttribute("data-wa") || "Прошу связаться со мной.");
      window.open("https://wa.me/" + PHONE + "?text=" + encodeURIComponent(lines.join("\n")), "_blank");
      if (outEl) { outEl.className = "formout"; outEl.textContent = "Открыли WhatsApp с готовым сообщением — останется нажать «Отправить»."; }
    });
  });

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
