// public/js/admin.js
document.addEventListener("DOMContentLoaded", function () {
  isAdmin(); // Cek autentikasi

  fetch("/api/journals/all", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const userList = document.getElementById("user-list");
      if (data.error) {
        localStorage.removeItem("jwt");
        window.location.href = "login.html";
      }
      data.forEach((user) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${user.title}</td><td>${user.description}</td><td>${
          user.status || ""
        }</td><td><div>${
          user.revision.length == 0 ? "-" : user.revision
        }</div><div><button>Add Revision</button></div></td>`;
        userList.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error("Error:", error.response);
    });
});
