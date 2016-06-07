import React, { Component, PropTypes } from 'react'
import d3 from 'd3'
import { Map } from 'immutable'

import style from './Datamap.css'
import config from 'config/maps'

export default class Datamap extends Component {
  componentDidMount() {
    this.renderMap()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mapType !== this.props.mapType) {
      d3.select(this.refs.datamap).selectAll('*').remove()
      this.renderMap()
    }
  }

  componentWillUnmount() {
    d3.select(this.refs.datamap).remove()
  }

  renderMap() {
    const tooltip = d3.select('body').append('div')
      .attr('class', style.tooltip)
      .style('opacity', 0)

    const { svgWidth, svgHeight } = this.props
    const mapConfig = config.configs[this.props.mapType].mapUi
    const projectionName = mapConfig.projection
    const scaleDenominator = mapConfig.scaleDenominator

    const projection = d3.geo[projectionName]().scale(svgWidth / scaleDenominator)
      .translate([svgWidth / 2, svgHeight / 2])
    const path = d3.geo.path().projection(projection)

    d3.select(this.refs.datamap)
      .selectAll('path')
      .data(this.props.topoData.get(this.props.mapType))
      .enter()
      .append('path')
      .style('fill', '#000')
      .attr('class', 'map-subunit')
      .attr('d', path)
      .on('mouseover', function (data) {
        d3.select(this).style('fill', '#fff8ee')

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
        d3.select(this).style('fill', '#000')
        tooltip.style('opacity', 0)
      })
  }

  render() {
    return <g ref="datamap"></g>
  }
}

Datamap.propTypes = {
  svgWidth: PropTypes.number.isRequired,
  svgHeight: PropTypes.number.isRequired,
  topoData: PropTypes.instanceOf(Map).isRequired,
  mapType: PropTypes.string.isRequired,
}
