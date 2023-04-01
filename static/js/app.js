// Get JSON data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize the dashboard at start up 
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then((data) => {
        
        // Set a variable for the sample names
        let sampleNames = data.names;

        // Add  samples to dropdown menu
        sampleNames.forEach((id) => {

            // Log the value of id for each iteration of the loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample from the list
        let sampleOne = sampleNames[0];

        // Log the value of sample_one
        console.log(sampleOne);

        // Build the initial plots
        buildSampleMetadata(sampleOne);
        buildBarChart(sampleOne);
        buildBubbleChart(sampleOne);
        buildGaugeChart(sampleOne);

    });
};

// Function that populates metadata info
function buildSampleMetadata(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        // Log the array of metadata objects after the have been filtered
        console.log(value)

        // Get the first index from the array
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Function that builds the bar chart
function buildBarChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, labels, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids, otu_labels, sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace1 = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h",
            marker: {
                color: 'rgb(117, 86, 151)'
            }            
        };

        // Setup the layout
        let layout1 = {
            paper_bgcolor: 'rgba(255,255,255,.6)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            title: {
                text: "<b>Top 10 OTUs found</b>",
                font: {color: "black", size: 20, family: "Signika"}
            }
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace1], layout1)
    });
};

// Function that builds the bubble chart
function buildBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let allData = data.samples;

        // Filter based on the value of the sample
        let value = allData.filter(result => result.id == sample);

        // Get the first index from the array
        let sampleData = value[0];

        // Get the otu_ids, labels and sample values
        let otu_ids = sampleData.otu_ids;
        let otu_labels = sampleData.otu_labels;
        let sample_values = sampleData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for bubble chart
        let trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids
            }
        };

        // Set up the layout
        let layout2 = {
            hovermode: "closest",
            paper_bgcolor: 'rgba(255,255,255,.6)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            title: {
                text: "<b>Samples</b>",
                font: {color: "black", size: 20, family: "Signika"}
            }
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace2], layout2)
    });
};

function buildGaugeChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        // Log the array of metadata objects after the have been filtered
        console.log(value)

        // Get the first index from the array
        let valueData = value[0];

        // Use Object.entries to get the key/value pairs and put into the demographics box on the page
        let washFrequency = Object.values(valueData)[6];
        
        // Set up the trace for the gauge chart
        let trace3 = {
            value: washFrequency,
            domain: {x: [0,1], y: [0,1]},
            title: {
                text: "<b>Belly Button Washing Frequency</b><br><em>Scrubs Per Week</em>",
                font: {color: "black", size: 20, family: "Signika"}
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [0,10], tickmode: "linear", dtick: 1},
                bar: {color: "rgb(56, 14, 75 )"},
                steps: [
                    {range: [0, 1], color: "rgba(186, 115, 209, .1)"},
                    {range: [1, 2], color: "rgba(186, 115, 209, .2)"},
                    {range: [2, 3], color: "rgba(186, 115, 209, .3)"},
                    {range: [3, 4], color: "rgba(186, 115, 209, .4)"},
                    {range: [4, 5], color: "rgba(186, 115, 209, .5)"},
                    {range: [5, 6], color: "rgba(186, 115, 209, .6)"},
                    {range: [6, 7], color: "rgba(186, 115, 209, .7)"},
                    {range: [7, 8], color: "rgba(186, 115, 209, .8)"},
                    {range: [8, 9], color: "rgba(186, 115, 209, .9)"},
                    {range: [9, 10], color: "rgba(186, 115, 209, 1)"},
                ]
            }
        };

        // Set up the Layout
        let layout3 = {
            paper_bgcolor: 'rgba(255,255,255,.6)',
            plot_bgcolor: 'rgba(0,0,0,0)',
        };

        // Call Plotly to plot the gauge chart
        Plotly.newPlot("gauge", [trace3], layout3)
    });
};

// Function that updates dashboard when sample is changed
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    buildSampleMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

// Call the initialize function
init();