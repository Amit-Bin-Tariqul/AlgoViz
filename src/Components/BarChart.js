import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const BarChart = ({ array, algorithm, pivot, swaps, getColorForValue }) => {
  const backgroundColor = array.map(getColorForValue);
  const data = {
    labels: array.map((_, index) => pivot === index ? 'pvt' : ''), // Show 'pvt' for the pivot
    datasets: [
      {
        label: 'Array Values',
        data: array,
        backgroundColor: backgroundColor,
        borderColor: array.map(() => 'rgba(0, 0, 0, 1)'),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Value: ${context.raw}`; // Highlight the value
          },
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: 'white',
        font: {
          weight: 'bold',
          size: 16,
        },
        formatter: (value, context) => context.chart.data.labels[context.dataIndex] === 'pvt' ? 'pvt' : value, // Show 'pvt' for pivot
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
