import React, { Component, PropTypes } from 'react'
import d3 from 'd3'
import { Map } from 'immutable'

import datamapRenderer from './datamapRenderer'

export default class Datamap extends Component {
  componentDidMount() {
    datamapRenderer(this.refs.datamap, this.props)
  }

  componentDidUpdate() {
    d3.select(this.refs.datamap).selectAll('*').remove()
    datamapRenderer(this.refs.datamap, this.props)
  }

  componentWillUnmount() {
    d3.select(this.refs.datamap).remove()
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
  regionData: PropTypes.instanceOf(Map).isRequired,
  colorScale: PropTypes.func.isRequired,
  noDataColor: PropTypes.string.isRequired,
  borderColor: PropTypes.string.isRequired,
}
