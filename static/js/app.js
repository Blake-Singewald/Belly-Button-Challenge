// Assign the url to a constant variable
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Build the metadata panel
function buildMetadata(sample) {
  d3.json(url).then((data) => {

    // get the metadata field

    var metadata= data.metadata;
    var resultsarray= metadata.filter(sampleobject => 
      sampleobject.id == sample);
    // Filter the metadata for the object with the desired sample number

    var result= resultsarray[0]
    
    // Use d3 to select the panel with id of `#sample-metadata`

    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata

    panel.html("");
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json(url).then((data) => {

    // Get the samples field

    var samples= data.samples;

    // Filter the samples for the object with the desired sample number

    var resultsarray= samples.filter(sampleobject => 
      sampleobject.id == sample);
  
    var result= resultsarray[0]

    // Get the otu_ids, otu_labels, and sample_values

    var values = result.sample_values;

    var ids = result.otu_ids;

    var labels = result.otu_labels;
    // Build a Bubble Chart

    var LayoutBubble = {
      margin: { t: 0 },
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
      };

      var DataBubble = [ 
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          }
      }
    ];

    // Render the Bubble Chart
    Plotly.newPlot("bubble", DataBubble, LayoutBubble);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var bar_data =[
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
  
      }
    ];
  
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately  
    // Render the Bar Chart

    Plotly.newPlot("bar", bar_data, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json(url).then((data) => {

    // Get the names field
    // Use d3 to select the dropdown with id of `#selDataset`

    var selectNames = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selectNames
          .append("option")
          .text(sample)
          .property("value", sample);
      });

    // Get the first sample from the list

    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample

    buildCharts(firstSample);
    buildMetadata(firstSample);

    });
  });
}

// Function for event listener

function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  
  console.log("New sample selected:", newSample);
  buildCharts(newSample);
  buildMetadata(newSample);

}

// Initialize the dashboard
init();
