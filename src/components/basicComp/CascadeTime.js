import React from "react";
import { TimePicker, DatePicker } from 'antd';
import moment from 'moment';

const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
}

export default class CascadeTime extends React.Component {

    state = {
        values: this.props.defaultValue
    }

    // static getDerivedStateFromProps (nextProps) {
    //     console.log(nextProps)
    // }
    onChange = (type) => (value, dateString) => {
   
        const values = {
            ...this.state.values,
            [type]: dateString
        }

        this.setState({
            values
        })

        this.props.callback(values)
    }

    render() {
        const { defaultValue } = this.props
        const { values } = this.state
        // console.log(defaultValue)
        const { date = null, startTime = null, endTime = null } = defaultValue
        // console.log(this.state.values)
        
        const style = {
            padding: '0 5px'
        }
        
        return (
            <span style={style}>
                <DatePicker onChange={this.onChange('date')} defaultValue={moment(date, 'YYYY-MM-DD')} disabledDate={disabledDate}/> -
                <TimePicker onChange={this.onChange('startTime')} defaultValue={moment(startTime, 'HH:mm:ss')}/>
                <span style={style}>~</span> 
                <TimePicker onChange={this.onChange('endTime')} defaultValue={moment(endTime, 'HH:mm:ss')}/>
            </span>
        );
    }
}