import React, { KeyboardEventHandler } from 'react';

import CreatableSelect from 'react-select/creatable';

const components = {
  DropdownIndicator: null,
};

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

const CreateableSelect = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [value, setValue] = React.useState<readonly Option[]>([]);

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        setValue((prev) => [...prev, createOption(inputValue)]);
        setInputValue('');
        event.preventDefault();
    }
  };

  return (
    <CreatableSelect
      components={components}
      inputValue={inputValue}
      isClearable
      isMulti
      isSearchable={false}
      menuIsOpen={false}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      placeholder=""
      value={value}
    />
  );
};

export default CreateableSelect;