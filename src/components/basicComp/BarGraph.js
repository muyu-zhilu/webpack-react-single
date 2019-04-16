import React from "react";
import {
    G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Guide,
    Shape,
    Facet,
    Util,
    Animate
} from "bizcharts";
import moment from 'moment'
import DataSet from "@antv/data-set";

const { Text } = Guide

export default class BarGraph extends React.Component {

    dataFormat = () => {
        const { data, x_fields, xAxis, yAxis } = this.props
        const ds = new DataSet();
        const dv = ds.createView().source(data);

        dv.transform({
            type: "fold",
            fields: x_fields,
            key: 'xAxis',// key字段
            value: 'yAxis' // value字段
        });

        dv.rows = dv.rows.filter(el => el.yAxis !== undefined)

        return dv
    }

    shape = () => {
        Shape.registerShape("interval", "tip", {
            getShapePoints({ x, y, y0, size }) {
                return [
                    {
                        x: x,
                        y: y + size + 0.1
                    }
                ];
            },
        
            drawShape(cfg, group) {
                const traceId = cfg._id.split('-')           
                const carNumber = traceId[traceId.length - 1]

                const ids = cfg._id.split('/')
                const isCarNumber = ids[ids.length - 2]

                const name = cfg.origin._origin.name
                if (isCarNumber === 'true' && name==='应用') {
                    const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
                  
                    const p1 = points[0];
    
                    group.addShape("text", {
                        attrs: {
                            text: carNumber,
                            x: p1.x - 30,
                            y: p1.y - 25,
                            fontFamily: "PingFang SC",
                            fontSize: 12,
                            fill: "#444"
                        }
                    });
        
                    var point = {
                        x: p1.x,
                        y: p1.y - 10
                    };
        
                    var decorator1 = group.addShape('circle', {
                        attrs: {
                            x: point.x,
                            y: point.y,
                            r: 10,
                            fill: '#00c87f',
                            opacity: 0.5
                        }
                    });
        
                    decorator1.animate({
                        r: 16,
                        opacity: 0,
                        repeat: true
                    }, 1000, 'easeLinear');
        
                    group.addShape('circle', {
                        attrs: {
                            x: point.x,
                            y: point.y,
                            r: 6,
                            fill: '#00c87f',
                            opacity: 0.7
                        }
                    });
                    group.addShape('circle', {
                        attrs: {
                            x: point.x,
                            y: point.y,
                            r: 1.5,
                            fill: '#00c87f'
                        }
                    });
                }
        
            }
        });
    }

    render() {
        const { color, scale, clickChart, tooltip, x_fields = [] } = this.props
        let data = []
        
        if (x_fields.length) { // 避免x_fields为空，dataSet警告
            data = this.dataFormat()          
        }  

        this.shape() 

        const AxisTitleProps = {
            position: 'end',
            autoRotate: false,
            textStyle: {
                fontSize: '12',
                textAlign: 'center',
                fill: '#999',
                fontWeight: 'bold'
            },
        }

        const LabelProps = {
            position: 'middle',
            offset: 0,
            content: "yAxis",
            textStyle: {
                fill: "#fff",
                fontWeight: "bold",
                shadowBlur: 2,
                shadowColor: "rgba(0, 0, 0, .45)",
            },
            formatter: val => {
                return val || 0;
            }
        }

        const height = window.innerHeight - 235

        return (
            <div>
                <Chart height={height > 550 ? height : 550} data={data} scale={scale} forceFit padding={[20, 60, 100, 100]} onClick={clickChart}>
                    <Legend />
                    <Axis name='xAxis' title={{ ...AxisTitleProps, offset: 40 }} />
                    <Axis name='yAxis' title={{ ...AxisTitleProps, offset: -50 }} />
                    <Tooltip showTooltipMarker={false} />
                    <Geom
                        type="intervalStack"
                        position="xAxis*yAxis"
                        color={[color, ['#33A3FF', '#F17442', '#FFD74E', '#006EDE', '#f5222d']]}
                        // color={color}
                        tooltip={tooltip}
                    >
                        {x_fields.length <= 25 ?
                            <Label {...LabelProps} /> : null}
                    </Geom>

                    <Geom
                        position="xAxis*yAxis"
                        shape="tip"
                        tooltip={false}
                    />
                </Chart>
            </div>
        );
    }
}