from . import main_bp
from flask import render_template, request, jsonify
from pkg.models import db, Appointment
from datetime import datetime

# A list of services to dynamically populate the form
SERVICES = [
    "Emergency Leak Repair",
    "Drain Unclogging & Cleaning",
    "Water Heater Installation",
    "Toilet Repair & Installation",
    "Full Bathroom & Kitchen Plumbing",
    "Gas Piping Services",
    "General Plumbing Maintenance"
]

@main_bp.route('/')
def landing():
    """Renders the main landing page."""
    return render_template('main/home.html', services=SERVICES)

@main_bp.route('/book-appointment', methods=['POST'])
def book_appointment():
    """Handles the appointment form submission."""
    try:
        data = request.form
        
        # In a real app, you'd have more robust validation here
        if not all([data.get('name'), data.get('phone'), data.get('address'), data.get('service'), data.get('date')]):
            return jsonify({'success': False, 'message': 'Missing required fields.'}), 400

        # Combine date string with a default time if needed, or get time from form
        # For simplicity, we assume the date string is in a parsable format.
        appointment_date = datetime.strptime(data.get('date'), '%Y-%m-%d %H:%M')

        new_appointment = Appointment(
            customer_name=data.get('name'),
            phone_number=data.get('phone'),
            address=data.get('address'),
            service_needed=data.get('service'),
            appointment_time=appointment_date
        )

        db.session.add(new_appointment)
        db.session.commit()
        
        # Here you would also trigger an email notification to the business owner
        # For the demo, we just return a success message
        
        return jsonify({'success': True, 'message': 'Appointment booked successfully! We will call you to confirm.'})

    except Exception as e:
        # Log the error in a real app
        print(f"Error booking appointment: {e}")
        return jsonify({'success': False, 'message': 'An error occurred. Please try again later.'}), 500