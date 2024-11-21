fetch('/components/navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('navbar').innerHTML = data;
  });

fetch('/components/footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer').innerHTML = data;
  });

fetch('/components/back.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('back').innerHTML = data;
  });




// Workflow     
document.addEventListener('DOMContentLoaded', () => {
  const queryForm = document.getElementById('search');
  const resultContainer = document.getElementById('resultContainer');

  // Handle form submission
  queryForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Get input values
    const queryID = document.getElementById('queryID').value;
    const queryType = document.getElementById('queryType').value;
    const queryBrand = document.getElementById('queryBrand').value;
    const queryName = document.getElementById('queryName').value;
    const queryColor = document.getElementById('queryColor').value;

    // Build a JSON object with the input values
    const requestData = {
      id: queryID,
      type: queryType,
      brand: queryBrand,
      name: queryName,
      color: queryColor
    };

    // Send data to the back-end using fetch
    fetch('http://localhost:3050/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData), // Send the data as JSON
    })
      .then((res) => res.json())
      .then((data) => {
        // Check if data is returned
        if (data.length === 0) {
          resultContainer.innerHTML = '<p>No results found.</p>';
          return;
        }
        console.log(data);
        
        data.forEach((item) => {
          const resultBox = document.createElement('div');
          resultBox.classList.add('border-8','border-pink-800','flex','justify-center','flex-col','items-center','min-h-screen')
          resultBox.innerHTML = 
            `
                <p><strong>Name:</strong> ${item.P_Name}</p>
                <p><strong>Type:</strong> ${item.P_Type}</p>
                <p><strong>Brand:</strong> ${item.P_Brand}</p>
              `;
          resultContainer.appendChild(resultBox);
        }
        )
      }
      )
      .catch((error) => {
        console.error('Error:', error);
        resultContainer.innerHTML = `<p style="color: red;">Error fetching data</p>`;
      });
  });
});

