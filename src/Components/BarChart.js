import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const BarChart = ({ array }) => {
  const data = {
    labels: array.map(() => ''), // Hide the index by using empty strings
    datasets: [
      {
        label: 'Array Values',
        data: array,
        backgroundColor: array.map(() => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`),
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
        formatter: (value) => value, // Display the value
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
