import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const SoloPieChart = ( { pieChartData, COLORS }) => {
    
    const [activeIndex, setActiveIndex] = useState(-1)

    const onPieEnter = ( _,index) => {
        setActiveIndex(index);
      };
    
      const onPieLeave = () => {
        setActiveIndex(-1);
      };

      const formatter = (value) => {
        return `${value.toFixed(2)}`
    }

    return <><PieChart width={400} height={400}>
    <Pie
        dataKey='value'
        isAnimationActive={true}
        data={pieChartData}
        cx={200}
        cy={200}
        outerRadius={140}
        fill='#8884d8'
        label={false}
        onMouseEnter={onPieEnter}
        onMouseLeave={onPieLeave}
        >
            {pieChartData.map((entry, index) => (
                <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke={activeIndex === index ? 'white' : undefined}
                strokeWidth={activeIndex === index? 4 : 1}
                />
            ))}
        </Pie>
        <Tooltip formatter={formatter}/>
        <Legend/>
</PieChart></>
}


export default SoloPieChart
