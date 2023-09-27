// URL for data
let url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Bar Graph Section
function createBarChart(sample) {
  let OTUs = sample.sample_values.slice(0, 10).reverse();
  let OTUIds = sample.otu_ids.slice(0, 10).map((id) => `OTU ${id}`).reverse();
  let OTULabels = sample.otu_labels.slice(0, 10).reverse();

  let trace = {
    x: OTUs,
    y: OTUIds,
    text: OTULabels,
    type: "bar",
    orientation: "h",
  };

  let data = [trace];
  let layout = {
    title: "Top 10 OTUs",
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU IDs" },
  };

  Plotly.newPlot("bar", data, layout);
}

// Chart updates when a new sample is selected
function updateBarChart(samplesData, selectedSample) {
  let selectedSampleData = samplesData.samples.find(
    (sample) => sample.id === selectedSample
  );
  createBarChart(selectedSampleData);
}

// BubbleChart section
function createBubbleChart(sample) {
  let trace = {
    x: sample.otu_ids,
    y: sample.sample_values,
    text: sample.otu_labels,
    mode: "markers",
    marker: {
      size: sample.sample_values,
      color: sample.otu_ids,
      colorscale: "Earth",
    },
  };

  let data = [trace];

  let layout = {
    title: "Bubble Chart for Each Sample",
    xaxis: { title: "OTU IDs" },
    yaxis: { title: "Sample Values" },
  };

  Plotly.newPlot("bubble", data, layout);
}

// Updating BubbleChart
function updateBubbleChart(selectedSample) {
  d3.json(url).then(function (data) {
    let selectedSampleData = data.samples.find(
      (sample) => sample.id === selectedSample
    );
    createBubbleChart(selectedSampleData); 
  });
}
//Metadata section
function updateSampleMetadata(selectedSample) {
    d3.json(url).then(function (data) {
      let metadata = data.metadata.find((meta) => meta.id === parseInt(selectedSample));
      let sampleMetaDiv = d3.select("#sample-metadata");
      sampleMetaDiv.html("");
  
      Object.entries(metadata).forEach(([key, value]) => {
        sampleMetaDiv.append("p").text(`${key}: ${value}`);
      });
    });
  }

// Initializes the dashboard
function init() {
  let dropdown = d3.select("#selDataset");

  d3.json(url).then(function (data) {
    data.names.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    d3.select("#selDataset").on("change", function () {
      let selectedSample = d3.select("#selDataset").property("value");
      updateBarChart(data, selectedSample);
      updateBubbleChart(selectedSample);

      updateSampleMetadata(selectedSample);
    });
    
    updateBarChart(data, data.names[0]);
    updateBubbleChart(data.names[0]);
  });
}
  

// Initialize the dashboard
init();
