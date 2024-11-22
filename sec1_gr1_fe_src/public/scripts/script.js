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




// Workflow to search  
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
                        <p class="text-lg text-gray-500 mt-2">฿ ${item.P_Price}</p>
                        <p class="text-lg text-gray-500 mt-2">${item.P_Type}</p>
                        <p class="text-lg text-gray-500 mt-2">${item.P_Brand}}</p>
                      </div>
                    </div> 
              `;
              resultBox.addEventListener('click', () => 
                {
                  window.location.href= `/detail.html?id=${item.P_ID}`;
                }
            );
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


//Detail page
document.addEventListener('DOMContentLoaded', () => {
  const detailContainer = document.getElementById('detailContainer');

  // Extract the item ID from the query string
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    detailContainer.innerHTML = '<p style="color: red;">Invalid product ID.</p>';
    return;
  }

  // Fetch product details from the back-end
  fetch(`http://localhost:3050/details/${productId}`)
    .then((response) => {
      if (!response.ok) throw new Error('Product not found');
      return response.json();
    })
    .then((data) => {
      // Render the product details
      detailContainer.innerHTML = `
        <div class="bg-[#f9f9f9]">
        <main id="back" class="pt-10 px-10 drop-shadow-md"></main>
        <div class="flex justify-center items-center min-h-screen  ">

            <div class="flex flex-col md:flex-row items-center p-8 ">
                <div class="flex flex-row gap-4 p-4 drop-shadow-md mb-4 md:mb-0">
                    <img src="http://localhost:3050/image/${data.P_ID}" alt="Women's Textured Gray Suit"
                        class="object-cover w-[400px] h-[700px] mb-2 rounded-sm">
                    <img src="http://localhost:3050/image/${data.P_ID}" alt="Women's Textured Gray Suit_2"
                        class="object-cover w-[400px] h-[700px] mb-2 rounded-sm">
                </div>
                <div class="md:ml-8 max-w-md">
                    <div class="text-sm text-gray-400 mb-2">Product ID: ${data.P_ID}</div>
                    <h1 class="text-3xl font-semibold mb-2">${data.P_Name}</h1>
                    <div class="text-gray-500 text-sm mb-4">Brand: ${data.P_Brand}</div>
                    <div class="text-2xl font-semibold mb-4">฿ ${data.P_Price}</div>

                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <span class="text-gray-400 mr-2">Colour:</span>
                            <span class="text-gray-400 mr-2">${data.P_Color}</span>
                            <div class="w-7 h-7 rounded-full" style="background-color: ${data.P_Color};"></div>

                        </div>
                    </div>

                    <button
                        class="w-full bg-black hover:bg-[#3d3d3d] text-white font-semibold py-2 rounded mb-4 flex items-center justify-center space-x-2 drop-shadow-md">
                        <img src="images/Pen.svg" alt="ไอคอนedit" class="h-6 w-6 " />
                        <span>Edit</span>
                    </button>

                    <div class="flex justify-between text-sm text-gray-600">
                        <a href="${data.P_Source}" class="underline hover:text-gray-400">Link and Reference</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
      `;
    })
    .catch((error) => {
      console.error('Error fetching product details:', error);
      detailContainer.innerHTML = `<p style="color: red;">Error fetching product details.</p>`;
    });
});




//     <img src="http://localhost:3050/image/${item.P_ID}" alt="Product Image">
// <p class='bg-white'><strong>Name:</strong> ${item.P_Name}</p>
// <p><strong>Type:</strong> ${item.P_Type}</p>
// <p><strong>Brand:</strong> ${item.P_Brand}</p>