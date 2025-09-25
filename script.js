document.addEventListener('DOMContentLoaded', async function() {
    // Load configuration first
    await window.AppConfig.loadConfig();
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            section.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Handle form submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! Our team will contact you soon.');
        contactForm.reset();
    });

    // Add scroll animation for elements
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all service cards and feature items
    document.querySelectorAll('.service-card, .feature-item').forEach(el => {
        observer.observe(el);
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.backgroundColor = 'var(--white)';
        }
    });

    // Modal functionality
    const modal = document.getElementById('demoModal');
    const openModalBtn = document.getElementById('openDemoModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const demoForm = document.getElementById('demoForm');

    openModalBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Handle demo form submission
    demoForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        console.log('Demo form submitted!');

        // Check if phone number is verified before proceeding
        if (!phoneVerified) {
            alert('Please verify your phone number before submitting the form.');
            return;
        }

        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            number: document.getElementById('phone').value,
            evaluationType: document.getElementById('evaluationType').value
        };

        // Validate required fields
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.number || !formData.evaluationType) {
            alert('Please fill in all required fields.');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Validate phone number format (should be exactly 10 digits)
        const phoneDigits = formData.number.replace(/\D/g, '');
        if (phoneDigits.length !== 10) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }

        console.log('Form data collected:', formData);

        // Show loading state
        const submitButton = demoForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;

        try {
            // Send data to the API endpoint from configuration
            const apiUrl = window.AppConfig.get('api.base_url');
            console.log('API URL from config:', apiUrl);
            
            console.log('Sending request to:', apiUrl);
            console.log('Request payload:', JSON.stringify(formData, null, 2));
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                mode: 'cors'
            });
            
            console.log('Response received:', response);
            console.log('Response status:', response.status);
            console.log('Response status text:', response.statusText);
            
            // Try to get response body
            let responseText = '';
            let responseData = null;
            try {
                responseText = await response.text();
                console.log('Response body:', responseText);
                if (responseText) {
                    responseData = JSON.parse(responseText);
                }
            } catch (bodyError) {
                console.log('Could not parse response body:', bodyError);
            }
            
            if (response.ok) {
                // Success message
                alert('Thank you for your interest! Our team will call you shortly.');
                demoForm.reset();
                modal.classList.remove('active');
                // Reset phone verification state
                phoneVerified = false;
                if (verifyPhoneBtn) {
                    verifyPhoneBtn.textContent = 'Verify';
                    verifyPhoneBtn.disabled = false;
                    verifyPhoneBtn.style.background = 'linear-gradient(90deg, #2c6eb5 60%, #64b5f6 100%)';
                }
                if (codeGroup) {
                    codeGroup.style.display = 'none';
                }
            } else {
                // Handle different error status codes
                let errorMessage = 'Sorry, there was an error submitting your request.';
                if (response.status === 400) {
                    errorMessage = 'Please check your information and try again.';
                } else if (response.status === 500) {
                    errorMessage = 'Our server is experiencing issues. Please try again later.';
                } else if (response.status === 429) {
                    errorMessage = 'Too many requests. Please wait a moment and try again.';
                }
                
                if (responseData && responseData.message) {
                    errorMessage = responseData.message;
                }
                
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Sorry, there was an error submitting your request. Please try again later.');
        } finally {
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });

    // Phone number validation and formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        // Remove any non-digit characters
        let cleaned = e.target.value.replace(/\D/g, '');
        
        // Limit to 10 digits (US phone number format)
        if (cleaned.length > 10) {
            cleaned = cleaned.slice(0, 10);
        }
        
        // Format the phone number as XXX-XXX-XXXX
        if (cleaned.length > 0) {
            if (cleaned.length <= 3) {
                cleaned = cleaned;
            } else if (cleaned.length <= 6) {
                cleaned = cleaned.slice(0,3) + '-' + cleaned.slice(3);
            } else {
                cleaned = cleaned.slice(0,3) + '-' + cleaned.slice(3,6) + '-' + cleaned.slice(6,10);
            }
        }
        e.target.value = cleaned;
        
        // Reset phone verification if phone number changes
        if (phoneVerified) {
            phoneVerified = false;
            if (verifyPhoneBtn) {
                verifyPhoneBtn.textContent = 'Verify';
                verifyPhoneBtn.disabled = false;
                verifyPhoneBtn.style.background = 'linear-gradient(90deg, #2c6eb5 60%, #64b5f6 100%)';
            }
            if (codeGroup) {
                codeGroup.style.display = 'none';
            }
        }
    });

    // --- Phone Verification for Demo Modal ---
    let sentCode = null;
    let phoneVerified = false;

    const verifyPhoneBtn = document.getElementById('verifyPhoneBtn');
    const codeGroup = document.getElementById('codeGroup');
    const verificationCodeInput = document.getElementById('verificationCode');

    if (verifyPhoneBtn && codeGroup && verificationCodeInput && phoneInput) {
        verifyPhoneBtn.addEventListener('click', async function() {
            // Check if phone number is valid before sending code
            const phoneNumber = phoneInput.value.replace(/\D/g, '');
            if (phoneNumber.length !== 10) {
                alert('Please enter a valid 10-digit phone number.');
                return;
            }
            
            // Show loading state
            const originalBtnText = verifyPhoneBtn.textContent;
            verifyPhoneBtn.textContent = 'Sending...';
            verifyPhoneBtn.disabled = true;
            
            try {
                // Send verification code via Twilio API
                const verificationApiUrl = window.AppConfig.get('twilio.verification_api_url');
                const response = await fetch(verificationApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phoneNumber: phoneNumber,
                        countryCode: '+1' // Assuming US phone numbers
                    })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    phoneVerified = false;
                    codeGroup.style.display = 'block';
                    verificationCodeInput.value = '';
                    verificationCodeInput.focus();
                    alert('A 6-digit verification code has been sent to your phone. Please check your messages.');
                } else {
                    throw new Error('Failed to send verification code');
                }
            } catch (error) {
                console.error('Error sending verification code:', error);
                alert('Sorry, there was an error sending the verification code. Please try again.');
            } finally {
                // Reset button state
                verifyPhoneBtn.textContent = originalBtnText;
                verifyPhoneBtn.disabled = false;
            }
        });

        verificationCodeInput.addEventListener('input', async function() {
            // Only allow digits
            this.value = this.value.replace(/\D/g, '');
            
            if (verificationCodeInput.value.length === 6) {
                // Verify the code with the API
                const phoneNumber = phoneInput.value.replace(/\D/g, '');
                const verificationCode = verificationCodeInput.value;
                
                try {
                    const verificationApiUrl = window.AppConfig.get('twilio.verification_api_url');
                    const response = await fetch(verificationApiUrl.replace('/send-verification', '/verify-code'), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            phoneNumber: phoneNumber,
                            code: verificationCode,
                            countryCode: '+1'
                        })
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        if (result.verified) {
                            phoneVerified = true;
                            alert('Phone number verified successfully!');
                            codeGroup.style.display = 'none';
                            verifyPhoneBtn.textContent = 'Verified ✓';
                            verifyPhoneBtn.disabled = true;
                            verifyPhoneBtn.style.background = '#4caf50';
                        } else {
                            phoneVerified = false;
                            alert('Incorrect code. Please try again.');
                            verificationCodeInput.value = '';
                            verificationCodeInput.focus();
                        }
                    } else {
                        throw new Error('Verification failed');
                    }
                } catch (error) {
                    console.error('Error verifying code:', error);
                    alert('Incorrect code. Please try again.');
                    verificationCodeInput.value = '';
                    verificationCodeInput.focus();
                }
            }
        });

        // Phone verification is now handled in the main form submission handler
    }
    // --- End Phone Verification ---
}); 