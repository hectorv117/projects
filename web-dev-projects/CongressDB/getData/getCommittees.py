import api_utils


COMMITTEES_ENDPOINT = 'https://api.congress.gov/v3/committee/117/house'
selected_keys = ['systemCode', 'name', 'chamber']
csv_filename = "../committees.csv"

json_data = api_utils.get_json_data(COMMITTEES_ENDPOINT)
new_field_names = ['COMMITTEEID', 'NAME', 'CHAMBER']
if json_data is not None and 'committees' in json_data:
    api_utils.write_to_csv(json_data['committees'], selected_keys, csv_filename, new_field_names)
else:
    print("Failed to get JSON data or 'committees' key not found")
