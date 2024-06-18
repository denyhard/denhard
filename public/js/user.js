var searchdata;

document.addEventListener("DOMContentLoaded", function () {
  // isAuthenticated(); // Check authentication
  if (isAuthenticated()) {
    if (isAdmin()) {
      // alert('You Are Not Admin')
      return (window.location.href = "admin.html");
    }
    // loadJournals();
  }

  fetch("/api/journals/my", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const journalList = document.getElementById("journal-list");
      if (data.error) {
        localStorage.removeItem("jwt");
        window.location.href = "login.html";
      }
      searchdata = data;
      data.forEach((journal) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>
        <div>${journal.title}</div>
          <div><small><a href="/api/journals/${
            journal.id
          }/download" target="_blank">Download File</a>
        </small></div> 
        </td><td>${journal.description}</td><td>${
          journal.status || ""
        }</td><td ><div><div class="form-control" disabled rows="6" cols="12">${
          journal.revision.length == 0 ? "-" : journal.revision
        }</div></div>
          </td>
          <td>
          <div class="d-flex">
                  <button type="button" ${
                    journal.status == "approved" ? "disabled" : ""
                  } class="btn btn-primary w-50 btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#modaledit" data-id="${
          journal.id
        }" data-title="${journal.title}" data-description="${
          journal.description
        }" data-status="${journal.status}">
                      Edit
                  </button>
                  <div class="px-2">
                  </div>
                  <button type="button" ${
                    journal.status == "approved" ? "disabled" : ""
                  } class="btn btn-danger w-50 btn-sm delete-btn" data-bs-toggle="modal" data-bs-target="#modaldelete" data-id="${
          journal.id
        }">
                      Delete
                  </button>
              </div></td>`;
        journalList.appendChild(tr);
      });
      attachModalListeners();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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

// document.getElementById("search").addEventListener("input", function (event) {
//   event.preventDefault();
//   // Implement fetch API to post the changes
//   var search = document.getElementById("search").value;
//   const journalList = document.getElementById("journal-list");
//   if (search.length == 0) {
//     document.getElementById("journal-list").innerHTML = "";
//     searchdata.forEach((journal) => {
//       const tr = document.createElement("tr");
//       tr.innerHTML = `<td>
//         <div>${journal.title}</div>
//           <div><small><a href="/api/journals/${
//             journal.id
//           }/download" target="_blank">Download File</a>
//         </small></div> 
//         </td><td>${journal.description}</td><td>${
//         journal.status || ""
//       }</td><td ><div>${
//         journal.revision.length == 0 ? "-" : journal.revision
//       }</div>
//           </td>
//           <td>
//           <div class="d-flex">
//                   <button type="button" ${
//                     journal.status == "approved" ? "disabled" : ""
//                   } class="btn btn-primary btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#modaledit" data-id="${
//         journal.id
//       }" data-title="${journal.title}" data-description="${
//         journal.description
//       }" data-status="${journal.status}">
//                       Edit
//                   </button>
//                   <div class="w-25">
//                   </div>
//                   <button type="button" ${
//                     journal.status == "approved" ? "disabled" : ""
//                   } class="btn btn-danger btn-sm delete-btn" data-bs-toggle="modal" data-bs-target="#modaldelete" data-id="${
//         journal.id
//       }">
//                       Delete
//                   </button>
//               </div></td>`;
//       journalList.appendChild(tr);
//     });
//     attachModalListeners();
//     return;
//   }
//   if (search.length < 2) {
//     return;
//   }

//   document.getElementById("journal-list").innerHTML = "";

//   searchdata.forEach((journal) => {
//     if (journal.title.includes(search)) {
//       const tr = document.createElement("tr");
//       tr.innerHTML = `<td>
//         <div>${journal.title}</div>
//           <div><small><a href="/api/journals/${
//             journal.id
//           }/download" target="_blank">Download File</a>
//         </small></div> 
//         </td><td>${journal.description}</td><td>${
//         journal.status || ""
//       }</td><td ><div>${
//         journal.revision.length == 0 ? "-" : journal.revision
//       }</div>
//           </td>
//           <td>
//           <div class="d-flex">
//                   <button type="button" ${
//                     journal.status == "approved" ? "disabled" : ""
//                   } class="btn btn-primary btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#modaledit" data-id="${
//         journal.id
//       }" data-title="${journal.title}" data-description="${
//         journal.description
//       }" data-status="${journal.status}">
//                       Edit
//                   </button>
//                   <div class="w-25">
//                   </div>
//                   <button type="button" ${
//                     journal.status == "approved" ? "disabled" : ""
//                   } class="btn btn-danger btn-sm delete-btn" data-bs-toggle="modal" data-bs-target="#modaldelete" data-id="${
//         journal.id
//       }">
//                       Delete
//                   </button>
//               </div></td>`;
//       journalList.appendChild(tr);
//     }
//   });
// });

// Add event listeners to forms for submitting changes
document
  .getElementById("editForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // Implement fetch API to post the changes
    var id = document.getElementById("editId").value;
    var title = document.getElementById("editTitle").value;
    var description = document.getElementById("editDescription").value;

    fetch(`/api/journals/user/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload();
      });
  });

document
  .getElementById("deleteForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var id = document.getElementById("deleteId").value;

    fetch(`/api/journals/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload();
      });
    // Implement fetch API to delete the item
  });

function logout() {
  localStorage.removeItem("jwt");
  window.location.reload();
}
