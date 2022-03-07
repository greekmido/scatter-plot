import './index.css';
import * as d3 from 'd3';

const height=600;
const width =800;
const margin=30;
let svg = d3.select('body')
.append('svg')
.attr('width',width)
.attr('height',height)
.attr('id','plot');

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
.then((response)=>response.json())
.then(data=>{
    console.log(d3.extent(data,d=>new Date(1970,0,1,0,d.Time.split(':')[0],d.Time.split(':')[1])));
 
    let yScale = d3.scaleTime().domain(d3.extent(data,d=>new Date(1970,0,1,0,d.Time.split(':')[0],d.Time.split(':')[1])))
                    .range([height-margin,margin]);
    let xScale = d3.scaleTime().domain([d3.min(data,d=>new Date(d.Year-1,0)),d3.max(data,d=>new Date(d.Year+1,0))])
                .range([60,width-margin]);

    let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
    let xAxis = d3.axisBottom(xScale);

    let div = d3.select('body').append('div').attr('class','tooltip').html('hello div').style('opacity','0');

    d3.select('#plot')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class','dot')
      .attr('data-xvalue',(d)=>xScale(new Date(d.Year,0)))
      .attr('data-yvalue',(d)=>yScale(new Date(1970,0,1,0,d.Time.split(':')[0],d.Time.split(':')[1])))
      .style('fill',(d)=>d.Doping.length>0?'blue':'orange')
      .style('opacity','0.9')
      .style('stroke','black')
      .style('stroke-width','1')
      .attr('cy',(d)=>yScale(new Date(1970,0,1,0,d.Time.split(':')[0],d.Time.split(':')[1])))
      .attr('cx',(d)=>xScale(new Date(d.Year,0)))
      .attr('r',5)
      .on('mouseover',function(event,d){
        div.style('opacity','1').style('top',(event.pageY) + "px").style('left',(event.pageX) + "px")
        .style('background',d.Doping.length>0?'lightblue':'orange')
        .html(`${d.Name}<br>Time: ${d.Time}<br>Year: ${d.Year}<br>${d.Doping>0?'doping':''} ${d.Doping}`);
      })
      .on('mouseout',function(event,d){
        div.style('opacity',0)
      });

    d3.select('#plot').append('g').attr("transform", `translate(60, 0)`).call(yAxis)
    .attr('id','yaxis')
    .append("text").text("Time → ")
    .attr("y","20")
    .attr("x","-400")
    .attr("transform","rotate(-90)")
    .style("fill","blue")
    .style("font-size","20");

    d3.select('#plot').append("g").attr("transform", `translate(0, ${height-margin})`).call(xAxis)
    .attr('id','xaxis')
    .append("text")
    .text("Years →")
    .attr("x","60")
    .attr("y","25")
    .style("fill","blue")
    .style("font-size","20");

    d3.select('#plot').append('g').attr('id','legend').style('height','100px').style('width','100px')
    .append('rect').style('fill','orange').style('height','10px').style('width','10px')
    .attr('x',width-150+'px').attr('y',(height/2)+15+'px');

    d3.select('#legend').append('rect').style('fill','blue').attr('x',width-150+'px').attr('y',height/2+'px')
    .style('height','10px').style('width','10px');

    d3.select('#legend').append('text').text('doping allegations').attr('x',width-135+'px').attr('y',(height/2)+10+'px')
    d3.select('#legend').append('text').text('no doping allegations').attr('x',width-135+'px').attr('y',(height/2)+25+'px')
})
.catch(e=>console.log('failed loading data'+e))





if(module.hot){
    module.hot.accept();
}
