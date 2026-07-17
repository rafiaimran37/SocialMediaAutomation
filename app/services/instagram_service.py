class InstagramService:

    def __init__(self):
        print("Instagram Service Started")

    def create_post(self, message):

        return {
            "platform": "Instagram",
            "message": message,
            "status": "Ready"
        }