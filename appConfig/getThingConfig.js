import thingNames from './thingNames';

// возвращает конфиг для заданной Thing

const getThingConfig = thingName => {
  if (!thingNames.includes(thingName)) {
    throw new TypeError(
      `Uknown modelName "${thingName}" of creating thing model!`,
    );
  }
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(`./Things/${thingName}.js`);
};

export default getThingConfig;
