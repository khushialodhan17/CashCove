document.addEventListener('DOMContentLoaded', () => {
    const expensesForm = document.getElementById('expensesForm');
    const expensesChart = document.getElementById('expensesChart').getContext('2d');
  
    expensesForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const expenses = months.map(month => parseFloat(document.getElementById(month.toLowerCase()).value));
  
      new Chart(expensesChart, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: 'Monthly Food Expenses',
            data: expenses,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  });
  