import logging

logger = logging.getLogger("uvicorn.error")
handler = logging.FileHandler("app.log") # Change this path to the desired log file path
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
#logger.setLevel(logging.INFO)  
logger.setLevel(logging.DEBUG)
