(() => {
    const form = document.getElementById('feedback-form');
    const typeInput = document.getElementById('feedback-type');
    const pageField = document.getElementById('suggested-page-field');
    const message = document.getElementById('feedback-message');
    const submissionsKey = 'ourPalestineSubmissions';

    function updateType() {
        pageField.hidden = typeInput.value !== 'edit';
    }

    typeInput.addEventListener('change', updateType);
    updateType();

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.reportValidity()) {
            return;
        }

        try {
            const saved = localStorage.getItem(submissionsKey);
            const submissions = saved ? JSON.parse(saved) : [];
            if (!Array.isArray(submissions)) {
                throw new Error('Saved submissions have an invalid format.');
            }

            const values = new FormData(form);
            const session = JSON.parse(localStorage.getItem('ourPalestineSession') || '{}');
            submissions.unshift({
                id: crypto.randomUUID(),
                type: values.get('type'),
                key: values.get('key'),
                title: String(values.get('title')).trim(),
                text: String(values.get('text')).trim(),
                name: String(values.get('name')).trim() || session.name || 'Community member',
                email: String(values.get('email')).trim() || session.email || '',
                date: new Date().toLocaleDateString()
            });
            localStorage.setItem(submissionsKey, JSON.stringify(submissions));
            form.reset();
            updateType();
            message.textContent = 'Thanks! Your submission is waiting for admin review.';
        } catch (error) {
            console.error('Could not save your feedback.', error);
            message.textContent = 'Your submission could not be saved. Check that browser storage is available.';
        }
    });
})();
