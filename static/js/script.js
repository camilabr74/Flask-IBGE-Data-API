function sendGetRequest() {
    var countryDropdown = document.getElementById('countryDropdown');
    var indicatorDropdown = document.getElementById('indicatorDropdown');

    var selectedCountry = countryDropdown.value;
    var selectedIndicator = indicatorDropdown.value;

    var url = `https://servicodados.ibge.gov.br/api/v1/paises/${selectedCountry}/indicadores/${selectedIndicator}`;

    console.log('Request URL:', url);

    fetch(url, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data);

            // Extrair e exibir informações da unidade
            if (data.length > 0) {
                var indicatorInfo = data[0];
                var unit = indicatorInfo.unidade;

                // Atualizar título e descrição
                var title = `Indicador: ${indicatorInfo.indicador}`;
                var description = `Unidade: ${unit.id}, Classe: ${unit.classe}, Multiplicador: ${unit.multiplicador}`;

                document.getElementById('dataTitle').textContent = title;
                document.getElementById('dataDescription').textContent = description;

                // Limpar e exibir os dados
                if (indicatorInfo.series.length > 0 && Array.isArray(indicatorInfo.series[0].serie)) {
                    var series = indicatorInfo.series[0].serie;
                    var cleanedData = cleanData(series);
                    console.log('Cleaned data:', cleanedData);
                    displayData(cleanedData);
                } else {
                    console.log('No series data available');
                    displayData([]);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function cleanData(dataList) {
    return dataList.filter(item => {
        console.log('Item before cleaning:', item);
        return Object.values(item).some(value => value !== null && value !== '');
    }).map(item => {
        let key = Object.keys(item)[0];
        let value = item[key];
        return { year: key, value: value };
    });
}

function displayData(data) {
    var tableHeader = document.querySelector('#dataTable thead tr');
    var tableBody = document.querySelector('#dataTable tbody');

    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    if (data.length > 0) {
        var headers = ['Year', 'Value'];
        headers.forEach(header => {
            var th = document.createElement('th');
            th.textContent = header;
            tableHeader.appendChild(th);
        });

        data.forEach(item => {
            var tr = document.createElement('tr');
            var tdYear = document.createElement('td');
            tdYear.textContent = item.year !== null ? item.year : '';
            tr.appendChild(tdYear);

            var tdValue = document.createElement('td');
            tdValue.textContent = item.value !== null ? item.value : '';
            tr.appendChild(tdValue);

            tableBody.appendChild(tr);
        });

    } else {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.colSpan = 2;
        td.textContent = 'No data available';
        tr.appendChild(td);
        tableBody.appendChild(tr);
    }
}