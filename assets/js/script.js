const API_KEY = "YF9Q0SeQ7oDkVTtiKOUOQg9q-AQ";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

/**
 * Converts API's options to the right format (comma separated list)
 * @param {checksform} form 
 * @returns form
 */
function processOptions(form) {

    let optArray = [];

    // Iterating through form's options
    for (let entry of form.entries()) {
        
        // Pushing each value into a temporary array
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }

    // Deleting all the existing options
    form.delete("options");

    /**
     * Append our new options
     * Append the key called options and the value here will be our opt array
     * We'll use the join method to convert it back to a string which by default is separated by commas
     */
    form.append("options", optArray.join());

    return form;

}

/**
 * Post a request to the API
 */
async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));

    // // test code
    // for (let entry of form.entries()) {
    //     console.log(entry);
    // }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form
    });
    
    // convert the  response to json
    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
}

/**
 * Display POST request results in a modal
 */
function displayErrors(data) {

    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}, </span>`;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();

}

/**
 * Checks the API Key status if "Check Key" button is clicked
 */
async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

/**
 * Displays API's key status in a modal
 */
function displayStatus(data) {
    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}