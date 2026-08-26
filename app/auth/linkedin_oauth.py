import requests
from urllib.parse import urlencode

from app.config.settings import (
    LINKEDIN_CLIENT_ID,
    LINKEDIN_CLIENT_SECRET,
    LINKEDIN_REDIRECT_URI
)


class LinkedInOAuth:

    def __init__(self):
        self.client_id = LINKEDIN_CLIENT_ID
        self.client_secret = LINKEDIN_CLIENT_SECRET
        self.redirect_uri = LINKEDIN_REDIRECT_URI


    def get_login_url(self, user_id):

        params = {
            "response_type": "code",
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "state": str(user_id),

            # permissions
            "scope": "openid profile email w_member_social",

            # force new login
            "prompt": "login",

            # disable previous session
            "reauthenticate": "true"
        }


        return (
            "https://www.linkedin.com/oauth/v2/authorization?"
            + urlencode(params)
        )



    def get_access_token(self, code):

        url = "https://www.linkedin.com/oauth/v2/accessToken"


        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": self.redirect_uri,
            "client_id": self.client_id,
            "client_secret": self.client_secret
        }


        response = requests.post(
            url,
            data=data
        )


        return response.json()



    def get_user_info(self, access_token):

        url = "https://api.linkedin.com/v2/userinfo"


        headers = {
            "Authorization": f"Bearer {access_token}"
        }


        response = requests.get(
            url,
            headers=headers
        )


        return response.json()