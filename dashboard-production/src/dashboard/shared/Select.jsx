import React from 'react';
import chroma from 'chroma-js';

// import { ColourOption, colourOptions } from '../data';
import colourOptions from '../../data/colors'
import Select from 'react-select';

const dot = (color = 'transparent') => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const colourStyles = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : undefined,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.color
            : color.alpha(0.3).css()
          : undefined,
      },
    };
  },
  input: (styles) => ({ ...styles, ...dot() }),
  placeholder: (styles) => ({ ...styles, ...dot('#ccc') }),
  singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
};

export default function ReactSelect ( props ) {
  let colorValue;
  if ( props.value ) {
    colorValue = colourOptions.find( ( el ) => el.value.toLowerCase() === props.value.toLowerCase() )
  }

  return (
    ( props.addSpecificationColor )
      ? (
        <Select
          options={colourOptions}
          onChange={option => {
            props.addSpecificationColor(props.Id,option.value)
          }}
          styles={colourStyles}
        /> )
      : ( <Select
        isDisabled={props.isDisabled?props.isDisabled:false}
        defaultValue={colorValue}
        value={colorValue}
        options={colourOptions}
        onChange={props.setValue&&(( option ) => props.setValue( option.value ))}
        styles={colourStyles}
      /> )
        
  );
};

// class ReactSelect extends React.Component{
//     handleChange = selectedOption => {
//     console.log(`Option selected:`, selectedOption);
//     };
//     render () {
//         return (
//             <Select
//         defaultValue={colourOptions[2]}
//         options={colourOptions}
//         onChange={this.handleChange}
//         styles={colourStyles}
//     />
//         )
//     }
// }

// export default ReactSelect 