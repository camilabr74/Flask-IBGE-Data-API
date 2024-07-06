from connection_API import get
from handle_files import save_json, load_json, clean_data

if __name__ == "__main__":
    pais = ["BR"]
    indicador = [77819]

    data = get(pais, indicador)
    if data:
        save_json(data, 'dados_brutos.json') 

        dados_brutos = load_json('dados_brutos.json')

        for item in dados_brutos:
            if "series" in item[0] and len(item[0]) > 0:
                series = item[0]["series"][0]["serie"]
                anos_filtrados = clean_data(series)
                print("Anos filtrados:", anos_filtrados)
            else:
                print("Estrutura de dados inesperada:", item)