const buttons = document.querySelectorAll(".FxBtn")

for (const button of buttons) {

    button.addEventListener('click', function(event) {


        var div = document.querySelector('#FxOutput');
        while (div.firstChild) {
            div.removeChild(div.firstChild)
        }

        d3.select("svg").remove();

        let word = button.innerHTML

        let h3 = document.createElement('h3');
        h3.innerHTML = word
        div.appendChild(h3)

        const opts = {
            method: 'POST',
            body: JSON.stringify({ word: word }),
            headers: { 'Content-Type': 'application/json' }
        }

        fetch('/cloud', opts)
            .then(res =>
                res.json())
            .then(data => {
                makeCloud(data.output)
            })
    })
}


function makeCloud(data) {

    twArr = data.join(' ').split(' ')

    var fill = d3.scale.category20();

    var layout = d3.layout.cloud()
        .size([800, 300])
        .words(
            twArr.map(function(d) {
                return { text: d, size: 10 + Math.random() * 90, test: "haha" };
            }))
        .rotate(0)
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw);

    layout.start();

    function draw(words) {
        d3.select("body").append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }

}