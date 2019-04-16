
import React from 'react'

const MSelect = ({visible}) => {
    return (
        <div className='loader' style={visible ? {display: 'block'}:{display: 'none'}}>
            <div className='loader-inner'></div>
            <div className='loader-inner'></div>
            <div className='loader-inner'></div>
            <div className='loader-inner'></div>
            <div className='loader-inner'></div>
        </div>
    )
}

export default MSelect
