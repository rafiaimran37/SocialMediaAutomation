class FacebookService:

    def __init__(self):
        print("Facebook Service Started")

    def create_post(self, message):

        return {
            "platform": "Facebook",
            "message": message,
            "status": "Ready"
        }