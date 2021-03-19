function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultsarray = metadata.filter(sampleobject => sampleobject.id === sample);
        var result = resultsarray[0];
        var panel = d3.select("#sample-metadata");
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key}: ${value}`);
        });
    });
}


function buildCharts(sample) {
    //get sample data for the plots
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultsarray = samples.filter(sampleobject => sampleobject.id == sample);
        var result = resultsarray[0]

        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;


        //Build a Bubble chart
        var layoutBubble = {
            margin: { t: 0},
            xaxis: { title: "IDs"},
            hovermode: "closest",
        };

        var dataBubble = [
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

        Plotly.plot("bubble", dataBubble, layoutBubble);
        
        //Build a bar Chart
        
        var barData = [
            {
                y: ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
                x: values.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"
                
            }
        ];

        var barLayout = {
            title: "Top 10 Bacteria Cultured",
            margin: { t: 30, l:150}
        };

        Plotly.newPlot("bar", barData, barLayout);
    });
}

function init() {
    //Get reference from the dropdown select element
    var selector = d3.select("#selDataset");

    //Use the list of 'names' to populate the select pieces
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        //use the first sample from the list to generate the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    // Get new sample data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}
//Initialize the dashboard
init();
