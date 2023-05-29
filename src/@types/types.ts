type FilterFunction<T> = (value: T, index: number, array: T[], filterArg: any) => boolean;

type dataSourceFunction<T> = (...args   : any) => Promise<T>;