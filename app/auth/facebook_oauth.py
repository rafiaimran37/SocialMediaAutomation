from urllib.parse import urlencode
import requests

from app.config.settings import (
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    FACEBOOK_REDIRECT_URI
)


class FacebookOAuth:

    FACEBOOK_AUTH_URL = "https://www.facebook.com/v19.0/dialog/oauth"
    FACEBOOK_TOKEN_URL = "https://graph.facebook.com/v19.0/oauth/access_token"


    def get_login_url(self, user_id, client_id):

        params = {

            "client_id": FACEBOOK_APP_ID,

            "redirect_uri": FACEBOOK_REDIRECT_URI,

            "scope": (
                "public_profile,"
                "email,"
                "pages_show_list,"
                "pages_read_engagement,"
                "pages_manage_posts,"
                "pages_manage_metadata"
            ),

            "response_type": "code",

            "state": f"{user_id}:{client_id}",

            "auth_type": "reauthorize"
        }


        return (
            f"{self.FACEBOOK_AUTH_URL}?"
            f"{urlencode(params)}"
        )



    def get_access_token(self, code):

        params = {

            "client_id": FACEBOOK_APP_ID,

            "client_secret": FACEBOOK_APP_SECRET,

            "redirect_uri": FACEBOOK_REDIRECT_URI,

            "code": code
        }


        response = requests.get(
            self.FACEBOOK_TOKEN_URL,
            params=params
        )


        print("TOKEN RESPONSE:")
        print(response.json())


        return response.json()



    def get_user_info(self, access_token):

        url = "https://graph.facebook.com/v19.0/me"


        params = {

            "fields": "id,name,email",

            "access_token": access_token
        }


        response = requests.get(
            url,
            params=params
        )


        print("FACEBOOK USER:")
        print(response.json())


        return response.json()



    # Get Facebook Pages
    def get_pages(self, access_token):

        url = "https://graph.facebook.com/v19.0/me/accounts"


        params = {

            "fields": "id,name,access_token",

            "access_token": access_token
        }


        response = requests.get(
            url,
            params=params
        )


        print("====================")
        print("PAGE API STATUS:")
        print(response.status_code)

        print("PAGE API RESPONSE:")
        print(response.json())

        print("====================")


        return response.json()



    # Get first Page token
    def get_page_access_token(self, user_access_token):

        pages = self.get_pages(
            user_access_token
        )


        if (
            "data" in pages
            and len(pages["data"]) > 0
        ):

            page = pages["data"][0]


            print("SELECTED PAGE:")
            print(page)


            return {

                "page_id": page.get("id"),

                "page_name": page.get("name"),

                "page_access_token": page.get("access_token")
            }


        print("NO FACEBOOK PAGE FOUND")


        return {

            "page_id": None,

            "page_name": None,

            "page_access_token": None
        }