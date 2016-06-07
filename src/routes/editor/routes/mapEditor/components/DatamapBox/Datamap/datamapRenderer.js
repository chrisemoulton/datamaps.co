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

  const subunitPath = () => {
    const mapConfig = config.configs[mapType].mapUi
    const projectionName = mapConfig.projection
    const scaleDenominator = mapConfig.scaleDenominator

    const projection = d3.geo[projectionName]().scale(svgWidth / scaleDenominator)
      .translate([svgWidth / 2, svgHeight / 2])
    return d3.geo.path().projection(projection)
  }

  const subunitValue = (data) => {
    const subunitData = regionData.find((datum) => datum.get('code') === data.id)
    return subunitData ? subunitData.get('value') : ''
  }

  const addDefaultSubunitStyle = (subunit, fill) => {
    subunit
      .style('fill', fill)
      .style('stroke', borderColor)
      .style('stroke-width', 0.5)
  }

  d3.select(datamapContainer)
    .selectAll('path')
    .data(topoData.get(mapType))
    .enter()
    .append('path')
    .each(function _updateSubunit(thisData) {
      const thisSubunit = d3.select(this)
      const value = subunitValue(thisData)
      const fill = value === '' ? noDataColor : colorScale(value)

      addDefaultSubunitStyle(thisSubunit, fill)

      thisSubunit
        .attr('d', subunitPath())
        .on('mouseover', function _onMouseover(data) {
          this.parentNode.appendChild(this)
          thisSubunit
            .style('fill', '#FFCCBC')
            .style('stroke', '#FF5722')
            .style('stroke-width', 2)

          tooltip
            .style('opacity', 1)
            .html(`<div>${data.properties.name}<br />${value}</div>`)
        })
        .on('mousemove', () =>
          tooltip
            .style('left', (d3.event.pageX + 20) + 'px')
            .style('top', (d3.event.pageY + 20) + 'px')
        )
        .on('mouseout', () => {
          addDefaultSubunitStyle(thisSubunit, fill)
          tooltip.style('opacity', 0)
        })
    })
}
