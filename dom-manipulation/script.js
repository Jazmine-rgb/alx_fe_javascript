const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

async function fetchQuotesFromServer ()
{
  const response = await fetch( SERVER_URL );
  const data = await response.json();

  // Simulate quotes from server
  return data.slice( 0, 5 ).map( post => ( {
    text: post.title,
    category: "Server"
  } ) );
}

async function syncWithServer ()
{
  const serverQuotes = await fetchServerQuotes();

  // Conflict resolution: server data wins
  quotes = serverQuotes;

  saveQuotes();
  populateCategories();
  filterQuotes();

  notifyUser( "Quotes synced with server. Server data applied." );
}

async function postQuoteToServer ( quote )
{
  await fetch( SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify( quote )
  } );
}


setInterval( syncWithServer, 30000 );

document.getElementById( "syncNow" ).addEventListener( "click", syncWithServer );




function notifyUser ( message )
{
  alert( message );
}




let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Wisdom begins in wonder.", category: "Philosophy" },
  { text: "Believe you can and you're halfway there.", category: "Inspiration" }
];

const storedQuotes = localStorage.getItem( "quotes" );
if ( storedQuotes )
{
  quotes = JSON.parse( storedQuotes );
}

function saveQuotes ()
{
  localStorage.setItem( "quotes", JSON.stringify( quotes ) );
}

function showRandomQuote ()
{
  const randomIndex = Math.floor( Math.random() * quotes.length );
  const randomQuote = quotes[ randomIndex ];

  const quoteDisplay = document.getElementById( "quoteDisplay" );
  quoteDisplay.innerHTML = `
      <p><strong>Quote:</strong> ${ randomQuote.text }</p>
      <p><strong>Category:</strong> ${ randomQuote.category }</p>
  `;

  sessionStorage.setItem( "lastQuote", JSON.stringify( randomQuote ) );
}

const lastQuote = sessionStorage.getItem( "lastQuote" );
if ( lastQuote )
{
  document.getElementById( "quoteDisplay" ).innerHTML = `
      <p><strong>Quote:</strong> ${ JSON.parse( lastQuote ).text }</p>
      <p><strong>Category:</strong> ${ JSON.parse( lastQuote ).category }</p>
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
  // Attach event listener for Export Quotes button
  document.getElementById( "exportQuotes" ).addEventListener( "click", exportToJson );

  // Attach event listener for Import Quotes input
  document.getElementById( "importFile" ).addEventListener( "change", importFromJsonFile );
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

  saveQuotes();

  // Update DOM to show the new quote
  const quoteDisplay = document.getElementById( "quoteDisplay" );
  quoteDisplay.innerHTML = `
      <p><strong>Quote:</strong> ${ newQuote.text }</p>
      <p><strong>Category:</strong> ${ newQuote.category }</p>
  `;

  // Clear input fields
  document.getElementById( "newQuoteText" ).value = "";
  document.getElementById( "newQuoteCategory" ).value = "";

  populateCategories();
  filterQuotes();

}

function exportToJson ()
{
  const json = JSON.stringify( quotes, null, 2 );
  const blob = new Blob( [ json ], { type: "application/json" } );
  const url = URL.createObjectURL( blob );

  const a = document.createElement( "a" );
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL( url );
}

function importFromJsonFile ( event )
{
  const fileReader = new FileReader();

  fileReader.onload = function ( event )
  {
    try
    {
      const importedQuotes = JSON.parse( event.target.result );
      quotes.push( ...importedQuotes );
      saveQuotes();
      alert( 'Quotes imported successfully!' );
    } catch ( error )
    {
      alert( 'Invalid JSON file.' );
    }
  };

  fileReader.readAsText( event.target.files[ 0 ] );
}

function populateCategories ()
{
  const categoryFilter = document.getElementById( "categoryFilter" );

  // Clear existing categories except "All"
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  // Extract unique categories
  const categories = [ ...new Set( quotes.map( quote => quote.category ) ) ];

  categories.forEach( category =>
  {
    const option = document.createElement( "option" );
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild( option );
  } );
}

function filterQuotes ()
{
  const selectedCategory = document.getElementById( "categoryFilter" ).value;

  // Save selected filter to localStorage
  localStorage.setItem( "selectedCategory", selectedCategory );

  let filteredQuotes;

  if ( selectedCategory === "all" )
  {
    filteredQuotes = quotes;
  } else
  {
    filteredQuotes = quotes.filter(
      quote => quote.category === selectedCategory
    );
  }

  
  const quoteDisplay = document.getElementById( "quoteDisplay" );
  quoteDisplay.innerHTML = "";

  filteredQuotes.forEach( quote =>
  {
    const quoteElement = document.createElement( "p" );
    quoteElement.textContent = `"${ quote.text }" — ${ quote.category }`;
    quoteDisplay.appendChild( quoteElement );
  } );
}




// Attach event listener for Show New Quote button
document.getElementById( "newQuote" ).addEventListener( "click", showRandomQuote );

// Create the form as soon as the page loads
createAddQuoteForm();

const savedCategory = localStorage.getItem( "selectedCategory" );
if ( savedCategory )
{
  document.getElementById( "categoryFilter" ).value = savedCategory;
}

populateCategories();
filterQuotes();
syncWithServer();

