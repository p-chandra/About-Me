const menuItems = [
  {
    name: "Spaghetti Bolognese",
    recipe: [
      "Cook pasta.",
      "In a pan, sauté onions and garlic.",
      "Add ground beef, tomato sauce, and simmer.",
      "Serve over spaghetti."
    ]
  },
  {
    name: "Chicken Caesar Salad",
    recipe: [
      "Grill chicken breast.",
      "Slice it, and toss with romaine lettuce.",
      "Add Caesar dressing, croutons, and Parmesan cheese."
    ]
  },
  {
    name: "Margherita Pizza",
    recipe: [
      "Spread tomato sauce on pizza dough.",
      "Add fresh mozzarella and basil leaves.",
      "Bake at 475°F for 10–12 minutes."
    ]
  },
  {
    name: "Grilled Salmon",
    recipe: [
      "Season salmon with salt, pepper, and lemon.",
      "Grill for 6–8 minutes per side until cooked through."
    ]
  },
  {
    name: "Beef Tacos",
    recipe: [
      "Brown beef with taco seasoning.",
      "Serve in tortillas with lettuce, tomato, cheese, and salsa."
    ]
  },
  {
    name: "Vegetable Stir Fry",
    recipe: [
      "Stir-fry assorted vegetables in sesame oil with garlic, soy sauce, and ginger.",
      "Serve over rice or noodles."
    ]
  },
  {
    name: "Cheeseburger",
    recipe: [
      "Grill beef patty.",
      "Place on bun with cheese, lettuce, tomato, onion, and condiments of choice."
    ]
  },
  {
    name: "Mushroom Risotto",
    recipe: [
      "Sauté mushrooms and onions in butter.",
      "Add Arborio rice and broth gradually while stirring until creamy."
    ]
  }
];

const form = document.getElementById('menuForm');

menuItems.forEach((item, index) => {
  const div = document.createElement('div');
  div.className = 'menu-item';
  div.innerHTML = `
    <label>
      <input type="checkbox" value="${index}">
      ${item.name}
    </label>
  `;
  form.appendChild(div);
});

const mdButton = document.createElement('button');
mdButton.type = 'submit';
mdButton.textContent = 'Download Markdown';
form.appendChild(mdButton);

const pdfButton = document.createElement('button');
pdfButton.type = 'button';
pdfButton.textContent = 'Download PDF';
form.appendChild(pdfButton);

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  if (checkboxes.length === 0) {
    alert("Please select at least one item.");
    return;
  }

  let markdownContent = "# Selected Menu Items and Recipes\n\n";
  markdownContent += "| Dish | Recipe |\n";
  markdownContent += "|------|--------|\n";

  checkboxes.forEach(cb => {
    const item = menuItems[parseInt(cb.value)];
    const formattedRecipe = item.recipe.join("<br>");  // No numbers, just steps
    markdownContent += `| ${item.name} | ${formattedRecipe} |\n`;
  });

  const blob = new Blob([markdownContent], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "selected_recipes.md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

pdfButton.addEventListener('click', () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  if (checkboxes.length === 0) {
    alert("Please select at least one item.");
    return;
  }

  // Cover Page
  let html = "<h1 style='text-align:center;'>Recipe Collection</h1>";
  html += "<p style='text-align:center;'>A selection of delicious recipes for you to try!</p>";
  html += "<hr>";

  // Menu Page
  html += "<h2>Selected Menu Items and Recipes</h2>";

  checkboxes.forEach(cb => {
    const item = menuItems[parseInt(cb.value)];

    // Create a separate table for each item
    html += `<h3>${item.name}</h3>`;  // Dish name as header
    html += "<table border='1' cellpadding='10' cellspacing='0'><thead><tr><th></th><th>" + item.name + "</th></tr></thead><tbody>";

    item.recipe.forEach((step, index) => {
      html += `<tr><td></td><td>${index + 1}. ${step}</td></tr>`;  // Empty first column, recipe step in second column
    });

    html += "</tbody></table><br>";  // Closing the table for each item
  });

  // Render the HTML content to the output div
  const outputDiv = document.getElementById('renderedOutput');
  outputDiv.innerHTML = html;
  outputDiv.style.display = 'block';

  // Wait for the content to render before creating the PDF
  setTimeout(() => {
    html2pdf().from(outputDiv).save('selected_recipes.pdf');
  }, 100); // A small delay to ensure content is rendered
});
