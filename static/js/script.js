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

            // Verificar e processar os dados
            if (data && Array.isArray(data) && data.length > 0) {
                var indicatorInfo = data[0];

                // Extrair e exibir informações da unidade
                if (indicatorInfo && indicatorInfo.unidade) {
                    var unit = indicatorInfo.unidade;
                    var title = `Indicador: ${indicatorInfo.indicador}`;
                    var description = `Unidade: ${unit.id}, Classe: ${unit.classe}, Multiplicador: ${unit.multiplicador}`;

                    document.getElementById('dataTitle').textContent = title;
                    document.getElementById('dataDescription').textContent = description;
                }

                // Limpar e exibir os dados
                if (indicatorInfo && Array.isArray(indicatorInfo.series) && indicatorInfo.series.length > 0) {
                    var series = indicatorInfo.series[0].serie;

                    if (Array.isArray(series)) {
                        var cleanedData = cleanData(series);
                        console.log('Cleaned data:', cleanedData);
                        displayData(cleanedData);
                        renderChart(cleanedData);
                    } else {
                        console.error('Series data is not an array:', series);
                        document.getElementById('dataTitle').textContent = '';
                        document.getElementById('dataDescription').textContent = '';
                        displayData([]);
                        renderChart([]);
                    }
                } else {
                    console.error('IndicatorInfo series is not an array or empty:', indicatorInfo.series);
                    document.getElementById('dataTitle').textContent = '';
                    document.getElementById('dataDescription').textContent = '';
                    displayData([]);
                    renderChart([]);
                }
            } else {
                console.error('Data is not an array or empty:', data);
                document.getElementById('dataTitle').textContent = '';
                document.getElementById('dataDescription').textContent = '';
                displayData([]);
                renderChart([]);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('dataTitle').textContent = '';
            document.getElementById('dataDescription').textContent = '';
            displayData([]);
            renderChart([]);
        });
}


function cleanData(dataList) {
    console.log('DataList:', dataList);
    if (!Array.isArray(dataList)) {
        console.error('DataList is not an array:', dataList);
        return [];
    }

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


function renderChart(data) {
    var ctx = document.getElementById('myChart').getContext('2d');

    // Se já existir um gráfico, destrua-o antes de criar um novo
    if (window.myChart && window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    // Verifique o tipo de data
    console.log('Data type:', typeof data);
    console.log('Data:', data);

    if (!Array.isArray(data)) {
        console.error('Data is not an array.');
        return;
    }

    var labels = data.map(item => item.year);
    var values = data.map(item => parseFloat(item.value)); // Converter valores para números

    console.log('Labels:', labels);
    console.log('Values:', values);

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Indicador',
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}