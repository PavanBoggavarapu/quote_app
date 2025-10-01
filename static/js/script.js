// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    const quoteForm = document.getElementById('quote-form');
    const messageAlert = document.getElementById('message-alert');

    // Function to fade out elements
    function fadeOut(element) {
        element.style.transition = 'opacity 0.5s ease-out';
        element.style.opacity = '0';
    }

    // Function to fade in elements
    function fadeIn(element) {
        element.style.transition = 'opacity 0.5s ease-in';
        element.style.opacity = '1';
    }

    // Function to update quote with fade effect
    async function updateQuote(quote) {
        // Fade out
        fadeOut(quoteText);
        fadeOut(quoteAuthor);
        
        // Wait for fade out to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update content
        quoteText.textContent = quote.text;
        quoteAuthor.textContent = quote.author;
        
        // Fade in
        fadeIn(quoteText);
        fadeIn(quoteAuthor);
    }

    // Event listener for "Get New Quote" button
    newQuoteBtn.addEventListener('click', async function() {
        try {
            const response = await fetch('/random_quote');
            if (!response.ok) {
                throw new Error('Failed to fetch quote');
            }
            const quote = await response.json();
            await updateQuote(quote);
        } catch (error) {
            console.error('Error fetching new quote:', error);
            showMessage('Failed to load new quote. Please try again.', 'danger');
        }
    });

    // Function to show temporary message
    function showMessage(message, type = 'success') {
        messageAlert.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    }

    // Event listener for quote form submission
    quoteForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(quoteForm);
        const quoteData = {
            text: document.getElementById('quote-text-input').value.trim(),
            author: document.getElementById('author-input').value.trim()
        };

        try {
            const response = await fetch('/submit_quote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quoteData)
            });

            const result = await response.json();

            if (result.success) {
                showMessage(result.message);
                // Reset and close modal
                quoteForm.reset();
                const modal = bootstrap.Modal.getInstance(document.getElementById('submitModal'));
                modal.hide();
            } else {
                showMessage(result.message, 'warning');
            }
        } catch (error) {
            console.error('Error submitting quote:', error);
            showMessage('Failed to submit quote. Please try again.', 'danger');
        }
    });
});