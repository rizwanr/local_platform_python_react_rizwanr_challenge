import stripe
from flask import jsonify


class ZenFlowError(Exception):
    code = 500

    def __init__(self, message: str, code: int = 500):
        super().__init__(message)
        self.code = code


class ZenFlowNotFoundError(ZenFlowError):
    def __init__(self, message: str):
        super().__init__(message, 404)


class ZenFlowBadRequestError(ZenFlowError):
    def __init__(self, message: str):
        super().__init__(message, 400)


class ZenFlowUnauthorizedError(ZenFlowError):
    def __init__(self, message: str):
        super().__init__(message, 401)


def error_handler(e: Exception):
    print(f"handling error {e}")
    if isinstance(e, stripe.StripeError):
        code = int(e.http_status) if e.http_status else 500
        message = f"{e.error.type}: {e.user_message}" if e.error else str(e)
    elif isinstance(e, ZenFlowError):
        code = e.code
        message = str(e)
    else:
        code = 500
        message = str(e) if str(e) else "Unknown error"
        print(f"Error: {code}: {message}")

    return jsonify({"error": {"message": message}}), code
