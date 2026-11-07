import uuid
from faker import Faker
from src.helpers import title_case
from src.services.db import db_service
from src.services.errors import ZenFlowNotFoundError

_faker = Faker()


def create_studio(data: dict, user_id: str) -> dict:
    studio_id = f"stdio_{uuid.uuid4()}"

    studio = {
        **data,
        "id": studio_id,
        "userId": user_id,
    }

    db_service.save_data("studios", studio_id, studio)
    return studio


def _sample_studio_name() -> str:
    return title_case(f"{_faker.color_name()} {_faker.word(ext_word_list=None)}")


def create_sample_studio(user_id: str) -> dict:
    name = title_case(f"{_faker.color_name()} {_faker.bs().split()[0]}")
    max_capacity = _faker.random_element([10, 15, 20, 25, 30])

    return create_studio({"name": name, "maxCapacity": max_capacity}, user_id)


def get_studio(studio_id: str) -> dict:
    studio = db_service.load_data("studios", studio_id)
    if not studio:
        raise ZenFlowNotFoundError(f"Studio not found: {studio_id}")
    return studio


def list_studios(user_id: str) -> list:
    studios = db_service.search_data(
        "studios", lambda item: item.get("userId") == user_id
    )
    if studios is None:
        raise ZenFlowNotFoundError("Studios not found")
    return studios


def delete_studio(studio_id: str) -> dict:
    studio = db_service.load_data("studios", studio_id)
    if not studio:
        raise ZenFlowNotFoundError(f"Studio not found for ID: {studio_id}")

    db_service.delete_data("studios", studio_id)
    return {
        "success": True,
        "message": f"Studio with ID {studio_id} deleted successfully.",
    }
