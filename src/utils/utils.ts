/* eslint-disable import/prefer-default-export */
import { IOptions } from '../../types';

export const sortOptions = (list: Array<IOptions>) => {
  const returnList = list.sort((a, b) => a.index - b.index);
  return returnList;
};
