import { IOptions } from '../../types';

function OptionToShow({ option }: { option: IOptions }) {
  if (option.type === 'main') {
    return (
      <option value={`${option.value}`}>{option.name}</option>
    );
  }
  if (option.type === 'sub') {
    return (
      <option value={`${option.value}`}>
          &nbsp;&nbsp;&nbsp;&nbsp;
        {option.name}
      </option>
    );
  }
  if (option.type === 'child') {
    return (
      <option value={`${option.value}`}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {option.name}
      </option>
    );
  }

  return (
    <option value={`${option.value}`}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      {option.name}
    </option>
  );
}

export default OptionToShow;
