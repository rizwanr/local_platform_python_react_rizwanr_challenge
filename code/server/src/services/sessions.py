"""
Session helpers for ZenFlow.

As a learner, you don't need to worry about this file.
It includes basic setup code for session management using Flask's
built-in signed-cookie sessions.
"""

import functools
from flask import session, jsonify, request as flask_request
from src.services.errors import ZenFlowUnauthorizedError


def get_user_id(req=None) -> str:
    """Return the userId stored in the Flask session, or raise ZenFlowUnauthorizedError."""
    user = session.get("user")
    if not user or not user.get("id"):
        raise ZenFlowUnauthorizedError("User not found in session")
    return user["id"]


def set_user_id(user_id: str) -> None:
    """Persist a userId into the Flask session."""
    session["user"] = {"id": user_id}


def clear_session() -> None:
    """Clear the Flask session."""
    session.clear()


def require_auth(f):
    """
    Decorator that enforces authentication.
    Returns a 401 JSON response if no valid session exists.
    """
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        try:
            get_user_id()
        except ZenFlowUnauthorizedError:
            return jsonify({"error": {"message": "User not found"}}), 401
        return f(*args, **kwargs)
    return decorated
