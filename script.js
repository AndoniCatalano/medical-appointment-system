let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

const appointmentForm = document.getElementById("appointmentForm");
const appointmentList = document.getElementById("appointmentList");

renderAppointments();

function addAppointment(firstName, lastName, appointmentDate, phone) {
    const newAppointment = {
        firstName,
        lastName,
        appointmentDate,
        phone
    };

    appointments.push(newAppointment);
    localStorage.setItem("appointments", JSON.stringify(appointments));
}

function appointmentExists(firstName, lastName) {
    return appointments.some(appointment =>
        appointment.firstName.toLowerCase() === firstName.toLowerCase() &&
        appointment.lastName.toLowerCase() === lastName.toLowerCase()
    );
}

function renderAppointments() {
    appointmentList.innerHTML = "";

    appointments.sort(
        (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
    );

    appointments.forEach((appointment, index) => {
        const li = document.createElement("li");
        const deleteButton = document.createElement("button");
        const whatsappButton = document.createElement("button");
        const span = document.createElement("span");

        const dateObj = new Date(appointment.appointmentDate);

        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        };

        const readableDate = dateObj.toLocaleString("en-US", options);

        span.textContent = `${appointment.firstName} ${appointment.lastName} — ${readableDate}`;

        deleteButton.textContent = "X";
        deleteButton.classList.add("btn-delete");

        whatsappButton.textContent = "WhatsApp";
        whatsappButton.classList.add("btn-whatsapp");

        li.appendChild(span);
        li.appendChild(whatsappButton);
        li.appendChild(deleteButton);
        appointmentList.appendChild(li);

        deleteButton.addEventListener("click", () => {
            appointments.splice(index, 1);
            localStorage.setItem("appointments", JSON.stringify(appointments));
            renderAppointments();
        });

        whatsappButton.addEventListener("click", () => {
            const phoneNumber = appointment.phone.replace(/\D/g, "");
            const message = `Hello ${appointment.firstName}! This is a reminder for your appointment on ${readableDate} 👍`;
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

            window.open(url, "_blank");
        });
    });
}

appointmentForm.addEventListener("submit", event => {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const appointmentDate = document.getElementById("appointmentDate").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (appointmentExists(firstName, lastName)) {
        alert("Appointment already exists");
        return;
    }

    addAppointment(firstName, lastName, appointmentDate, phone);
    renderAppointments();
    appointmentForm.reset();
});
