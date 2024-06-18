var searchdata;
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
      searchdata = data;
      data.forEach((user) => {
        // console.log(user)
        const tr = document.createElement("tr");
        tr.innerHTML = `<td><div>${user.title} </div>
        <div><small><a href="/api/journals/${
          user.id
        }/download" target="_blank">Download File</a>
      </small></div> </td><td>${user.description}</td><td>${
          user.status || ""
        }</td><td><div><div class="div" disabled rows="6" cols="12">
        ${user.revision.length == 0 ? "-" : user.revision}
        </div></div></td>
        <td>
        <div class="d-flex">
        <div style="margin-right:5px !important">
        <button class="btn btn-success" onclick="updateStatus(${user.id}, 'approved')">Approve</button>
        </div>
        <div style="margin-right:5px !important">
        <button class="btn btn-danger" onclick="updateStatus(${
          user.id
        }, 'declined')" class="decline">Decline</button>
        </div>
        <div style="margin-right:5px !important"><button class="btn btn-primary" onclick="addRevision(${
          user.id
        })" data-bs-toggle="modal" data-bs-target="#modaladd">Add Revision</button></div>
        </div>
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

function attachModalListeners() {
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const title = this.getAttribute("data-title");
      const description = this.getAttribute("data-description");
      const status = this.getAttribute("data-status");

      document.getElementById("editId").value = id;
      document.getElementById("editTitle").value = title;
      document.getElementById("editDescription").value = description;
      document.getElementById("editStatus").value = status;
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      document.getElementById("deleteId").value = id;
    });
  });
}

document.getElementById("search").addEventListener("input", function (event) {
  event.preventDefault();
  // Implement fetch API to post the changes
  var search = document.getElementById("search").value;
  const journalList = document.getElementById("user-list");
  if (search.length == 0) {
    document.getElementById("user-list").innerHTML = "";
    searchdata.forEach((user) => {
      // console.log(user)
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${user.title}</td><td>${user.description}</td><td>${
        user.status || ""
      }</td><td><div class="form-control" >
        ${user.revision.length == 0 ? "-" : user.revision}
        </div></td>
        <td>
        <div class="d-flex">
        <div style="margin-right:5px !important">
        <button  onclick="updateStatus(${user.id}, 'approved')">Approve</button>
        </div>
        <div style="margin-right:5px !important">
        <button onclick="updateStatus(${
          user.id
        }, 'declined')" class="decline">Decline</button>
        </div>
        <div style="margin-right:5px !important"><button onclick="addRevision(${
          user.id
        })" data-bs-toggle="modal" data-bs-target="#modaladd">Add Revision</button></div>
        </div>
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

  document.getElementById("user-list").innerHTML = "";

  searchdata.forEach((user) => {
    if (user.title.includes(search)) {
      // console.log(user)
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${user.title}</td><td>${user.description}</td><td>${
        user.status || ""
      }</td><td><div><div class="form-control">
        ${user.revision.length == 0 ? "-" : user.revision}
        </div></div></td>
        <td>
        <div class="d-flex">
        <div style="margin-right:5px !important">
        <button  onclick="updateStatus(${user.id}, 'approved')">Approve</button>
        </div>
        <div style="margin-right:5px !important">
        <button onclick="updateStatus(${
          user.id
        }, 'declined')" class="decline">Decline</button>
        </div>
        <div style="margin-right:5px !important"><button onclick="addRevision(${
          user.id
        })" data-bs-toggle="modal" data-bs-target="#modaladd">Add Revision</button></div>
        </div>
    </td>
`;
      journalList.appendChild(tr);
    }
  });
});

function addRevision(d) {
  // console.log(d)
  document.getElementById("editTitle").value = "";
  document.getElementById("editId").value = d;
}
