import api_utils


MEMBER_ENDPOINT = 'https://api.congress.gov/v3/member'
selected_keys = ['bioguideId', 'name', 'partyName', 'state']
csv_filename = "../members.csv"

json_data = api_utils.get_json_data(MEMBER_ENDPOINT)
new_field_names = ['MEMBERID', 'NAME', 'PARTY', 'STATE']
if json_data is not None and 'members' in json_data:
    api_utils.write_to_csv(json_data['members'], selected_keys, csv_filename, new_field_names)
else:
    print("Failed to get JSON data or 'members' key not found")