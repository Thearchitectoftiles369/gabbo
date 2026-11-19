// Waiting-list form.  No libraries, no tracking, no cookies.
(function () {
  "use strict";
  var API = "https://rooms-api-329816320351.europe-west1.run.app/waitlist";
  var form = document.getElementById("join");
  if (!form) { return; }
  var box = document.getElementById("msg");
  var button = form.querySelector("button.go");

  function show(kind, text) {
    box.className = "msg show " + kind;
    box.textContent = text;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var interests = Array.prototype.map.call(
      form.querySelectorAll('input[name="interest"]:checked'),
      function (el) { return el.value; }
    );
    var payload = {
      email: form.email.value,
      interests: interests,
      language: form.language.value,
      consent: form.consent.checked,
      website: form.website.value
    };
    button.disabled = true;
    box.className = "msg";
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (data) {
        if (response.ok) {
          form.reset();
          show("ok", "You're on the list. We'll email you once, when Gabbo is ready.");
        } else if (response.status === 422 && typeof data.detail === "string") {
          show("err", data.detail);
        } else if (response.status === 429) {
          show("err", "Lots of people are signing up right now. Please try again in a minute.");
        } else {
          show("err", "Something went wrong. Please try again later.");
        }
      });
    }).catch(function () {
      show("err", "Could not reach the server. Check your connection and try again.");
    }).then(function () {
      button.disabled = false;
    });
  });
})();
