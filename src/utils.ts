import { NAME_SPACE_FLAG } from './constant';

export const getKey = (str: string):string => str.substring(str.indexOf(NAME_SPACE_FLAG) + 1, str.length + 1);
