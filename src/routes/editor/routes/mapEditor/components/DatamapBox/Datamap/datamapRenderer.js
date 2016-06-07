import d3 from 'd3'

import style from './Datamap.css'
import config from 'config/maps'

export default (datamapContainer, props) => {
  const {
    svgWidth,
    svgHeight,
    noDataColor,
    borderColor,
    colorScale,
    mapType,
    regionData,
    topoData,
  } = props

  const tooltip = d3.select('body').append('div')
    .attr('class', style.tooltip)
    .style('opacity', 0)

  const mapConfig = config.configs[mapType].mapUi
  const projectionName = mapConfig.projection
  const scaleDenominator = mapConfig.scaleDenominator

  const projection = d3.geo[projectionName]().scale(svgWidth / scaleDenominator)
    .translate([svgWidth / 2, svgHeight / 2])
  const path = d3.geo.path().projection(projection)

  d3.select(datamapContainer)
    .selectAll('path')
    .data(topoData.get(mapType))
    .enter()
    .append('path')
    .attr('data-fill', (data) => {
      const subunitData = regionData.find((datum) => datum.get('code') === data.id)
      const subunitValue = subunitData ? subunitData.get('value') : null
      return subunitValue === '' ? noDataColor : colorScale(subunitValue)
    })
    .style('fill', function () {
      return this.getAttribute('data-fill')
    })
    .style('stroke', borderColor)
    .style('stroke-width', 0.5)
    .attr('class', 'map-subunit')
    .attr('d', path)
    .on('mouseover', function (data) {
      d3.select(this)
        .style('fill', '#FFCCBC')
        .style('stroke', '#FF5722')
        .style('stroke-width', 2)

      this.parentNode.appendChild(this)

      tooltip
        .style('opacity', 1)
        .html(`<div>${data.properties.name}<br /></div>`)
    })
    .on('mousemove', function () {
      tooltip
        .style('left', (d3.event.pageX + 20) + 'px')
        .style('top', (d3.event.pageY + 20) + 'px')
    })
    .on('mouseout', function () {
      d3.select(this)
        .style('fill', function () {
          return this.getAttribute('data-fill')
        })
        .style('stroke', borderColor)
        .style('stroke-width', 0.5)

      tooltip.style('opacity', 0)
    })
}
