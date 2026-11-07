import uuid
from faker import Faker
from src.services.db import db_service
from src.services.errors import ZenFlowNotFoundError

_faker = Faker()


def create_instructor(data: dict, user_id: str) -> dict:
    instructor_id = f"instrct_{uuid.uuid4()}"

    instructor = {
        **data,
        "id": instructor_id,
        "userId": user_id,
    }

    db_service.save_data("instructors", instructor_id, instructor)
    return instructor


def create_sample_instructor(user_id: str) -> dict:
    sex = _faker.random_element(["male", "female"])
    name = f"{_faker.first_name_male() if sex == 'male' else _faker.first_name_female()} {_faker.last_name()}"
    profile_photo = _faker.image_url(width=200, height=200)

    return create_instructor({"name": name, "profilePhoto": profile_photo}, user_id)


def get_instructor(instructor_id: str) -> dict:
    instructor = db_service.load_data("instructors", instructor_id)
    if not instructor:
        raise ZenFlowNotFoundError(f"Instructor not found: {instructor_id}")
    return instructor


def list_instructors(user_id: str) -> list:
    instructors = db_service.search_data(
        "instructors", lambda item: item.get("userId") == user_id
    )
    if instructors is None:
        raise ZenFlowNotFoundError("Instructors not found")
    return instructors
