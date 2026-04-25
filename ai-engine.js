// ai-engine.js

async function fetchWikipediaData(query) {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`);
    const data = await response.json();
    return data.query.search;
}

function generateSyntheticInformation(searchResults) {
    return searchResults.map(result => {
        return {
            title: result.title,
            excerpt: result.snippet,
        };
    });
}

function getCodingTips(language) {
    const tips = {
        python: "Start with simple data types and gradually progress to advanced libraries like NumPy and Pandas.",
        javascript: "Utilize asynchronous programming to handle operations like API calls efficiently.",
        react: "Break your UI into components and manage state using hooks like useState and useEffect.",
        nodejs: "Use Express.js to create robust server-side applications quickly.",
        general: "Always comment your code for better understanding and maintainability.",
    };
    return tips[language] || 'No tips available for the specified language.';
}

async function main() {
    const query = 'Artificial Intelligence'; // You can change this query
    const searchResults = await fetchWikipediaData(query);
    const syntheticInfo = generateSyntheticInformation(searchResults);
    console.log(syntheticInfo);
    
    const pythonTips = getCodingTips('python');
    const jsTips = getCodingTips('javascript');
    console.log(pythonTips);
    console.log(jsTips);
}

main();