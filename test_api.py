import requests

# headers={'Content-Type':'application/json', 'Authorization':'Token YMeRr4orcu61ZW9MSXzep3zCKkxerhIl'}


# url = requests.post('http://localhost:8000/api/v1/save_click_data/', headers=headers)
# data = {
#     "website_title": "Test",
#     "website_url": "http://example.com",
#     "referrer": "Google",
#     "ip_address": "192.168.1.1",
#     "os": "Windows",
#     "device": "Laptop",
#     "browser": "Chrome"
# }

# response = requests.post(url, headers=headers, json=data)
# print("Request Headers:", response.request.headers)
# print("Response Headers:", response.headers)
# print("Response Content:", response.content.decode("utf-8"))


# http POST "http://localhost:8000/api/v1/save_click_data/?api_key=YMeRr4orcu61ZW9MSXzep3zCKkxerhIl"    
# http POST "http://localhost:8000/api/v1/save_click_data/" "Authorization: Token YMeRr4orcu61ZW9MSXzep3zCKkxerhIl" "api_key=YMeRr4orcu61ZW9MSXzep3zCKkxerhIl"
# http POST "http://localhost:8000/api/v1/save_click_data/" "Authorization: Token p47jqSLPdNFVciY6M0egHs9oonEgcD93" "api_key=p47jqSLPdNFVciY6M0egHs9oonEgcD93"


import requests

url = "http://localhost:8000/api/v1/save_click_data/"
# headers = {'Content-Type':'application/json', 'Authorization':'Token ac9af6a8e95272182b5a3df8ad1ae858b0735e96'}
headers = {'Content-Type':'application/json', 'Authorization':'Token ac9af6a8e95272182b5a3df8ad1ae858b0735e96'}
data = {
    "api_key": "ac9af6a8e95272182b5a3df8ad1ae858b0735e96",
    "website_title": "Test",
    "website_url": "http://example.com",
    "referrer": "Google",
    "ip_address": "8.8.8.8",
    "os": "Windows",
    "device": "Laptop",
    "browser": "Chrome"
}

response = requests.post(url, headers=headers, json=data)

print("Request Headers:", response.request.headers)
print("Response Headers:", response.headers)
print("Response Content:", response.content.decode("utf-8"))

# url = "http://localhost:8000/api/v1/save_click_data/"

# data = {
#     "website_title": "Test",
#     "website_url": "http://example.com",
#     "referrer": "Google",
#     "ip_address": "192.168.1.1",
#     "os": "Windows",
#     "device": "Laptop",
#     "browser": "Chrome"
# }

# response = requests.post(url, headers=headers, json=data)

# print("Request Headers:", response.request.headers)
# print("Response Headers:", response.headers)
# print("Response Content:", response.content.decode("utf-8"))