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

        // const gridContainer = document.createElement('div');
        //   gridContainer.classList.add('grid', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4', 'gap-8', 'mt-8');

        data.forEach((item) => {
          const resultBox = document.createElement('div');
          resultBox.classList.add('flex', 'flex-row', 'flex-wrap',);
          resultBox.innerHTML =
            `
                <div class=" mt-8 ">
                    <div class="bg-white rounded-lg shadow-md p-4 w-[350px] h-full flex flex-col ">
                      <img src="http://localhost:3050/image/${item.P_ID}" alt="Product Image"
                        class="w-[300px] h-[450px] object-cover rounded-t-md transition hover:opacity-90" />
                      <div class="mt-4 text-center overflow-hidden text-ellipsis">
                        <h2 class="text-xl font-semibold ">${item.P_Name}</h2>
                        <p class="text-lg text-gray-500 mt-2">$${item.P_Price}</p>
                        <p class="text-lg text-gray-500 mt-2">${item.P_Type}</p>
                        <p class="text-lg text-gray-500 mt-2">${item.P_Brand}}</p>
                      </div>
                    </div> 
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




//     <img src="http://localhost:3050/image/${item.P_ID}" alt="Product Image">
// <p class='bg-white'><strong>Name:</strong> ${item.P_Name}</p>
// <p><strong>Type:</strong> ${item.P_Type}</p>
// <p><strong>Brand:</strong> ${item.P_Brand}</p>