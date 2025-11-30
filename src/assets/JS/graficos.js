(()=>{
const barrios = ['Barrio Norte', 'Barrio Sur', 'Centro', 'Barrio Este', 'Barrio Oeste'];
const colores = ['#007aff', '#34c759', '#ff9500', '#ff2d55', '#5856d6'];

// 1️⃣ Gráfico de barras
new Chart(document.getElementById('grafico1'), {
    type: 'bar',
    data: {
        labels: barrios,
        datasets: [{
            label: 'Población (miles)',
            data: [45, 38, 60, 30, 42],
            backgroundColor: colores
        }]
    },
    options: { responsive: true }
});

// 2️⃣ Gráfico de línea
new Chart(document.getElementById('grafico2'), {
    type: 'line',
    data: {
        labels: barrios,
        datasets: [{
            label: 'Ingresos promedio (S/)',
            data: [2500, 2200, 2800, 2000, 2400],
            borderColor: '#007aff',
            backgroundColor: 'rgba(0,122,255,0.2)',
            fill: true,
            tension: 0.3
        }]
    },
    options: { responsive: true }
});

// 3️⃣ Gráfico de pastel
new Chart(document.getElementById('grafico3'), {
    type: 'pie',
    data: {
        labels: barrios,
        datasets: [{
            label: 'Índice de limpieza',
            data: [80, 70, 90, 60, 75],
            backgroundColor: colores
        }]
    },
    options: { responsive: true }
});

// 4️⃣ Gráfico de radar
new Chart(document.getElementById('grafico4'), {
    type: 'radar',
    data: {
        labels: barrios,
        datasets: [{
            label: 'Eventos culturales',
            data: [12, 8, 20, 5, 10],
            backgroundColor: 'rgba(255, 149, 0, 0.3)',
            borderColor: '#ff9500',
            pointBackgroundColor: '#ff9500'
        }]
    },
    options: { responsive: true }
});

// 5️⃣ Gráfico de doughnut
new Chart(document.getElementById('grafico5'), {
    type: 'doughnut',
    data: {
        labels: barrios,
        datasets: [{
            label: 'Niveles de contaminación',
            data: [30, 40, 25, 45, 35],
            backgroundColor: colores
        }]
    },
    options: { responsive: true }
});
})();