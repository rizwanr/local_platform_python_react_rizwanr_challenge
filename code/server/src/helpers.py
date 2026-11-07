from datetime import datetime, timedelta


YOGA_TYPES = [
    'Hatha', 'Vinyasa', 'Ashtanga', 'Bikram', 'Yin',
    'Restorative', 'Power', 'Kundalini', 'Aerial', 'Anusara',
]


def title_case(s: str) -> str:
    return ' '.join(word.capitalize() for word in s.lower().split(' '))


def compute_start_end(date_str: str, start_time_str: str, duration_mins: int):
    """
    Given a date string (YYYY-MM-DD), a start time string (HH:MM),
    and a duration in minutes, return (start_datetime, end_datetime).
    """
    hour, minute = [int(p) for p in start_time_str.split(':')]
    padded_time = f"{hour:02d}:{minute:02d}"
    start = datetime.fromisoformat(f"{date_str}T{padded_time}")
    end = start + timedelta(minutes=duration_mins)
    return start, end


def check_for_conflicts(workshops: list, new_event: dict) -> str | None:
    """
    Check whether new_event conflicts with any existing workshop.
    new_event must have keys: date, startTime, duration, studioId.
    Returns an error string if there is a conflict, or None.
    """
    start, end = compute_start_end(
        new_event['date'],
        new_event['startTime'],
        int(new_event['duration']),
    )

    if start < datetime.now():
        return 'Cannot schedule workshops in the past.'

    for workshop in workshops:
        existing_start = workshop['start']
        existing_end = workshop['end']

        # Normalise to datetime if stored as string
        if isinstance(existing_start, str):
            existing_start = datetime.fromisoformat(existing_start)
        if isinstance(existing_end, str):
            existing_end = datetime.fromisoformat(existing_end)

        same_studio = workshop.get('studioId') == new_event.get('studioId')
        overlaps = start < existing_end and end > existing_start

        if same_studio and overlaps:
            return 'This time slot conflicts with an existing workshop.'

    return None
