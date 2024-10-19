from fastapi import APIRouter

router = APIRouter(
    prefix="/config",
    tags=["config"]
)

# TODO showFeedback is already set correctly in the Frontend based on this but it is
# not handled correctly yet. Basically we set a variable in the Frontend to True/False
# but we don't use it anywhere yet. At the moment the feedback form is always shown.
@router.get("/")
def get_config():
    config = {
        "showFeedback": True,  # Set to False to hide the feedback form
    }
    return config


