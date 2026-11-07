"""
Milestone 3: Collecting payments for classes
Milestone 4: Tracking payments and handling disputes
"""

import uuid
import math
from datetime import datetime, timezone, timedelta
from faker import Faker

from src.services.db import db_service
from src.clients.stripe_client import StripeClient
from src.services.instructors import get_instructor, list_instructors
from src.services.studios import get_studio, list_studios
from src.services.users import load_user_or_throw
from src.services.errors import ZenFlowError, ZenFlowNotFoundError
from src.helpers import YOGA_TYPES

_faker = Faker()


def _sample_workshop_name() -> str:
    return f"{_faker.random_element(YOGA_TYPES)} Yoga"


def _sample_amount() -> int:
    """Returns a random dollar amount between 50 and 100 in $5 increments."""
    multiples = list(range(50, 105, 5))
    return _faker.random_element(multiples)


def create_workshop(data: dict, user_id: str) -> dict:
    """
    Milestone 3: Collecting payments for classes

    Create a Price and Payment Link on the connected account so students can pay for this workshop.
    """
    user = load_user_or_throw(user_id)
    stripe_account = user["stripeAccount"]
    studio = get_studio(data["studioId"])

    # Use this id for the workshop object
    workshop_id = f"wkshp_{uuid.uuid4()}"

    # TODO: Integrate Stripe


def create_sample_workshops(user_id: str, workshops_per_studio: int = 7) -> list:
    instructors = list_instructors(user_id)
    studios = list_studios(user_id)

    if not instructors:
        raise ZenFlowError("No instructors available")
    if not studios:
        raise ZenFlowError("No studios available")

    today = datetime.now()
    current_hour = today.hour
    starting_hour = 9 if (current_hour < 9 or current_hour > 16) else current_hour + 1
    today = today.replace(hour=starting_hour, minute=0, second=0, microsecond=0)

    workshops = []
    for studio in studios:
        current_start_time = today

        for _ in range(workshops_per_studio):
            instructor = _faker.random_element(instructors)

            workshop_data = {
                "name": _sample_workshop_name(),
                "start": current_start_time,
                "end": current_start_time + timedelta(hours=1),
                "instructorId": instructor["id"],
                "studioId": studio["id"],
                "capacity": studio["maxCapacity"],
                "amount": _sample_amount(),
            }

            try:
                workshop = create_workshop(workshop_data, user_id)
                if not workshop:
                    raise ZenFlowError(
                        "create_workshop returned no result — make sure Milestone 3 is implemented"
                    )
                workshops.append(workshop)
            except Exception as e:
                print(
                    f"Failed to create workshop for studio {studio['name']} "
                    f"and instructor {instructor['name']}: {e}"
                )
                raise

            offset_minutes = _faker.random_element([0, 30, 60, 90, 120, 150, 180])
            current_start_time = current_start_time + timedelta(hours=1, minutes=offset_minutes)

            if current_start_time.hour >= 17:
                current_start_time = current_start_time.replace(
                    hour=9, minute=0, second=0, microsecond=0
                ) + timedelta(days=1)

    return workshops


def increment_event_attendees(checkout_session: dict) -> None:
    """
    Milestone 4: Tracking payments and handling disputes

    Update the workshop's attendee count when a checkout.session.completed event is received.
    """
    # TODO: Integrate Stripe


def get_workshop(workshop_id: str) -> dict:
    workshop = db_service.load_data("workshops", workshop_id.strip())
    if not workshop:
        raise ZenFlowNotFoundError(f"Workshop {workshop_id} not found")
    return workshop


def list_workshops(user_id: str) -> list:
    now = datetime.now(timezone.utc)

    def _active(item):
        if item.get("userId") != user_id:
            return False
        end = item.get("end")
        if not end:
            return False
        if isinstance(end, str):
            end_dt = datetime.fromisoformat(end)
            # Make timezone-aware for comparison if needed
            if end_dt.tzinfo is None:
                end_dt = end_dt.replace(tzinfo=timezone.utc)
        else:
            end_dt = end
            if end_dt.tzinfo is None:
                end_dt = end_dt.replace(tzinfo=timezone.utc)
        return end_dt >= now

    workshops = db_service.search_data("workshops", _active)
    if workshops is None:
        raise ZenFlowNotFoundError("Workshops not found")
    return workshops


def update_workshop(workshop_id: str, data: dict) -> None:
    db_service.save_data("workshops", workshop_id, data)


def delete_workshop(workshop_id: str) -> None:
    db_service.delete_data("workshops", workshop_id)


def refund_workshop_attendee(workshop_id: str, payment_intent_id: str, user_id: str):
    """
    Milestone 4: Tracking payments and handling disputes

    Issue a refund for the attendee and decrement the workshop's attendee count.
    """
    user = load_user_or_throw(user_id)
    stripe_account = user["stripeAccount"]
    workshop = get_workshop(workshop_id)

    # TODO: Integrate Stripe
