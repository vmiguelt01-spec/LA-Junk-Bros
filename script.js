document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Mobile Navigation Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- 2. FAQ Accordion Functionality ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');

            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
                if (icon) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            } else {
                answer.style.maxHeight = null;
                if (icon) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            }
        });
    });

    // --- 3. LIVE-READY: Booking Form Handling ---
    // Changed from #schedule-form to #bookingForm to match your HTML
    const bookingForm = document.querySelector('#bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Collect data using specific IDs from your HTML
            const data = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                serviceType: document.getElementById('service').value,
                date: document.getElementById('date').value,
                message: document.getElementById('message').value
            };
            
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerText : "Submit Request";

            try {
                if (submitBtn) {
                    submitBtn.innerText = "Sending...";
                    submitBtn.disabled = true;
                }

                // Pointing to your server.js route
                    const response = await fetch("/api/book", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    alert("Success! Your pickup is scheduled. We will contact you at 818-400-0337 shortly.");
                    bookingForm.reset();
                } else {
                    throw new Error("Server error");
                }
            } catch (error) {
                console.error("Form Submission Error:", error);
                alert("Could not connect to the server. Please check your internet or call 818-400-0337.");
            } finally {
                if (submitBtn) {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
});