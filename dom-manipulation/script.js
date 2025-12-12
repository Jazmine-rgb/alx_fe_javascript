let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Wisdom begins in wonder.", category: "Philosophy" },
  { text: "Believe you can and you're halfway there.", category: "Inspiration" }
];

function showRandomQuote ()
{
  const randomIndex = Math.floor( Math.random() * quotes.length );
  const randomQuote = quotes[ randomIndex ];

  const quoteDisplay = document.getElementById( "quoteDisplay" );
  quoteDisplay.innerHTML = `
      <p><strong>Quote:</strong> ${ randomQuote.text }</p>
      <p><strong>Category:</strong> ${ randomQuote.category }</p>
  `;
}

function createAddQuoteForm ()
{
  const formContainer = document.createElement( "div" );

  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;

  document.body.appendChild( formContainer );

  // Attach event listener to Add Quote button
  document.getElementById( "addQuoteBtn" ).addEventListener( "click", addQuote );
}


// Add a new quote (Step 3)
function addQuote ()
{
  const text = document.getElementById( "newQuoteText" ).value;
  const category = document.getElementById( "newQuoteCategory" ).value;

  // Create new quote object
  const newQuote = { text: text, category: category };

  // Add to the quotes array
  quotes.push( newQuote );

  // Update DOM to show the new quote
  const quoteDisplay = document.getElementById( "quoteDisplay" );
  quoteDisplay.innerHTML = `
      <p><strong>Quote:</strong> ${ newQuote.text }</p>
      <p><strong>Category:</strong> ${ newQuote.category }</p>
  `;

  // Clear input fields
  document.getElementById( "newQuoteText" ).value = "";
  document.getElementById( "newQuoteCategory" ).value = "";
}

// Attach event listener for Show New Quote button
document.getElementById( "newQuote" ).addEventListener( "click", showRandomQuote );

// Create the form as soon as the page loads
createAddQuoteForm();