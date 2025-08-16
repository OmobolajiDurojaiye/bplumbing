document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const ctaButton = document.getElementById("cta-book-btn");
  const bookingSection = document.getElementById("booking-section");
  const calendarInput = document.getElementById("calendar-input");
  const calendarStep = document.getElementById("calendar-step");
  const bookingForm = document.getElementById("booking-form");
  const selectedDateInput = document.getElementById("selected-date");
  const successMessage = document.getElementById("success-message");

  // Smooth reveal animation
  function revealBookingSection() {
    bookingSection.style.display = "block";
    bookingSection.style.opacity = "0";
    bookingSection.style.transform = "translateY(20px)";

    setTimeout(() => {
      bookingSection.style.transition = "all 0.4s ease";
      bookingSection.style.opacity = "1";
      bookingSection.style.transform = "translateY(0)";
    }, 10);

    // Smooth scroll with offset for fixed nav
    setTimeout(() => {
      const navHeight = document.querySelector(".nav").offsetHeight;
      const elementPosition = bookingSection.offsetTop - navHeight - 20;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }, 200);
  }

  // Show booking section on CTA click
  ctaButton.addEventListener("click", revealBookingSection);

  // Initialize Flatpickr calendar
  const calendar = flatpickr(calendarInput, {
    inline: true,
    minDate: "today",
    maxDate: new Date().fp_incr(30), // 30 days from today
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    time_24hr: false,
    minuteIncrement: 30,
    defaultHour: 9,
    defaultMinute: 0,
    minTime: "08:00",
    maxTime: "18:00",
    disable: [
      // Disable Sundays (0 = Sunday)
      function (date) {
        return date.getDay() === 0;
      },
    ],
    locale: {
      firstDayOfWeek: 1, // Start week on Monday
    },
    onChange: function (selectedDates, dateStr) {
      if (selectedDates.length > 0) {
        // Store selected date
        selectedDateInput.value = dateStr;

        // Update step indicator
        const stepNumber = calendarStep.querySelector(".step-number");
        stepNumber.style.background = "var(--accent)";

        // Show form with animation
        showBookingForm();
      }
    },
  });

  // Show booking form with smooth animation
  function showBookingForm() {
    bookingForm.style.display = "block";
    bookingForm.style.opacity = "0";
    bookingForm.style.transform = "translateY(20px)";

    setTimeout(() => {
      bookingForm.style.transition = "all 0.4s ease";
      bookingForm.style.opacity = "1";
      bookingForm.style.transform = "translateY(0)";

      // Scroll to form
      const navHeight = document.querySelector(".nav").offsetHeight;
      const elementPosition = bookingForm.offsetTop - navHeight - 20;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }, 100);
  }

  // Enhanced form validation
  function validateForm() {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const service = document.getElementById("service").value;

    const errors = [];

    if (name.length < 2) {
      errors.push("Please enter your full name");
    }

    if (!/^\d{11}$/.test(phone.replace(/\s+/g, ""))) {
      errors.push("Please enter a valid 11-digit phone number");
    }

    if (address.length < 10) {
      errors.push("Please provide a complete address");
    }

    if (!service) {
      errors.push("Please select a service type");
    }

    return errors;
  }

  // Show inline error messages
  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const existingError = field.parentNode.querySelector(".field-error");

    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.style.cssText =
      "color: #ef4444; font-size: 0.85rem; margin-top: 0.25rem;";
    errorDiv.textContent = message;

    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = "#ef4444";
  }

  // Clear field errors
  function clearFieldErrors() {
    const errors = document.querySelectorAll(".field-error");
    errors.forEach((error) => error.remove());

    const fields = document.querySelectorAll(
      "#booking-form input, #booking-form select"
    );
    fields.forEach((field) => {
      field.style.borderColor = "var(--border)";
    });
  }

  // Handle form submission
  bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    clearFieldErrors();
    const errors = validateForm();

    if (errors.length > 0) {
      // Show first error and focus field
      const firstError = errors[0];
      if (firstError.includes("name")) {
        showFieldError("name", firstError);
        document.getElementById("name").focus();
      } else if (firstError.includes("phone")) {
        showFieldError("phone", firstError);
        document.getElementById("phone").focus();
      } else if (firstError.includes("address")) {
        showFieldError("address", firstError);
        document.getElementById("address").focus();
      } else if (firstError.includes("service")) {
        showFieldError("service", firstError);
        document.getElementById("service").focus();
      }
      return;
    }

    // Show loading state
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = "<span>Processing...</span>";
    submitButton.disabled = true;

    // Prepare form data
    const formData = new FormData(bookingForm);

    // Submit form
    fetch("/book-appointment", {
      method: "POST",
      body: formData,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showSuccessMessage(data.message);
        } else {
          throw new Error(data.message || "Booking failed");
        }
      })
      .catch((error) => {
        console.error("Booking error:", error);
        showError(
          "Unable to complete booking. Please try again or call us directly."
        );
      })
      .finally(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      });
  });

  // Show success message with animation
  function showSuccessMessage(
    message = "Your appointment is booked. We will contact you shortly to confirm the details."
  ) {
    // Hide calendar and form
    calendarStep.style.transition = "all 0.4s ease";
    calendarStep.style.opacity = "0";
    calendarStep.style.transform = "translateY(-20px)";

    bookingForm.style.transition = "all 0.4s ease";
    bookingForm.style.opacity = "0";
    bookingForm.style.transform = "translateY(-20px)";

    setTimeout(() => {
      calendarStep.style.display = "none";
      bookingForm.style.display = "none";

      // Update success message
      const messageText = successMessage.querySelector("p");
      if (messageText) {
        messageText.textContent = message;
      }

      // Show success with animation
      successMessage.style.display = "block";
      successMessage.style.opacity = "0";
      successMessage.style.transform = "translateY(20px)";

      setTimeout(() => {
        successMessage.style.transition = "all 0.4s ease";
        successMessage.style.opacity = "1";
        successMessage.style.transform = "translateY(0)";

        // Scroll to success message
        const navHeight = document.querySelector(".nav").offsetHeight;
        const elementPosition = successMessage.offsetTop - navHeight - 20;

        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }, 100);
    }, 400);
  }

  // Show error message
  function showError(message) {
    // Create or update error message
    let errorDiv = document.querySelector(".error-message");

    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.style.cssText = `
                background: #fef2f2;
                border: 1px solid #fecaca;
                border-radius: var(--radius);
                padding: 1rem;
                margin: 1rem 0;
                color: #dc2626;
                text-align: center;
            `;
      bookingForm.appendChild(errorDiv);
    }

    errorDiv.textContent = message;
    errorDiv.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Phone number formatting
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
      if (value.length > 11) {
        value = value.slice(0, 11); // Limit to 11 digits
      }
      e.target.value = value;
    });
  }

  // Smooth navbar hide/show on scroll
  let lastScrollY = window.scrollY;
  const nav = document.querySelector(".nav");

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down & past threshold
      nav.style.transform = "translateY(-100%)";
    } else {
      // Scrolling up or at top
      nav.style.transform = "translateY(0)";
    }

    lastScrollY = currentScrollY;
  });

  // Add smooth transition to nav
  nav.style.transition = "transform 0.3s ease";
});
