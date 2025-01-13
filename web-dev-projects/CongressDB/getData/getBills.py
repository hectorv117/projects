from collections import defaultdict
import api_utils
import csv

BILLS_ENDPOINT = 'https://api.congress.gov/v3/bill'
selected_keys = ['number', 'title', 'type']
csv_filename = "../bills.csv"

json_data = api_utils.get_json_data(BILLS_ENDPOINT)
new_field_names = ['BILLID', 'NAME', 'TYPE']
if json_data is not None and 'bills' in json_data:
    api_utils.write_to_csv(json_data['bills'], selected_keys, csv_filename, new_field_names)
else:
    print("Failed to get JSON data or 'bills' key not found")


def read_csv_bill_ids(filename):
    bills = {}
    with open(filename, mode='r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            if row:
                bills[row[0]] = row[2].lower()
    return bills


BILLID_ENDPOINT = 'https://api.congress.gov/v3/bill/117/'
def get_latest_action_and_sponsors(id, type):
    bill_json_data = api_utils.get_json_data(BILLID_ENDPOINT+type+"/"+str(id))
    bill_info = {}
    if bill_json_data == None:
        print("No extra bill data for this bill :( \n")
        bill_info['STAGE'] = "NULL"
        bill_info['SPONSORS'] = "NULL"
    elif bill_json_data and bill_json_data['bill']['latestAction']['text'] == None:
        print("No latest action data for this bill :( \n")
        bill_info['STAGE'] = "NULL"
    elif bill_json_data and bill_json_data['bill']['sponsors'] == None:
        print("No Sponsor data for this bill : (\n") 
        bill_info['SPONSORS'] = ["NULL"]
    else:
        latest_action = bill_json_data['bill']['latestAction']['text']
        sponsors = []
        for info in bill_json_data['bill']['sponsors']:
            sponsors.append(info['bioguideId'])
        
        bill_info['STAGE'] = latest_action
        bill_info['SPONSORS'] = sponsors if sponsors else ["NULL"]
    return bill_info


def get_bill_subject(id, type):
    bill_subject = defaultdict(list)
    bill_subject_json_data = api_utils.get_json_data(BILLID_ENDPOINT+type+"/"+str(id)+"/subjects")
    if bill_subject_json_data == None or bill_subject_json_data['subjects']['policyArea']['name'] == None:
        print("No bill subject data for this bill :( \n")
        bill_subject[id] = "NULL"
    else:
        bill_subject[id] = bill_subject_json_data['subjects']['policyArea']['name']
    return bill_subject

    


def get_bill_summary_text(id, type):
    bill_summary = {}
    bill_summaries_json_data = api_utils.get_json_data(BILLID_ENDPOINT+type+"/"+str(id)+"/summaries")
    if bill_summaries_json_data == None or bill_summaries_json_data['summaries'][0]['text'] == None:
        print("No bill summary data for this bill :( \n")
        bill_summary[id] = "NULL"
    else:
        bill_summary[id] =  bill_summaries_json_data['summaries'][0]['text']
    return bill_summary

def get_extra_bill_info(bill_ids):
    bills = []
    for id, type in bill_ids.items():
        bill = []
        bill.append(id)
        actions_and_sponsors = get_latest_action_and_sponsors(id, type)
        bill_subject = get_bill_subject(id, type)
        bill_sum = get_bill_summary_text(id, type)
        bill.append(actions_and_sponsors["STAGE"])
        bill.append([actions_and_sponsors["SPONSORS"]])
        bill.append(bill_subject[id])
        bill.append(bill_sum[id])
        bills.append(bill)
    return bills


def read_csv(filename):
    data = []
    with open(filename, mode='r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append(row)
        return data
def update_data_with_extra_bill_info(data, extra_bill_data):
    if len(data) != len(extra_bill_data):
        print("not the same length")
        return
    else:
        for i in range(len(data)):
            data[i]['STAGE'] = extra_bill_data[i]['STAGE']
            data[i]['SPONSORS'] = extra_bill_data[i]['SPONSORS']
            data[i]['SUBJECT'] = extra_bill_data[i]['SUBJECT']
            data[i]['SUMMARY'] = extra_bill_data[i]['SUMMARY']

def write_to_csv(data, filename):
    fieldnames = data[0].keys() if data else[]
    with open(filename, mode='w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)
    


file = '../bills.csv'
billids = read_csv_bill_ids(file)
billss = get_extra_bill_info(billids)
entries = []

for bill in billss:
    entries.append({
        "BillID": bill[0],
        "STAGE": bill[1],
        "SPONSORS": bill[2][0],
        "SUBJECT": bill[3],
        "SUMMARY": bill[4]
    })

basic_bill_data = read_csv('../bills.csv')
update_data_with_extra_bill_info(basic_bill_data, entries)
write_to_csv(basic_bill_data, '../bills.csv')


