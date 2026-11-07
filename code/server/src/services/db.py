"""
Thread-safe JSON file database singleton.
Mirrors the behaviour of the Node.js lowdb-based DatabaseService.
"""

import json
import os
import threading
from datetime import datetime, timezone

DB_FILE_PATH = "db.json"

INIT_DB = {
    "users": {},
    "workshops": {},
    "studios": {},
    "instructors": {},
    "platform": {},
}


def _serialise(obj):
    """Recursively make an object JSON-serialisable."""
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, dict):
        return {k: _serialise(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_serialise(v) for v in obj]
    return obj


class DatabaseService:
    def __init__(self):
        self._lock = threading.Lock()
        self._data: dict = {}

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    def init(self) -> None:
        with self._lock:
            if os.path.exists(DB_FILE_PATH):
                try:
                    with open(DB_FILE_PATH, "r", encoding="utf-8") as f:
                        self._data = json.load(f)
                except (json.JSONDecodeError, OSError):
                    self._data = {}

            # Ensure every top-level collection exists
            for key, default in INIT_DB.items():
                if key not in self._data:
                    self._data[key] = default

            self._write_locked()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def save_data(self, collection: str, key: str, value: dict) -> None:
        with self._lock:
            entry = dict(value)
            entry["updatedAt"] = datetime.now(timezone.utc).isoformat()
            self._data[collection][key] = entry
            self._write_locked()

    def load_data(self, collection: str, key: str):
        with self._lock:
            return self._data.get(collection, {}).get(key)

    def search_data(self, collection: str, predicate_fn) -> list:
        with self._lock:
            return [
                v
                for v in self._data.get(collection, {}).values()
                if predicate_fn(v)
            ]

    def delete_data(self, collection: str, key: str) -> None:
        with self._lock:
            self._data.get(collection, {}).pop(key, None)
            self._write_locked()

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _write_locked(self) -> None:
        """Must be called while self._lock is held."""
        with open(DB_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(_serialise(self._data), f, indent=2)


# Singleton instance
db_service = DatabaseService()
