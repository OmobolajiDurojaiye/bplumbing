from . import main_bp
from flask import render_template, request, jsonify
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
    return render_template('main/home.html', services=SERVICES)

@main_bp.route('/book-appointment', methods=['POST'])
def book_appointment():
    """Handles the appointment form submission WITHOUT a database."""
    try:
        data = request.form
        
        # --- This is the new, simpler logic ---
        print("--- DEMO BOOKING RECEIVED ---")
        print(f"Name: {data.get('name')}")
        print(f"Phone: {data.get('phone')}")
        print(f"Address: {data.get('address')}")
        print(f"Service: {data.get('service')}")
        print(f"Date: {data.get('date')}")
        print("-----------------------------")
        # ------------------------------------

        return jsonify({'success': True, 'message': 'Appointment request sent! We will call you to confirm.'})

    except Exception as e:
        print(f"Error processing booking: {e}")
        return jsonify({'success': False, 'message': 'An error occurred. Please try again later.'}), 500