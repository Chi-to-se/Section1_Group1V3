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

function logout() {
  localStorage.clear();
  window.location.href = 'http://localhost:3040/login'; // Change '/login' to your login page URL
}

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
    const queryGender = document.getElementById('queryGender').value;

    // Build a JSON object with the input values
    const requestData = {
      id: queryID,
      type: queryType,
      brand: queryBrand,
      name: queryName,
      color: queryColor,
      gender: queryGender
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
          resultBox.classList.add('flex', 'flex-row', 'flex-wrap',);
          resultBox.innerHTML =
            `
                <div class="bg-white rounded-lg shadow-md p-4 w-[350px] h-full flex flex-col items-center">
                  <img src="http://localhost:3050/image/${item.P_ID}" alt="Product Image"
                   class="w-[300px] h-[450px] object-cover rounded-t-md transition hover:opacity-90" />
                  <div class="mt-4 text-center overflow-hidden text-ellipsis">
                  <h2 class="text-xl font-semibold">${item.P_Name}</h2>
                  <p class="text-lg text-gray-500 mt-2">฿ ${item.P_Price}</p>
                  <p class="text-lg text-gray-500 mt-2">${item.P_Type}</p>
                  <p class="text-lg text-gray-500 mt-2">${item.P_Brand}</p>
                  </div>
                </div> 
              `;
          resultBox.addEventListener('click', () => {
            window.location.href = `/detail.html?id=${item.P_ID}`;
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
        
        <div class="flex justify-center items-center min-h-screen  ">

            <div class="flex flex-col md:flex-row items-center p-8 ">
                <div class="flex flex-row gap-4 p-4 drop-shadow-md mb-4 md:mb-0">
                    <img src="http://localhost:3050/image/${data.P_ID}" alt="Women's Textured Gray Suit"
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
                        <img src="images/bag.svg" alt="ไอคอนตะกร้า" class="h-6 w-6 " />
                        <span>Add To Cart</span>
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



// Product Manage
document.addEventListener('DOMContentLoaded', () => {
  const tableBodyProduct = document.getElementById('table-body-product');

  fetch('http://localhost:3050/records')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        
          data.forEach(record => {
              const row = document.createElement('tr');
              row.classList.add('border-t', 'border-gray-600');

              row.innerHTML = `
                  <td class="px-4 py-2">${record.P_ID}</td>
                  <td class="px-4 py-2">${record.P_Name}</td>
                  <td class="px-10 py-2 flex justify-end gap-14">
                  <button class="edit-btn" data-id="${record.P_ID}">
                          <img src="/images/Edit_blue.svg" alt="Edit Icon" class="h-6 w-6" />
                  </button>
                  <button class="delete-btn" data-id="${record.P_ID}">
                          <img src="/images/Delete_red.svg" alt="Edit Icon" class="h-6 w-6" />
                  </button>
              `;

              tableBodyProduct.appendChild(row);
          });

          const editButtons = document.querySelectorAll('.edit-btn');
          editButtons.forEach(button => 
            {
              button.addEventListener('click', event => 
                {
                  const productID = event.target.closest('button').getAttribute('data-id');
                  window.location.href = `/productedit?id=${productID}`;
                }
              )
            }
          )

          const deleteButtons = document.querySelectorAll('.delete-btn');
          deleteButtons.forEach(button => 
            {
              button.addEventListener('click', event => 
                {
                  const productID = event.target.closest('button').getAttribute('data-id');

                  fetch(`http://localhost:3050/deleteproduct/${productID}`, {method: 'DELETE',})
                  .then(response => response.text())
                  .then(data => 
                    {
                      if (data === "Delete succesfully")
                      {
                        event.target.closest('tr').remove();
                        alert('Product delete succesfully');
                      }
                      else
                      {
                        alert('Failed to delete')
                      }
                    }
                  ).catch(error => 
                    {
                      console.error('Error deleting product:', error);
                      alert('Error deleting product')
                    }
                  )
                }
              )
            }
          )



      })
      .catch(error => console.error('Error fetching data:', error));
});

// Add more Product
document.addEventListener('DOMContentLoaded', () => {
  const addMoreButton = document.getElementById('add-more-product');
  
  addMoreButton.addEventListener('click', () => {
      window.location.href = '/productedit';
  });
});



// Product Manage button
document.addEventListener('DOMContentLoaded', () => {

  const params = new URLSearchParams(window.location.search);
  const productID = params.get('id');

  if (productID) {
      fetch(`http://localhost:3050/records/${productID}`)
          .then(response => response.json())
          .then(data => {
              
              // Pre-fill the form fields with the fetched data
              document.getElementById('product-id').value = data.P_ID;
              document.getElementById('product-type').value = data.P_Type;
              document.getElementById('product-brand').value = data.P_Brand;
              document.getElementById('product-name').value = data.P_Name;
              document.getElementById('product-color').value = data.P_Color;
              document.getElementById('product-gender').value = data.P_Gender;
              document.getElementById('product-price').value = data.P_Price;
              document.getElementById('product-source').value = data.P_Source;
          })
          .catch(error => console.error('Error fetching train data:', error));
  }
});



// Admin Manage
document.addEventListener('DOMContentLoaded', () => {
  const tableBodyProduct = document.getElementById('table-body-admin');

  fetch('http://localhost:3050/admins')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        
          data.forEach(record => {
              const row = document.createElement('tr');
              row.classList.add('border-t', 'border-gray-600');

              row.innerHTML = `
                  <td class="px-4 py-2">${record.A_ID}</td>
                  <td class="px-4 py-2">${record.A_Username}</td>
                  <td class="px-10 py-2 flex justify-end gap-14">
                  <button class="edit-btn-admin" data-id="${record.A_ID}">
                          <img src="/images/Edit_blue.svg" alt="Edit Icon" class="h-6 w-6" />
                  </button>
                  <button class="delete-btn-admin" data-id="${record.A_ID}">
                          <img src="/images/Delete_red.svg" alt="Edit Icon" class="h-6 w-6" />
                  </button>
              `;

              tableBodyProduct.appendChild(row);
          });

          const editButtons = document.querySelectorAll('.edit-btn-admin');
          editButtons.forEach(button => 
            {
              button.addEventListener('click', event => 
                {
                  const productID = event.target.closest('button').getAttribute('data-id');
                  window.location.href = `/useredit?id=${productID}`;
                }
              )
            }
          )

          const deleteButtons = document.querySelectorAll('.delete-btn-admin');
          deleteButtons.forEach(button => 
            {
              button.addEventListener('click', event => 
                {
                  const adminID = event.target.closest('button').getAttribute('data-id');

                  fetch(`http://localhost:3050/deleteadmin/${adminID}`, {method: 'DELETE',})
                  .then(response => response.text())
                  .then(data => 
                    {
                      if (data === "Delete succesfully")
                      {
                        event.target.closest('tr').remove();
                        alert('Admin delete succesfully');
                      }
                      else
                      {
                        alert('Failed to delete')
                      }
                    }
                  ).catch(error => 
                    {
                      console.error('Error deleting admin:', error);
                      alert('Error deleting admin')
                    }
                  )
                }
              )
            }
          )
      })
      .catch(error => console.error('Error fetching data:', error));
});

// Add more Admin
document.addEventListener('DOMContentLoaded', () => {
  const addMoreButton = document.getElementById('add-more-admin');
  
  addMoreButton.addEventListener('click', () => {
      window.location.href = '/useredit';
  });
});



// Admin Manage button
document.addEventListener('DOMContentLoaded', () => {

  const params = new URLSearchParams(window.location.search);
  const adminID = params.get('id');

  if (adminID) {
      fetch(`http://localhost:3050/admins/${adminID}`)
          .then(response => response.json())
          .then(data => {
              // Pre-fill the form fields with the fetched data
              document.getElementById('admin-id').value = data.A_ID;
              document.getElementById('admin-user').value = data.A_Username;
              document.getElementById('admin-pass').value = data.A_Password;
              document.getElementById('admin-firstname').value = data.A_FirstName;
              document.getElementById('admin-lastname').value = data.A_LastName;

              // Format birth date to yyyy-mm-dd
              const birthDate = new Date(data.A_BirthDate);  
              const year = birthDate.getUTCFullYear();  
              const month = String(birthDate.getUTCMonth() + 1).padStart(2, '0');  
              const day = String(birthDate.getUTCDate()).padStart(2, '0');  
              const formattedDateForInput = `${year}-${month}-${day}`; 

              document.getElementById('admin-bdate').value = formattedDateForInput;
              document.getElementById('admin-address').value = data.A_Address;
          })
          .catch(error => console.error('Error fetching train data:', error));
  }
});






//     <img src="http://localhost:3050/image/${item.P_ID}" alt="Product Image">
// <p class='bg-white'><strong>Name:</strong> ${item.P_Name}</p>
// <p><strong>Type:</strong> ${item.P_Type}</p>
// <p><strong>Brand:</strong> ${item.P_Brand}</p>