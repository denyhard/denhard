document.addEventListener('DOMContentLoaded', function() {
    if (isAuthenticated()) {
        if (!isAdmin()) {
            alert('You Are Not Admin')
            return window.location.href = 'login.html';
        }
        loadJournals();
    }
});

function loadJournals() {
    fetch('/api/journals/all', {  // Adjust endpoint as necessary
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('journals-table').getElementsByTagName('tbody')[0];
        data.forEach(journal => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${journal.id}</td>
                <td>
                <div>${journal.title}</div>
                <div><small><a href="/api/journals/${
                    journal.id
                  }/download" target="_blank">Download File</a>
                </small></div> 
                </td>
                <td>${journal.description}</td>
                <td>${journal.status}</td>
                <td>
                    <button onclick="updateStatus(${journal.id}, 'approved')">Approve</button>
                    <button onclick="updateStatus(${journal.id}, 'declined')" class="decline">Decline</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function updateStatus(journalId, status) {
    fetch(`/api/journals/${journalId}/update`, { // Adjust endpoint as necessary
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    })
    .then(response => {
        if (response.ok) {
            alert('Journal status updated!');
            location.reload();
        } else {
            alert('Failed to update journal status.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error updating journal status.');
    });
}
