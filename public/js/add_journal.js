document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-journal-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const fileInput = document.getElementById('file');
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('file', fileInput.files[0]);

        fetch('/api/journals', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert('Journal added successfully!');
            window.location.href = 'user.html'; // Redirect to user dashboard or any appropriate page
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add journal.');
        });
    });
});
