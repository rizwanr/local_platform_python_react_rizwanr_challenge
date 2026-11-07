import os
from flask import Blueprint, jsonify

config_bp = Blueprint("config", __name__)


@config_bp.route("/config", methods=["GET"])
def get_config():
    return jsonify({"publishableKey": os.environ.get("STRIPE_PUBLISHABLE_KEY")})
