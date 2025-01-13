import requests
import csv
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv('API_KEY')


def get_json_data(url):
    try:
        res = requests.get(url, params={'api_key': api_key})
        res.raise_for_status()

        json_data = res.json()
        return json_data
    
    except requests.exceptions.RequestException as e:
        print('Errors making the request:', e)
        return None

def write_to_csv(json_data, selected_keys, csv_filename, new_field_names):
    try:
        with open(csv_filename, mode='w', newline='') as csvfile:
            fieldnames = selected_keys
            writer = csv.DictWriter(csvfile, fieldnames=new_field_names)
            writer.writeheader()

            for entry in json_data:
                filtered_entry = {key: entry[key] for key in selected_keys if key in entry}
                dic_with_different_key_names = {new_field_names[i]: filtered_entry[selected_keys[i]] for i in range(len(selected_keys))}
                writer.writerow(dic_with_different_key_names)

            print(f"Data written to csv {csv_filename} successfully")
    except IOError:
        print(f"Error writing to {csv_filename}")
