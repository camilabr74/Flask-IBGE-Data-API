async function sendGetRequest() {
    const countryDropdown = document.getElementById('countryDropdown');
    const indicatorDropdown = document.getElementById('indicatorDropdown');

    const selectedCountry = countryDropdown.value;
    const selectedIndicator = indicatorDropdown.value;

    const url = `https://servicodados.ibge.gov.br/api/v1/paises/${selectedCountry}/indicadores/${selectedIndicator}`;

    console.log('Request URL:', url);

    try {
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Received data:', data);

        if (data && Array.isArray(data) && data.length > 0) {
            const indicatorInfo = data[0];

            if (indicatorInfo && indicatorInfo.unidade) {
                const unit = indicatorInfo.unidade;
                const title = `Indicador: ${indicatorInfo.indicador}`;
                const unitDescription = `${unit.id}`;

                updateUI(title);

                if (Array.isArray(indicatorInfo.series) && indicatorInfo.series.length > 0) {
                    const series = indicatorInfo.series[0].serie;
                    if (Array.isArray(series)) {
                        const cleanedData = cleanData(series);
                        console.log('Cleaned data:', cleanedData);
                        displayAndRenderData(cleanedData, unitDescription);
                    } else {
                        handleError('Series data is not an array:', series);
                    }
                } else {
                    handleError('IndicatorInfo series is not an array or empty:', indicatorInfo.series);
                }
            } else {
                handleError('No valid unit information in indicatorInfo');
            }
        } else {
            handleError('Data is not an array or empty:', data);
        }
    } catch (error) {
        console.error('Error:', error);
        handleError('An error occurred while fetching data');
    }
}

function updateUI(title, description) {
    document.getElementById('dataTitle').textContent = title;
    document.getElementById('dataDescription').textContent = description;
}

function clearUI() {
    document.getElementById('dataTitle').textContent = '';
    document.getElementById('dataDescription').textContent = '';
    displayData([], '', 'dataTable');
    displayData([], '', 'dataTableMobile');
    renderChart([], '', 'myChart');
    renderChart([], '', 'myChartMobile');
}

function handleError(message, data = '') {
    console.error(message, data);
    clearUI();
}

function displayAndRenderData(data, unitDescription) {
    displayData(data, unitDescription, 'dataTable');
    displayData(data, unitDescription, 'dataTableMobile');
    renderChart(data, unitDescription, 'myChart');
    renderChart(data, unitDescription, 'myChartMobile');
}

function cleanData(dataList) {
    console.log('DataList:', dataList);

    if (!Array.isArray(dataList)) {
        console.error('DataList is not an array:', dataList);
        return [];
    }

    return dataList
        .filter(item => {
            const key = Object.keys(item)[0];
            const value = parseFloat(item[key]);
            return key && !isNaN(value);
        })
        .map(item => {
            const key = Object.keys(item)[0];
            const value = parseFloat(item[key]);
            console.log('Cleaned item:', { year: key, value: isNaN(value) ? '' : value });
            return { year: key, value: value };
        });
}

function displayData(data, unitDescription, tableId) {
    const tableHeader = document.querySelector(`#${tableId} thead tr`);
    const tableBody = document.querySelector(`#${tableId} tbody`);

    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    if (data.length > 0) {
        const headers = ['Ano', unitDescription];
        const headerFragment = document.createDocumentFragment();
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerFragment.appendChild(th);
        });
        tableHeader.appendChild(headerFragment);

        const bodyFragment = document.createDocumentFragment();
        data.forEach(item => {
            const tr = document.createElement('tr');

            const tdYear = document.createElement('td');
            tdYear.textContent = item.year !== null ? item.year : '';
            tr.appendChild(tdYear);

            const tdValue = document.createElement('td');
            tdValue.textContent = item.value !== null ? item.value : '';
            tr.appendChild(tdValue);

            bodyFragment.appendChild(tr);
        });
        tableBody.appendChild(bodyFragment);
    } else {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 2;
        td.textContent = 'Não há dados para exibir';
        tr.appendChild(td);
        tableBody.appendChild(tr);
    }
}

function renderChart(data, unitDescription, chartId) {
    const ctx = document.getElementById(chartId)?.getContext('2d');

    if (!ctx) {
        console.error(`Canvas context not found for chartId: ${chartId}`);
        return;
    }

    if (window[chartId] && window[chartId] instanceof Chart) {
        window[chartId].destroy();
    }

    console.log('Data type:', typeof data);
    console.log('Data:', data);

    if (!Array.isArray(data)) {
        console.error('Data is not an array.');
        return;
    }

    const labels = data.map(item => item.year);
    const values = data.map(item => parseFloat(item.value) || 0);

    console.log('Labels:', labels);
    console.log('Values:', values);

    window[chartId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: unitDescription,
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
                        text: 'Ano'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: unitDescription
                    },
                    beginAtZero: true
                }
            }
        }
    });
}
