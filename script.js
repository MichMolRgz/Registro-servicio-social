const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbxl_KARn4TEG2KA0VAFYRnw48ey7DlBAEAyeb8UphW2MjjFW156F1yuCDI-yz1WCRJZ/exec";

const UBICACION_PERMITIDA = {
  lat: 25.64732078497229,
  lng: -100.29012497772246
};

const RADIO_METROS = 300;

function mostrarMensaje(texto, tipo) {
  const div = document.getElementById("mensaje");
  div.innerText = texto;
  div.style.display = "block";

  if (tipo === "ok") {
    div.style.background = "#d1fae5";
    div.style.color = "#065f46";
  } else {
    div.style.background = "#fee2e2";
    div.style.color = "#991b1b";
  }
}

function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = x => x * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function registrar(tipo) {
  const nombre = document.getElementById("nombre").value.trim();
  const matricula = document.getElementById("matricula").value.trim();

  if (!nombre || !matricula) {
    mostrarMensaje("❌ Completa todos los campos", "error");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const distancia = calcularDistancia(
        lat, lng,
        UBICACION_PERMITIDA.lat,
        UBICACION_PERMITIDA.lng
      );

      if (distancia > RADIO_METROS) {
        mostrarMensaje("❌ Fuera de la zona permitida", "error");
        return;
      }

      fetch(WEB_APP_URL, {
        method: "POST",
        body: JSON.stringify({
          nombre,
          matricula,
          tipo,
          ubicacion: `Lat:${lat},Lng:${lng}`
        })
      })
      .then(r => r.text())
      .then(res => {
        if (res === "OK") {
          mostrarMensaje(`✅ ${tipo} registrada`, "ok");
        } else {
          mostrarMensaje("❌ " + res, "error");
        }
      });
    },
    () => mostrarMensaje("❌ Activa la ubicación", "error")
  );
}
