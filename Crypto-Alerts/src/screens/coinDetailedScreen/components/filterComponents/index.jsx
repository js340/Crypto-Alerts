import React, { memo } from 'react';
import { Text, Pressable } from 'react-native';

const FilterComponent = (props) => {
  const { filterDay, filterText, selectedRange, setSelectedRange } = props;
  const isFiltereSelected = (filter) => filter === selectedRange;
  return (
    <Pressable 
      style={{ 
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        borderRadius: 5, 
      }}
      onPress={() => setSelectedRange(filterDay)}
    >
      <Text style={{ color: isFiltereSelected(filterDay) ? "white" : "grey" }}>{filterText}</Text>
    </Pressable>
  )
};

export default memo(FilterComponent);