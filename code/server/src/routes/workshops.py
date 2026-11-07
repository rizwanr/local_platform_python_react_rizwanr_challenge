from flask import Blueprint, jsonify, request
from src.services.workshops import (
    create_workshop,
    create_sample_workshops,
    get_workshop,
    list_workshops,
    update_workshop,
    delete_workshop,
    refund_workshop_attendee,
)
from src.services.studios import get_studio
from src.services.sessions import get_user_id, require_auth
from src.helpers import check_for_conflicts, compute_start_end
from src.services.errors import ZenFlowBadRequestError

workshops_bp = Blueprint("workshops", __name__)

REQUIRED_FORM_FIELDS = ["name", "instructorId", "studioId", "capacity", "amount", "date", "startTime", "duration"]


def _validate_workshop_form(body: dict) -> dict:
    """Validate and coerce workshop form fields. Raises ZenFlowBadRequestError on failure."""
    errors = []
    for field in REQUIRED_FORM_FIELDS:
        if field not in body or body[field] in (None, ""):
            errors.append(f"{field} is required")

    if errors:
        raise ZenFlowBadRequestError(f"Error creating workshop: {', '.join(errors)}")

    try:
        return {
            "name": str(body["name"]),
            "instructorId": str(body["instructorId"]),
            "studioId": str(body["studioId"]),
            "capacity": int(body["capacity"]),
            "amount": int(body["amount"]),
            "date": str(body["date"]),
            "startTime": str(body["startTime"]),
            "duration": int(body["duration"]),
        }
    except (ValueError, TypeError) as e:
        raise ZenFlowBadRequestError(f"Error creating workshop: {e}")


@workshops_bp.route("/workshops", methods=["POST"])
@require_auth
def post_workshop():
    user_id = get_user_id()
    body = request.json or {}

    form = _validate_workshop_form(body)

    existing_workshops = list_workshops(user_id)
    conflict = check_for_conflicts(existing_workshops, form)
    if conflict:
        raise ZenFlowBadRequestError(f"Error creating workshop: {conflict}")

    date = form.pop("date")
    start_time = form.pop("startTime")
    duration = form.pop("duration")
    studio_id = form["studioId"]

    start, end = compute_start_end(date, start_time, duration)
    studio = get_studio(studio_id)
    capacity = studio["maxCapacity"]

    workshop_data = {
        **form,
        "start": start,
        "end": end,
        "capacity": capacity,
    }

    workshop = create_workshop(workshop_data, user_id)
    return jsonify({"workshop": workshop}), 201


@workshops_bp.route("/workshops", methods=["GET"])
@require_auth
def get_workshops():
    user_id = get_user_id()
    workshops = list_workshops(user_id)
    return jsonify({"workshops": workshops}), 200


@workshops_bp.route("/workshops/quickstart", methods=["POST"])
@require_auth
def quickstart_workshops():
    user_id = get_user_id()
    workshops = create_sample_workshops(user_id)
    return jsonify({"workshops": workshops}), 200


@workshops_bp.route("/workshops/<workshop_id>", methods=["GET"])
@require_auth
def get_workshop_by_id(workshop_id: str):
    workshop = get_workshop(workshop_id)
    return jsonify({"workshop": workshop}), 200


@workshops_bp.route("/workshops/<workshop_id>", methods=["PUT"])
@require_auth
def put_workshop(workshop_id: str):
    body = request.json or {}
    update_workshop(workshop_id, body)
    return jsonify({"workshop": body}), 200


@workshops_bp.route("/workshops/<workshop_id>", methods=["DELETE"])
@require_auth
def del_workshop(workshop_id: str):
    delete_workshop(workshop_id)
    return jsonify({"message": "Workshop deleted"}), 200


"""
Milestone 4: Tracking payments and handling disputes

Add a POST route at /workshops/:workshopId/refund to process refunds for workshop attendees.
"""
# TODO: Integrate Stripe
