class LinkedInService:

    def __init__(self):
        print("LinkedIn Service Started")

    def create_post(self, message):

        return {
            "platform": "LinkedIn",
            "message": message,
            "status": "Ready"
        }