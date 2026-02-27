from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import re
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

# In-memory user storage (replace with database in production)
users = {}

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one digit"
    return True, "Password is valid"

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        role = data.get('role', '').strip().lower()

        # Validation
        if not all([name, email, password, role]):
            return jsonify({'error': 'All fields are required'}), 400

        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400

        if role not in ['student', 'alumni', 'admin']:
            return jsonify({'error': 'Invalid role. Must be student, alumni, or admin'}), 400

        # Check if user already exists
        if email in users:
            return jsonify({'error': 'User with this email already exists'}), 409

        # Validate password
        is_valid, password_msg = validate_password(password)
        if not is_valid:
            return jsonify({'error': password_msg}), 400

        # Create user
        hashed_password = generate_password_hash(password)
        user_id = str(len(users) + 1)

        users[email] = {
            'id': user_id,
            'name': name,
            'email': email,
            'password': hashed_password,
            'role': role,
            'created_at': datetime.utcnow().isoformat(),
            'is_active': True
        }

        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': user_id,
                'name': name,
                'email': email,
                'role': role
            }
        }), 201

    except Exception as e:
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        role = data.get('role', '').strip().lower()

        # Validation
        if not all([email, password, role]):
            return jsonify({'error': 'Email, password, and role are required'}), 400

        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400

        if role not in ['student', 'alumni', 'admin']:
            return jsonify({'error': 'Invalid role'}), 400

        # Check if user exists
        user = users.get(email)
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        # Check password
        if not check_password_hash(user['password'], password):
            return jsonify({'error': 'Invalid email or password'}), 401

        # Check role
        if user['role'] != role:
            return jsonify({'error': 'Invalid role for this account'}), 401

        # Check if user is active
        if not user.get('is_active', True):
            return jsonify({'error': 'Account is deactivated'}), 401

        # Create session
        session['user_id'] = user['id']
        session['email'] = user['email']
        session['role'] = user['role']

        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        }), 200

    except Exception as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """User logout endpoint"""
    try:
        session.clear()
        return jsonify({'message': 'Logout successful'}), 200
    except Exception as e:
        return jsonify({'error': 'Logout failed', 'details': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    """Get current user profile"""
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401

        user_id = session['user_id']
        user = None

        # Find user by ID
        for email, user_data in users.items():
            if user_data['id'] == user_id:
                user = user_data
                break

        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Return user data without password
        user_profile = {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'role': user['role'],
            'created_at': user['created_at'],
            'is_active': user['is_active']
        }

        return jsonify({'user': user_profile}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to get profile', 'details': str(e)}), 500

@auth_bp.route('/check', methods=['GET'])
def check_auth():
    """Check if user is authenticated"""
    try:
        if 'user_id' in session:
            return jsonify({
                'authenticated': True,
                'user': {
                    'id': session['user_id'],
                    'email': session['email'],
                    'role': session['role']
                }
            }), 200
        else:
            return jsonify({'authenticated': False}), 401
    except Exception as e:
        return jsonify({'error': 'Auth check failed', 'details': str(e)}), 500
