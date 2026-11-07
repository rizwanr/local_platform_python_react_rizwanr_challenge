from flask import Blueprint, jsonify, request
from src.services.instructors import (
    list_instructors,
    get_instructor,
    create_instructor,
    create_sample_instructor,
)
from src.services.sessions import get_user_id, require_auth
from src.services.errors import ZenFlowBadRequestError

instructors_bp = Blueprint("instructors", __name__)


@instructors_bp.route("/instructors", methods=["GET"])
@require_auth
def get_instructors():
    user_id = get_user_id()
    instructors = list_instructors(user_id)
    return jsonify({"instructors": instructors}), 200


@instructors_bp.route("/instructors/<instructor_id>", methods=["GET"])
@require_auth
def get_instructor_by_id(instructor_id: str):
    instructor = get_instructor(instructor_id)
    return jsonify({"instructor": instructor}), 200


@instructors_bp.route("/instructors", methods=["POST"])
@require_auth
def post_instructor():
    user_id = get_user_id()
    body = request.json or {}

    name = body.get("name", "").strip()
    if not name:
        raise ZenFlowBadRequestError("Error creating instructor: name is required")

    data = {
        "name": name,
        "profilePhoto": body.get("profilePhoto", ""),
    }
    instructor = create_instructor(data, user_id)
    return jsonify({"instructor": instructor}), 201


@instructors_bp.route("/instructors/quickstart", methods=["POST"])
@require_auth
def quickstart_instructors():
    user_id = get_user_id()

    for _ in range(5):
        create_sample_instructor(user_id)

    instructors = list_instructors(user_id)
    return jsonify({"instructors": instructors}), 200
