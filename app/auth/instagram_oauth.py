from urllib.parse import urlencode
import requests


from app.config.settings import (
    INSTAGRAM_APP_ID,
    INSTAGRAM_APP_SECRET,
    INSTAGRAM_REDIRECT_URI
)



class InstagramOAuth:


    INSTAGRAM_AUTH_URL = "https://www.instagram.com/oauth/authorize"

    INSTAGRAM_TOKEN_URL = "https://api.instagram.com/oauth/access_token"



    def get_login_url(self, user_id):


        params = {


            "client_id": INSTAGRAM_APP_ID,

            "redirect_uri": INSTAGRAM_REDIRECT_URI,

            "scope":
            "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments",

            "response_type":"code",

            "state":str(user_id),

            "prompt":"login"

        }


        return (

            self.INSTAGRAM_AUTH_URL

            +

            "?"

            +

            urlencode(params)

        )





    def get_access_token(self, code):


        data = {


            "client_id": INSTAGRAM_APP_ID,

            "client_secret": INSTAGRAM_APP_SECRET,

            "grant_type":"authorization_code",

            "redirect_uri":INSTAGRAM_REDIRECT_URI,

            "code":code

        }



        response = requests.post(

            self.INSTAGRAM_TOKEN_URL,

            data=data

        )


        return response.json()





    def get_user_info(self, access_token):


        url = "https://graph.instagram.com/v22.0/me"



        params = {


            "fields":"id,username",

            "access_token":access_token

        }



        response = requests.get(

            url,

            params=params

        )


        return response.json()