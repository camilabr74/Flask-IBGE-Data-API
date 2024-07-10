import json

def save_json(data, filename):
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

def load_json(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        data_json = json.load(file)
        return data_json
    
def clean_data(dataList):
    newList = []
    for item in dataList:
        if list(item.values())[0] is not None:
            newList.append(item)
    return newList
