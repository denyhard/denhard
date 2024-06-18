var searchdata;
// public/js/admin.js
document.addEventListener("DOMContentLoaded", function () {
  isAdmin(); // Cek autentikasi

  fetch("/api/journals/approved", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const userList = document.getElementById("paper-list");
      if (data.error) {
        localStorage.removeItem("jwt");
        window.location.href = "login.html";
      }
      searchdata = data;
      data.forEach((user) => {
        // console.log(user)
        const tr = document.createElement("tr");
        tr.innerHTML = `<td><div>${user.title} </div>
        <div><small><a href="/api/journals/${user.id}/download" target="_blank">Download File</a>
      </small></div> </td><td>${user.description}</td>
    </td>
`;
        userList.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error("Error:", error.response);
    });

  const adminForm = document.getElementById("admin-form");
  if (adminForm) {
    adminForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const journalId = document.getElementById("editId").value;
      const revision = document.getElementById("editTitle").value;

      fetch(`/api/journals/${journalId}/update`, {
        // Adjust endpoint as necessary
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ revision }),
      })
        .then((response) => {
          if (response.ok) {
            alert("Paper status updated!");
            location.reload();
          } else {
            alert("Failed to update Paper status.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error updating Paper status.");
        });
    });
  }
});

document.getElementById("search").addEventListener("input", function (event) {
  event.preventDefault();
  // Implement fetch API to post the changes
  var search = document.getElementById("search").value;
  const journalList = document.getElementById("paper-list");
  if (search.length == 0) {
    document.getElementById("paper-list").innerHTML = "";
    searchdata.forEach((user) => {
      // console.log(user)
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>
      <div>${user.title}</div>
      <small><a href="/api/journals/${user.id}/download" target="_blank">Download File</a>
      </small>
      </td><td>${user.description}</td>
    </td>
`;
      journalList.appendChild(tr);
    });
    attachModalListeners();
    return;
  }
  if (search.length < 2) {
    return;
  }

  document.getElementById("paper-list").innerHTML = "";

  searchdata.forEach((user) => {
    if (user.title.includes(search)) {
      // console.log(user)
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${user.title}</td><td>${user.description}</td>
    </td>
`;
      journalList.appendChild(tr);
    }
  });
});
