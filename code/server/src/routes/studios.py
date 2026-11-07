from flask import Blueprint, jsonify, request
from src.services.studios import (
    list_studios,
    get_studio,
    create_studio,
    create_sample_studio,
)
from src.services.sessions import get_user_id, require_auth
from src.services.errors import ZenFlowBadRequestError

studios_bp = Blueprint("studios", __name__)


@studios_bp.route("/studios", methods=["GET"])
@require_auth
def get_studios():
    user_id = get_user_id()
    studios = list_studios(user_id)
    return jsonify({"studios": studios}), 200


@studios_bp.route("/studios/<studio_id>", methods=["GET"])
@require_auth
def get_studio_by_id(studio_id: str):
    studio = get_studio(studio_id)
    return jsonify({"studio": studio}), 200


@studios_bp.route("/studios", methods=["POST"])
@require_auth
def post_studio():
    user_id = get_user_id()
    body = request.json or {}

    name = body.get("name", "").strip()
    if not name:
        raise ZenFlowBadRequestError("Error creating studio: name is required")

    max_capacity = body.get("maxCapacity")
    if max_capacity is None:
        raise ZenFlowBadRequestError("Error creating studio: maxCapacity is required")

    data = {"name": name, "maxCapacity": int(max_capacity)}
    studio = create_studio(data, user_id)
    return jsonify({"studio": studio}), 201


@studios_bp.route("/studios/quickstart", methods=["POST"])
@require_auth
def quickstart_studios():
    user_id = get_user_id()

    create_sample_studio(user_id)
    create_sample_studio(user_id)
    create_sample_studio(user_id)

    studios = list_studios(user_id)
    return jsonify({"studios": studios}), 200
