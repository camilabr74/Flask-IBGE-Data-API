import requests

def get(paises, indicadores):
    results = []
    try:
        for pais in paises:
            for indicador in indicadores:
                res = requests.get(f"https://servicodados.ibge.gov.br/api/v1/paises/{pais}/indicadores/{indicador}")
                if res.status_code != 200:
                    print(f"Request Falhou {res.status_code} para país {pais} e indicador {indicador}")
                    continue
                data = res.json()
                results.append(data)
        return results if results else None
    except Exception as e:
        print(e)
        return None
